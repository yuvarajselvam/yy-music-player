import time
import json
import copy

from py2neo import Relationship
from flask import request, jsonify
from flask_restplus import Resource, Namespace
from firebase_admin.messaging import UnregisteredError

from models.UserModel import User
from models.TrackModel import Track
from models.AlbumModel import Album
from models.DeviceModel import Device
from models.PlaylistModel import Playlist

from utils.logging import Logger
from utils.extensions import neo4j
from utils.response import make_response
from utils.exceptions import SyncError, AppLogicError
from utils.notifications import NotificationUtil as Notify

logger = Logger("register_device").logger

sync_ns = Namespace('Synchronization', description='Allows for synchronising changes between'
                                                   ' Local Database and Server')

graph = neo4j.get_db()

change_log_template = {"created": [], "updated": [], "deleted": []}


def update_change_log(change_logs, devices, current_device_id, resource_id, change):
    for device_id in devices:
        if device_id != current_device_id:
            if device_id not in change_logs:
                change_logs[device_id] = copy.deepcopy(change_log_template)
            change_logs[device_id][change].append(resource_id)
    return change_logs


def sanitize_change_log(device, log, table):
    dev_created, dev_deleted = getattr(device, table + "Created"), getattr(device, table + "Deleted")
    dev_updated = getattr(device, table + "Updated", [])
    deleted = list(set(log["deleted"] + dev_deleted) - set(log["created"] + dev_created))
    updated = list(set(log["updated"] + dev_updated)
                   - set(log["deleted"] + dev_deleted + log["created"] + dev_created))
    created = list(set(log["created"] + dev_created) - set(log["deleted"] + dev_deleted))
    setattr(device, table + "Created", created)
    setattr(device, table + "Updated", updated)
    setattr(device, table + "Deleted", deleted)
    return device


def get_change_log(device, table):
    change_log = copy.deepcopy(change_log_template)
    dev_created = getattr(device, table + "Created")
    dev_updated = getattr(device, table + "Updated", [])
    for resource_id in dev_created:
        resource = None
        if table == "playlist":
            playlist = Playlist.find_one(id=resource_id)
            resource = playlist.json(deep=False)
            resource["owner"] = playlist.get_owner().id
        elif table == "playlistTrack":
            pt = resource_id.split("__")
            resource = {"id": resource_id, "playlistId": pt[0], "trackId": pt[1]}
        change_log["created"].append(resource)
    for resource_id in dev_updated:
        change_log["updated"].append(Playlist.find_one(id=resource_id).json(deep=False))
    change_log["deleted"] = getattr(device, table + "Deleted")
    return change_log


def get_track_album_changes(device, pt_changes):
    tx = graph.begin()
    t_change_log = copy.deepcopy(change_log_template)
    a_change_log = copy.deepcopy(change_log_template)
    track_count = {}
    for pt in pt_changes["created"]:
        track_count[pt["trackId"]] = track_count[pt["trackId"]]+1 if pt["trackId"] in track_count else 1
    for track_id in track_count:
        track = Track.find_one(id=track_id)
        album = track.album
        if device.get_track_link_count(track.get_node(), tx=tx) == track_count[track_id]:
            t_resource = dict(track.get_node())
            del t_resource["searchTerm"]
            del t_resource["saavnUrl"]
            t_resource["isDownloaded"] = False
            t_resource["albumId"] = album["id"]
            album_present = False
            for t in Album.find_one(id=album["id"]).tracks:
                t_count = track_count[t["id"]] if t["id"] in track_count else 0
                if device.get_track_link_count(Track.find_one(id=t["id"]).get_node(), tx=tx) > t_count:
                    album_present = True
                    break
            if not album_present:
                del album["searchTerm"]
                a_change_log["created"].append(album)
            t_change_log["created"].append(t_resource)
    for pt in pt_changes["deleted"]:
        track_id = pt.split("__")[1]
        track = Track.find_one(id=track_id)
        album_id = track.album["id"]
        album = Album.find_one(id=album_id)
        t_change_log["deleted"] += [track_id] if not device.get_track_link_count(track.get_node(), tx=tx) else []
        album_delete = True
        for t in album.tracks:
            if device.get_track_link_count(Track.find_one(id=t["id"]).get_node(), tx=tx):
                album_delete = False
        a_change_log["deleted"] += [] if not album_delete else [album_id]
    tx.commit()
    return t_change_log, a_change_log


class Sync(Resource):
    @sync_ns.doc("Returns changes made on all the resources associated to the user given an User ID")
    def get(self):
        """Returns changes made on all the resources associated to the user given an User ID"""
        current_user = User.find_one(id=request.user)
        if not current_user:
            return make_response((f"User[{request.user}] not found.", 404))

        device_id = request.headers.get("Device", None)
        current_device = Device.find_one(uniqueId=device_id)
        if not current_device:
            return make_response((f"Device[{device_id}] not found.", 404))
        if request.args["last_pulled_at"] == "null":
            sync_fields = ["id", "email", "phone", "name", "username", "dob", "imageUrl"]
            user_dict = dict((k, v) for k, v in current_user.json().items() if k in sync_fields)
            user_changes = [user_dict]
            changes = current_device.get_initial_sync_data()
            changes["users"] = {"created": user_changes, "updated": [], "deleted": []}
            final = {
                "changes": changes,
                "timestamp": str(time.time())
            }
        else:
            playlist_track_changes = get_change_log(current_device, "playlistTrack")
            track_changes, album_changes = get_track_album_changes(current_device, playlist_track_changes)
            final = {
                "changes": {
                    "playlists": get_change_log(current_device, "playlist"),
                    "playlistsTracks": playlist_track_changes,
                    "tracks": track_changes,
                    "albums": album_changes
                },
                "timestamp": str(time.time())
            }
        current_device.clear_change_log()
        print(json.dumps(final, indent=4, sort_keys=True))
        response = jsonify(final)
        response.status_code = 200
        return response

    # Push Changes

    @sync_ns.doc("Accepts all changes made in the local db and applies them to the actual db")
    def post(self):
        """Accepts all changes made in the local db and applies them to the actual db"""
        changes = request.get_json()
        print(json.dumps(changes, indent=4, sort_keys=True))
        tx = graph.begin()
        cur_device_id = request.headers.get("Device", None)

        try:
            current_user = User.find_one(id=request.user)
            if not current_user:
                raise SyncError(f"User[{request.user}] not found.")

            pt_change_logs = {}

            playlist_track_changes = changes["playlistsTracks"]
            for change in playlist_track_changes:
                for pt in playlist_track_changes[change]:
                    playlist_id = pt["playlistId"] if change == "created" else pt.split("__")[0]
                    track_id = pt["trackId"] if change == "created" else pt.split("__")[1]
                    playlist = Playlist.find_one(id=playlist_id)
                    devices = playlist.get_linked_devices()
                    track = Track.find_one(id=track_id)
                    try:
                        if change == "created":
                            playlist.add_track(track.get_node())
                        elif change == "deleted":
                            playlist.remove_track(track.get_node())
                        else:
                            raise SyncError("playlistsTracks table cannot be updated.")
                    except AppLogicError:
                        pass
                    resource_id = playlist.id + "__" + track.id
                    pt_change_logs = update_change_log(pt_change_logs, devices, cur_device_id, resource_id, change)
            for device_id in pt_change_logs:
                device = Device.find_one(uniqueId=device_id)
                if device.isSynced:
                    data_payload = {"type": 'sync_now'}
                    try:
                        Notify.send(device.token, data=data_payload)
                    except UnregisteredError:
                        logger.debug(f"Could not notify device: {device.name}")
                    device.isSynced = False
                device = sanitize_change_log(device, pt_change_logs[device_id], "playlistTrack")
                device.save()

            change_logs = {}

            playlist_changes = changes["playlists"]
            for change in playlist_changes:
                for p in playlist_changes[change]:
                    if change == "created":
                        try:
                            playlist = Playlist(p)
                        except ValueError as e:
                            raise SyncError(f"Validation error when creating playlist{p.id}] - {str(e)}.")
                        try:
                            playlist.save(tx=tx)
                            tx.create(Relationship(playlist.get_node(), "OWNED_BY", current_user.get_node()))
                            devices = playlist.get_linked_devices(tx=tx)
                            change_logs = update_change_log(change_logs, devices, cur_device_id, p["id"], change)
                        except Exception as e:
                            raise SyncError(f"Error when creating playlist{p.id}] - {str(e)}.")
                    else:
                        playlist = Playlist.find_one(id=p["id"] if isinstance(p, dict) else p)
                        devices = playlist.get_linked_devices()
                        if change == "updated":
                            [setattr(playlist, k, v) for k, v in p.items() if hasattr(self, k)]
                            playlist.save(tx=tx)
                            change_logs = update_change_log(change_logs, devices, cur_device_id, p["id"], change)
                        else:
                            if playlist.get_owner().id == current_user.id:
                                tx.delete(playlist.get_node())
                                change_logs = update_change_log(change_logs, devices, cur_device_id, p, change)
                            else:
                                playlist.unshare(current_user.get_node(), tx=tx)
            for device_id in change_logs:
                device = Device.find_one(uniqueId=device_id)
                if device.isSynced:
                    data_payload = {"type": 'sync_now'}
                    try:
                        Notify.send(device.token, data=data_payload)
                    except UnregisteredError:
                        logger.debug(f"Could not notify device: {device.name}")
                    device.isSynced = False
                device = sanitize_change_log(device, change_logs[device_id], "playlist")
                device.save(tx=tx)
            tx.commit()
            return make_response(("Sync succeeded.", 200))
        except SyncError as e:
            tx.rollback()
            return make_response((str(e), 400))


sync_ns.add_resource(Sync, '/sync/')
