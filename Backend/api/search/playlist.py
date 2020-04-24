import json
from flask import jsonify, request
from flask_restful import Resource
from os import environ as env
from mongoengine import ValidationError, NotUniqueError
from models.PlaylistModel import Playlist, PlaylistTrack
from models.UserModel import User
from utils.db import Saavn


def resource_not_found(resource):
    response = jsonify(Error=f"{resource} not found!")
    response.status_code = 404
    if env['verbose']:
        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
    return response


def error_response(message, status_code):
    response = jsonify(Error=message)
    response.status_code = status_code
    if env['verbose']:
        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
    return response


class CreatePlaylist(Resource):
    @staticmethod
    def post():
        playlist = request.get_json()
        if env['verbose']:
            print("\nCreate playlist:", json.dumps(playlist, indent=2, sort_keys=True))

        try:
            user = User.objects(pk=playlist["owner"]).first()
            if not user:
                return error_response("Invalid user id for owner field.", 400)
            if "tracks" in playlist:
                playlist["tracks"] = list(set(playlist["tracks"]))
                playlist["totalTracks"] = len(playlist["tracks"])
            else:
                playlist["totalTracks"] = "0"
            playlist_json = json.dumps(playlist)
            new_playlist = Playlist.from_json(json_data=playlist_json)
            new_playlist.validate(clean=True)
            if "playlists" in user:
                user["playlists"].append(new_playlist)
            new_playlist.save(validate=False)
            _id = str(new_playlist.pk)
            new_playlist = json.loads(new_playlist.to_json())
            user.save()
            new_playlist["_id"] = _id
            response = new_playlist
            if env['verbose']:
                print("Response:", json.dumps(response, indent=2, sort_keys=True))
            return response, 201
        except ValidationError as e:
            return error_response(str(e), 400)
        except NotUniqueError as e:
            return error_response(str(e), 409)
        except KeyError as e:
            return error_response(str(e) + " field is mandatory!", 400)


class GetPlaylist(Resource):
    @staticmethod
    def get(_user_id, _id):
        if env["verbose"]:
            print(f"Getting playlist: {_id} from user: {_user_id}")
        try:
            playlist = Playlist.objects(pk=_id).first()
            user = User.objects(pk=_user_id).first()
        except:
            return error_response("Invalid ID", 400)

        if not user:
            return resource_not_found("User")

        if not playlist:
            return resource_not_found("Playlist")

        if "playlists" in user and playlist in user["playlists"]:
            playlist = json.loads(playlist.to_json())
            playlist["_id"] = _id
            response = jsonify(playlist)
            response.status_code = 200
            if env['verbose']:
                print(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response

        else:
            return error_response("User does not have access to the playlist.", 401)


class ListPlaylist(Resource):
    @staticmethod
    def get(_user_id):
        if env["verbose"]:
            print(f"Listing playlists of user: {_user_id}")

        try:
            user = User.objects(pk=_user_id).first()
        except:
            return error_response("Invalid ID", 400)

        if not user:
            return resource_not_found("User")

        if "playlists" in user and len(user["playlists"]):
            playlists = []
            for playlist in user["playlists"]:
                _id = str(playlist.pk)
                try:
                    playlist = json.loads(Playlist.objects(pk=str(playlist.pk)).first().to_json())
                    playlist["_id"] = _id
                    playlists.append(playlist)
                except:
                    return error_response(f"Playlist not found: {_id}", 404)
            response = jsonify(playlists)
            response.status_code = 200
            if env['verbose']:
                print(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
        else:
            response = jsonify([])
            response.status_code = 204
            return response


class EditPlaylist(Resource):
    @staticmethod
    def put(_id):
        req_playlist = request.get_json()
        if env['verbose']:
            print("\nEdit playlist:", json.dumps(req_playlist, indent=2, sort_keys=True))

        playlist = Playlist.objects(pk=req_playlist["_id"]).first()

        if not playlist:
            return resource_not_found("Playlist")
        elif playlist["owner"] != req_playlist["owner"]:
            return error_response("User does not have access to edit the playlist.", 401)
        elif "operation" in req_playlist:
            op = req_playlist["operation"]
            if op == "addTracks":
                for track in req_playlist["tracks"]:
                    playlist_track = PlaylistTrack.from_json(json.dumps(track))
                    playlist.update(add_to_set__tracks=playlist_track)
            elif op == "removeTracks":
                for track in req_playlist["tracks"]:
                    playlist_track = PlaylistTrack.from_json(json.dumps(track))
                    playlist.update(pull__tracks=playlist_track)
            else:
                return error_response("Invalid operation.", 400)
            try:
                playlist.reload()
                playlist["totalTracks"] = str(len(playlist["tracks"]))
                edited_playlist = playlist.save()
                edited_playlist = json.loads(edited_playlist.to_json())
                edited_playlist["_id"] = str(playlist.pk)
                response = edited_playlist
                if env['verbose']:
                    print("Response:", json.dumps(response, indent=2, sort_keys=True))
                return response, 200
            except ValidationError as e:
                return error_response(str(e), 400)
            except NotUniqueError as e:
                return error_response(str(e), 409)
        else:
            try:
                del req_playlist["_id"]
                playlist.update(**req_playlist)
                edited_playlist = playlist.save()
                edited_playlist = json.loads(edited_playlist.to_json())
                edited_playlist["_id"] = str(playlist.pk)
                response = edited_playlist
                if env['verbose']:
                    print("Response:", json.dumps(response, indent=2, sort_keys=True))
                return response, 200
            except ValidationError as e:
                return error_response(str(e), 400)
            except NotUniqueError as e:
                return error_response(str(e), 409)


class DeletePlaylist(Resource):
    @staticmethod
    def delete(_id):
        req_playlist = request.get_json()
        if env['verbose']:
            print("\nDelete playlist:", json.dumps(req_playlist, indent=2, sort_keys=True))

        playlist = Playlist.objects(pk=req_playlist["_id"]).first()
        if playlist["owner"] == req_playlist["owner"]:
            playlist.delete()
            response = jsonify(Message="Delete successful.")
            response.status_code = 200
        else:
            return error_response("User does not have access to delete the playlist.", 401)
        if env['verbose']:
            print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response
