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
        print(f"Fetching {tracks_list[0]['album']['name']} songs...")
        for track in tracks_list:
            if "youtubeUrl" not in track:
                track_name = re.sub("[\(,\)]", "", track["name"])
                track_album = re.sub("[(\[].*[)\]]", "", track["album"]["name"]).strip()
                track_artist = track["artists"][0]["name"] if len(track["artists"]) else ""
                youtube_search_term = " ".join([track_name, track_album, track_artist])
                print("Searching YouTube for", youtube_search_term)
                try:
                    url, youtube_url = youtube.getVideoURL(youtube_search_term)
                    my_tracks.update_one({"_id": track["_id"]}, {"$set": {"youtubeUrl": youtube_url,
                                                                          "trackUrl": url}})
                except FileNotFoundError:
                    print("Song not found")
                    pass
            else:
                try:
                    url, youtube_url = youtube.getVideoURL(track["youtubeUrl"])
                    my_tracks.update_one({"_id": track["_id"]}, {"$set": {"trackUrl": url}})
                except FileNotFoundError:
                    print("Song not found")


class GetAlbum(Resource):
    @staticmethod
    def get(_language, _id):
        if env["verbose"]:
            print(f"Getting album: {_id}")

        my_albums = Saavn["albums_" + _language.lower()]
        my_tracks = Saavn["tracks_" + _language.lower()]

        album = my_albums.find_one({"_id": _id}, {"substrings": 0})

        if not album:
            response = jsonify(Error="Album not found!")
            response.status_code = 404
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response

        album_tracks = my_tracks.find({"album.id": _id}, {"substrings": 0, "album": 0})
        # GetTracksUrlJob(_id, _language.lower())
        album["tracks"] = sorted(album_tracks, key=lambda t: t["name"], reverse=True)

        response = jsonify(album)
        response.status_code = 200
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response
