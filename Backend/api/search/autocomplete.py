import re
import json
from os import environ as env
from pymongo import MongoClient

from flask import request, jsonify
from flask_restful import Resource

client = MongoClient()
db = client.YYMP

albums = db.albums_original
tracks = db.tracks
artists = db.artists


class Autocomplete(Resource):
    @staticmethod
    def post():
        req = request.get_json()
        if env["verbose"]:
            print(json.dumps(req, indent=2, sort_keys=True))

        search_key = req["searchKey"]

        matching_albums = albums.find({'name': re.compile(f".*{search_key}.*", re.IGNORECASE)})
        matching_tracks = tracks.find({'name': re.compile(f".*{search_key}.*", re.IGNORECASE)})
        matching_tracks = sorted(matching_tracks, key=lambda t: t["popularity"], reverse=True)
        matching_artists = artists.find({'name': re.compile(f".*{search_key}.*", re.IGNORECASE)})
        matching_artists = sorted(matching_artists, key=lambda t: t["popularity"], reverse=True)

        trimmed_albums = []
        if matching_albums.count():
            for album in matching_albums[: 3 if 3 <= matching_albums.count() else matching_albums.count()]:
                trimmed_albums.append({
                    "name": album["name"],
                    "_id": album["_id"],
                    "imageUrl": album["imageUrl"] if "imageUrl" in album else None,
                    "artists": album["artists"][0]["name"],
                    "type": album["type"]
                })

        trimmed_tracks = []
        if len(matching_tracks):
            for track in matching_tracks[: 3 if 3 <= len(matching_tracks) else len(matching_tracks)]:
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
                trimmed_artists.append({
                    "name": artist["name"],
                    "_id": artist["_id"],
                    "imageUrl": artist["imageUrl"] if "imageUrl" in artist else None,
                    "type": artist["type"]
                })
        response = jsonify(searchResults=trimmed_tracks + trimmed_albums + trimmed_artists)
        response.status_code = 200
        print(trimmed_tracks + trimmed_albums + trimmed_artists)
        return response


