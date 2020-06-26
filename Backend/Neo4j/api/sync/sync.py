import time

from flask import request, jsonify
from flask_restplus import Resource, Namespace
from py2neo import Relationship

from models.PlaylistModel import Playlist
from models.TrackModel import Track
from models.UserModel import User

from utils.logging import Logger
from utils.extensions import neo4j
from utils.exceptions import SyncError
from utils.response import make_response

logger = Logger("register_device").logger

sync_ns = Namespace('Synchronization', description='Allows for synchronising changes between'
                                                   ' Local Database and Server')

graph = neo4j.get_db()


class Sync(Resource):
    @sync_ns.doc("Returns changes made on all the resources associated to the user given an User ID")
    def get(self):
        """Returns changes made on all the resources associated to the user given an User ID"""
        current_user = User.find_one(id=request.user)
        if not current_user:
            return make_response((f"User[{request.user}] not found.", 404))
        sync_fields = ["id", "email", "phone", "name", "username", "dob", "imageUrl"]
        user_dict = dict((k, v) for k, v in current_user.json().items() if k in sync_fields)
        final = {
            "changes": {
                "users": {
                    "created": [user_dict],
                    "updated": [],
                    "deleted": []
                }
            },
            "timestamp": str(time.time())
        }
        response = jsonify(final)
        response.status_code = 200
        return response

    @sync_ns.doc("Accepts all changes made in the local db and applies them to the actual db")
    def post(self):
        """Accepts all changes made in the local db and applies them to the actual db"""
        changes = request.get_json()
        print(changes)
        tx = graph.begin()

        try:
            current_user = User.find_one(id=request.user)
            if not current_user:
                raise SyncError(f"User[{request.user}] not found.")

            playlist_changes = changes["playlists"]
            for change in playlist_changes:
                for p in playlist_changes[change]:
                    if change == "created":
                        p.pop("owner", None)
                        try:
                            playlist = Playlist(p)
                        except ValueError as e:
                            raise SyncError(f"Validation error when creating playlist{p.id}] - {str(e)}.")
                        try:
                            playlist.save(tx=tx)
                            tx.create(Relationship(playlist.get_node(), "OWNED_BY", current_user.get_node()))
                        except Exception as e:
                            raise SyncError(f"Error when creating playlist{p.id}] - {str(e)}.")
                    else:
                        playlist = Playlist.find_one(id=p.id)
                        if change == "updated":
                            [setattr(playlist, k, v) for k, v in p.items() if hasattr(self, k)]
                            playlist.save(tx=tx)
                        else:
                            tx.delete(playlist)
            tx.commit()
            playlist_track_changes = changes["playlistsTracks"]
            for change in playlist_track_changes:
                for pt in playlist_track_changes[change]:
                    playlist = Playlist.find_one(id=pt["playlistId"])
                    track = Track.find_one(id=pt["trackId"])
                    if change == "created":
                        playlist.add_track(track.get_node())
                    elif change == "deleted":
                        playlist.remove_track(track.get_node())
                    else:
                        raise SyncError("playlistsTracks table cannot be updated.")
            return make_response(("Sync succeeded.", 200))
        except SyncError as e:
            tx.rollback()
            return make_response((str(e), 400))


sync_ns.add_resource(Sync, '/sync/')
