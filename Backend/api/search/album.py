import re
import json
from utils import youtube
import threading
from os import environ as env

from flask import jsonify
from flask_restful import Resource
from utils.db import Saavn


class GetTracksUrlJob(object):
    def __init__(self, album_id, language):
        self.album_id = album_id
        self.language = language
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True
        thread.start()

    def run(self):
        my_tracks = Saavn["tracks_" + self.language]
        tracks_list = my_tracks.find({"album.id": self.album_id})
        for track in tracks_list:
            if "youtubeUrl" not in track:
                track_name = track["name"]
                track_album = re.sub("[(\[].*[)\]]", "", track["album"]["name"]).strip()
                track_artist = track["artists"][0]["name"]
                youtube_search_term = " ".join([track_name, track_album, track_artist])
                url, youtube_url = youtube.getVideoURL(youtube_search_term)
                my_tracks.update_one({"_id": track["_id"]}, {"$set": {"youtubeUrl": youtube_url,
                                                                      "videoUrl": url}})
            else:
                url, youtube_url = youtube.getVideoURL(track["youtubeUrl"])
                my_tracks.update_one({"_id": track["_id"]}, {"$set": {"videoUrl": url}})


class Album(Resource):
    @staticmethod
    def get(_language, _id):
        if env["verbose"]:
            print(f"Getting album: {_id}")

        my_albums = Saavn["albums_" + _language]
        my_tracks = Saavn["tracks_" + _language]

        album = my_albums.find_one({"_id": _id})

        if not album:
            response = jsonify(Error="Track not found!")
            response.status_code = 404
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response

        # TODO: Add a logic here to trigger fetching videoUrl for all the album's tracks

        album_tracks = my_tracks.find({"album.id": _id})
        GetTracksUrlJob(_id, _language)
        album["tracks"] = sorted(album_tracks, key=lambda t: t["_id"], reverse=True)
        del album["substrings"]
        response = jsonify(album)
        response.status_code = 200
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response
