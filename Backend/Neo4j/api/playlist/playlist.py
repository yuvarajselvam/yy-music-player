from flask import request, jsonify
from flask_restplus import Namespace, Resource

from models.UserModel import User
from models.PlaylistModel import Playlist
from models.TrackModel import Track

from utils.logging import Logger
from utils.response import check_required_fields, make_response

logger = Logger("playlist").logger
playlist_ns = Namespace('Playlist', description='Endpoints that create/edit/retrieve playlists')


class CreatePlaylist(Resource):
    @playlist_ns.doc("Creates a new playlist for user")
    def post(self):
        """Creates a new playlist for user"""
        request_json = request.get_json()
        required_fields = ["owner"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        owner = User.find_one(id=request_json.pop("owner"))
        if not owner:
            return make_response((f"User[{request_json['owner']}] not found.", 404))

        try:
            playlist = Playlist(request_json)
        except ValueError as e:
            return make_response((f"Error when creating user: {str(e)}.", 400))

        try:
            playlist.save()
            playlist.link_owner(owner.get_node())
            response = jsonify(playlist.json())
            response.status_code = 201
            return response
        except Exception as e:
            return make_response((f"Error when creating playlist: {str(e)}.", 400))


class GetPlaylist(Resource):
    @playlist_ns.doc("Get playlist object given an User ID and Playlist ID")
    def get(self, _user_id, _id):
        """Get playlist object given an User ID and Playlist ID"""
        user = User.find_one(id=_user_id)
        if not user:
            return make_response((f"User[{_user_id}] not found.", 404))

        playlist = Playlist.find_one(id=_id)
        if not playlist:
            return make_response((f"Playlist[{_id}] not found.", 404))

        if playlist.check_visibility(user.get_node()):
            response = jsonify(playlist.json())
            response.status_code = 200
            return response
        else:
            return make_response((f"User[{_user_id}] does not have access to the playlist[{_id}].", 401))


class ListPlaylists(Resource):
    @playlist_ns.doc("Lists the playlists of the user given an User ID")
    def get(self, _user_id):
        """Lists the playlists of the user given an User ID"""
        user = User.find_one(id=_user_id)
        if not user:
            return make_response((f"User[{_user_id}] not found.", 404))

        return {"playlists": user.get_playlists()}, 200


class EditPlaylist(Resource):
    @playlist_ns.doc("Adds/Removes tracks to a playlist or edits playlist details")
    def put(self, _id):
        """Adds/Removes tracks to a playlist or edits playlist details"""
        request_json = request.get_json()
        required_fields = ["operation", "tracks", "userId"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        playlist = Playlist.find_one(id=_id)
        if not playlist:
            return make_response((f"Playlist[{_id}] not found.", 404))

        user = User.find_one(id=request_json["userId"])
        if not user:
            return make_response((f"User[{request_json['userId']}] not found.", 404))

        if playlist.check_visibility(user.get_node()):
            for track_id in request_json["tracks"]:
                track = Track.find_one(id=track_id)
                if request_json["operation"] == "addTracks":
                    playlist.add_track(track.get_node())
                elif request_json["operation"] == "removeTracks":
                    playlist.remove_track(track.get_node())
                else:
                    return make_response((f"Invalid operation[{request_json['operation']}]", 400))
        else:
            return make_response((f"User[{request_json['userId']}] does not have access to the playlist[{_id}].", 401))


class DeletePlaylist(Resource):
    @playlist_ns.doc("Deletes a playlist")
    def delete(self, _id):
        """Deletes a playlist"""
        request_json = request.get_json()
        required_fields = ["userId"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        playlist = Playlist.find_one(id=_id)
        if not playlist:
            return make_response((f"Playlist[{_id}] not found.", 404))

        playlist.delete()
        return make_response(("Delete successful.", 200))


playlist_ns.add_resource(CreatePlaylist, '/playlist/create/')
playlist_ns.add_resource(GetPlaylist, '/user/<_user_id>/playlist/<_id>/')
playlist_ns.add_resource(ListPlaylists, '/user/<_user_id>/playlists/')
playlist_ns.add_resource(EditPlaylist, '/playlist/<_id>/edit/')
playlist_ns.add_resource(DeletePlaylist, '/playlist/<_id>/delete/')

