import json
from os import environ as env

from flask import jsonify
from flask_restful import Resource

from utils.db import tracks
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
            try:
                url, youtube_url = getVideoURL(track["youtubeUrl"])
            except FileNotFoundError:
                response = jsonify(Error="Track not found!")
                response.status_code = 404
                if env['verbose']:
                    print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                return response
        else:
            track_name = track["name"]
            track_album = track["album"]["name"].replace('(Original Motion Picture Soundtrack)', '')
            track_artist = track["artists"][0]["name"]
            try:
                youtube_search_term = " ".join([track_name, track_album, track_artist])
                if env["verbose"]:
                    print("Searching youtube for: ", youtube_search_term)
                url, youtube_url = getVideoURL(youtube_search_term)
                tracks.update_one({"_id": _id}, {"$set": {"youtubeUrl": youtube_url}})
            except FileNotFoundError:
                response = jsonify(Error="Track not found!")
                response.status_code = 404
                if env['verbose']:
                    print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                return response

        track["url"] = url
        response = jsonify(track)
        response.status_code = 200
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response

