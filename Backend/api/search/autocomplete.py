import re
import json
from os import environ as env
from time import time

from flask import request, jsonify
from flask_restful import Resource
from utils.db import albums, tracks, artists


class Autocomplete(Resource):
    @staticmethod
    def get():
        if env["verbose"]:
            print(json.dumps(request.args, indent=2, sort_keys=True))

        search_key = request.args["searchKey"]
        start_time = time()
        matching_albums = albums.find({"$text": {"$search": search_key}})\
            .collection\
            .find({"name": re.compile(f".*{search_key}.*", re.IGNORECASE)})
        matching_albums = sorted(matching_albums, key=lambda t: t["popularity"], reverse=True)
        matching_tracks = tracks.find({"$text": {"$search": search_key}}) \
            .collection\
            .find({"name": re.compile(f".*{search_key}.*", re.IGNORECASE)})
        matching_tracks = sorted(matching_tracks, key=lambda t: t["popularity"], reverse=True)
        matching_artists = artists.find({"$text": {"$search": search_key}}) \
            .collection\
            .find({"name": re.compile(f".*{search_key}.*", re.IGNORECASE)})
        matching_artists = sorted(matching_artists, key=lambda t: t["popularity"], reverse=True)
        if env["verbose"]:
            print("Time taken for searching: ", time() - start_time)
        trimmed_albums = []
        if len(matching_albums):
            for album in matching_albums[: 3 if 3 <= len(matching_albums) else len(matching_albums)]:
                if env["verbose"]:
                    print("Album: ", album["name"], "Popularity:", album["popularity"])
                trimmed_albums.append({
                    "name": album["name"],
                    "_id": album["_id"],
                    "imageUrl": album["imageUrl"] if "imageUrl" in album else None,
                    "artists": album["artists"][0]["name"],
                    "type": album["type"]
                })
        trimmed_tracks = []
        if len(matching_tracks):
            for track in matching_tracks[: 7 if 7 <= len(matching_tracks) else len(matching_tracks)]:
                if env["verbose"]:
                    print("Track: ", track["name"], "Popularity:", track["popularity"])
                trimmed_tracks.append({
                    "name": track["name"],
                    "_id": track["_id"],
                    "imageUrl": track["imageUrl"] if "imageUrl" in track else None,
                    "artists": track["artists"][0]["name"],
                    "type": track["type"]
                })

        trimmed_artists = []
        if len(matching_artists):
            for artist in matching_artists[: 2 if 2 <= len(matching_artists) else len(matching_artists)]:
                if env["verbose"]:
                    print("Artist: ", artist["name"], "Popularity:", artist["popularity"])
                trimmed_artists.append({
                    "name": artist["name"],
                    "_id": artist["_id"],
                    "imageUrl": artist["imageUrl"] if "imageUrl" in artist else None,
                    "type": artist["type"]
                })
        response = jsonify(searchResults=trimmed_albums + trimmed_tracks + trimmed_artists)
        response.status_code = 200
        return response
