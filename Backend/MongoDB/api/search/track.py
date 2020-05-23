import re
import json
from os import environ as env

from flask import jsonify
from flask_restful import Resource

from utils.db import Saavn
from utils.youtube import getVideoURL


class GetTrack(Resource):
    @staticmethod
    def get(_language, _id):
        if env["verbose"]:
            print(f"Getting track: {_id}")

        my_tracks = Saavn["tracks_" + _language.lower()]
        my_albums = Saavn["albums_" + _language.lower()]
        track = my_tracks.find_one({"_id": _id}, {"substrings": 0})
        album = my_albums.find_one({"_id": track["album"]["id"]})
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
            if album["albumType"] == "Standard":
                track_name = track["name"]
                track_album = re.sub("[(\[].*[)\]]", "", track["album"]["name"]).strip()
            else:
                track_album = re.compile('\(From "(.*)"\)').search(track["name"]).group(1)
                track_name = re.sub("[(\[].*[)\]]", "", track["name"]).strip()
            track_artist = track["artists"][0]["name"] if len(track["artists"]) else ""
            try:
                youtube_search_term = " ".join([track_name, track_album, track_artist])
                if env["verbose"]:
                    print("Searching youtube for: ", youtube_search_term)
                url, youtube_url = getVideoURL(youtube_search_term)
            except FileNotFoundError:
                response = jsonify(Error="Track not found!")
                response.status_code = 404
                if env['verbose']:
                    print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                return response

        my_tracks.update_one({"_id": _id}, {"$set": {"youtubeUrl": youtube_url,
                                                     "trackUrl": url}})
        track["trackUrl"] = url
        response = jsonify(track)
        response.status_code = 200
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response

