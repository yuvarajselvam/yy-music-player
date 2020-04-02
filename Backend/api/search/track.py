import json
from os import environ as env

from flask import jsonify
from flask_restful import Resource

from run import tracks
from utils.youtube import getVideoURL


class Track(Resource):
    @staticmethod
    def get(_id):
        if env["verbose"]:
            print(f"Getting track: {_id}")

        track = tracks.find_one({"_id": _id})

        if not track:
            response = jsonify(Error="Track not found!")
            response.status_code = 404
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response

        if "youtubeUrl" in track:
            url = getVideoURL(track["youtubeUrl"])
        else:
            track_name = track["name"]
            track_album = track["album"]["name"]
            track_album_artist = track["album"]["artists"][0]["name"]
            url = getVideoURL(" ".join([track_name, track_album, track_album_artist]))

        track["url"] = url
        response = jsonify(track)
        response.status_code = 200
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response

