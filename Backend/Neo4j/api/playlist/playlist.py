from flask import request, jsonify
from flask_restplus import Namespace, Resource

from firebase_admin.messaging import UnregisteredError

from models.DeviceModel import Device
from models.GroupModel import Group
from models.UserModel import User
from models.PlaylistModel import Playlist
from models.TrackModel import Track

from utils.logging import Logger
from utils.notifications import NotificationUtil as Notify
from utils.response import check_required_fields, make_response


logger = Logger("playlist").logger
playlist_ns = Namespace('Playlist', description='Endpoints that create/edit/retrieve playlists')


class CreatePlaylist(Resource):
    @playlist_ns.doc("Creates a new playlist for user")
    def post(self):
        """Creates a new playlist for user"""
        request_json = request.get_json()
        required_fields = ["name", "owner"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        owner = None
        if request_json['type'].upper() == 'GROUP':
            owner = Group.find_one(id=request_json['owner'])
            if not owner:
                return make_response((f"Group[{request_json['owner']}] not found.", 404))

            current_user = User.find_one(id=request.user)
            if not current_user:
                return make_response((f"User[{request.user}] not found.", 404))

            if not owner.check_visibility(current_user.get_node()):
                return make_response((f"User does not have permissions to create playlist for this group.", 401))
        elif request_json['type'].upper() == 'USER':
            owner = User.find_one(id=request_json.pop("owner"))
            if not owner:
                return make_response((f"User[{request_json['owner']}] not found.", 404))

        try:
            playlist = Playlist(request_json)
        except ValueError as e:
            return make_response((f"Error when creating playlist: {str(e)}.", 400))

        try:
            playlist.save()
            playlist.link_owner(owner.get_node())
            response = jsonify(playlist.json())
            response.status_code = 201
            return response
        except Exception as e:
            return make_response((f"Error when creating playlist: {str(e)}.", 400))


class GetPlaylist(Resource):
    @playlist_ns.doc("Get playlist object given a Playlist ID")
    def get(self, _id):
        """Get playlist object given a Playlist ID"""
        user = User.find_one(id=request.user)
        if not user:
            return make_response((f"User[{request.user}] not found.", 404))

        playlist = Playlist.find_one(id=_id)
        if not playlist:
            return make_response((f"Playlist[{_id}] not found.", 404))

        if playlist.check_visibility(user.get_node()):
            response = jsonify(playlist.json())
            response.status_code = 200
            return response
        else:
            return make_response((f"User[{request.user}] does not have access to the playlist[{_id}].", 401))


class ListPlaylists(Resource):
    @playlist_ns.doc("Lists the playlists of the user")
    def get(self):
        """Lists the playlists of the user"""
        user = User.find_one(id=request.user)
        if not user:
            return make_response((f"User[{request.user}] not found.", 404))

        return {"playlists": user.get_playlists()}, 200


class EditPlaylist(Resource):
    @playlist_ns.doc("Adds/Removes tracks to a playlist or edits playlist details")
    def put(self, _id):
        """Adds/Removes tracks to a playlist or edits playlist details"""
        request_json = request.get_json()
        required_fields = ["operation", "tracks"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        playlist = Playlist.find_one(id=_id)
        if not playlist:
            return make_response((f"Playlist[{_id}] not found.", 404))

        user = User.find_one(id=request.user)
        if not user:
            return make_response((f"User[{request.user}] not found.", 404))

        if playlist.check_ownership(user.get_node()):
            for track_dict in request_json["tracks"]:
                track_id = track_dict["id"]
                track = Track.find_one(id=track_id)
                if request_json["operation"] == "addTracks":
                    playlist.add_track(track.get_node())
                elif request_json["operation"] == "removeTracks":
                    playlist.remove_track(track.get_node())
                else:
                    return make_response((f"Invalid operation[{request_json['operation']}]", 400))
        else:
            return make_response((f"User[{request.user}] does not have access to the playlist[{_id}].", 401))


class DeletePlaylist(Resource):
    @playlist_ns.doc("Deletes a playlist")
    def delete(self, _id):
        """Deletes a playlist"""
        playlist = Playlist.find_one(id=_id)
        if not playlist:
            return make_response((f"Playlist[{_id}] not found.", 404))

        user = User.find_one(id=request.user)
        if playlist.check_ownership(user.get_node()):
            playlist.delete()
            return make_response(("Delete successful.", 200))
        else:
            return make_response((f"User{request.user} does not have permissions to delete.", 401))


class SharePlaylist(Resource):
    @playlist_ns.doc("Shares the playlist to users given a Playlist ID and a list of User IDs")
    def post(self, _id):
        """Shares the playlist to users given a Playlist ID and a list of User IDs"""
        request_json = request.get_json()
        required_fields = ["people"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        playlist = Playlist.find_one(id=_id)
        if not playlist:
            return make_response((f"Playlist[{_id}] not found.", 404))

        current_user = User.find_one(id=request.user)
        for user_dict in request_json["people"]:
            user_id = user_dict["id"]
            user = User.find_one(id=user_id)
            if not user:
                return make_response((f"User[{user_id}] not found.", 404))

            if playlist.scope == 'PUBLIC' or playlist.check_ownership(current_user.get_node()):
                playlist.share(user.get_node())
                data_payload = {"Message": f"Playlist has been shared with you."}
                notify_payload = {"title": f"Playlist has been shared with you.", "body": ""}
                for device in user.get_devices():
                    try:
                        Notify.send(token=device["token"], data=data_payload, notification=notify_payload)
                    except UnregisteredError:
                        device = Device.find_one(id=device["id"])
                        device.delete()
                return make_response(("Playlist shared successfully.", 200))
            else:
                return make_response((f"User{request.user} does not have permissions to share.", 401))


class ListSharedPlaylists(Resource):
    @playlist_ns.doc("Returns a list of user's shared playlists")
    def get(self):
        """Returns a list of user's shared playlists"""
        user = User.find_one(id=request.user)
        if not user:
            return make_response((f"User[{request.user}] not found.", 404))

        return {"sharedPlaylists": user.get_shared_playlists()}, 200


playlist_ns.add_resource(CreatePlaylist, '/playlist/create/')
playlist_ns.add_resource(GetPlaylist, '/playlist/<_id>/')
playlist_ns.add_resource(ListPlaylists, '/playlists/')
playlist_ns.add_resource(EditPlaylist, '/playlist/<_id>/edit/')
playlist_ns.add_resource(DeletePlaylist, '/playlist/<_id>/delete/')
playlist_ns.add_resource(SharePlaylist, '/playlist/<_id>/share/')
playlist_ns.add_resource(ListSharedPlaylists, '/shared-playlists/')

