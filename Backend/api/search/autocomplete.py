import re
import json
from os import environ as env
from time import time
from fuzzywuzzy import fuzz
from flask import request, jsonify
from flask_restful import Resource
from utils.db import albums, tracks, artists, albums_telugu, tracks_telugu


class Autocomplete(Resource):
    @staticmethod
    def get():
        if env["verbose"]:
            print(json.dumps(request.args, indent=2, sort_keys=True))

        search_key = request.args["searchKey"]
        start_time = time()

        if request.args["language"].lower() == 'tamil':
            my_albums = albums
            my_tracks = tracks
        else:
            my_albums = albums_telugu
            my_tracks = tracks_telugu

        matching_albums = my_albums.find({"$text": {"$search": search_key}}, {"score": {"$meta": "textScore"}})
        matching_tracks = my_tracks.find({"$text": {"$search": search_key}}, {"score": {"$meta": "textScore"}})

        matching_albums = sorted(matching_albums, key=lambda t: t["score"], reverse=True)
        matching_albums = matching_albums[:min(200, len(matching_albums))]
        for alb in matching_albums:
            album_name = re.sub("[(\[].*[)\]]", "", alb["name"]).strip()
            alb["matchScore"] = fuzz.ratio(album_name, search_key)
        matching_albums = sorted(matching_albums, key=lambda t: t["matchScore"], reverse=True)

        matching_tracks = sorted(matching_tracks, key=lambda t: t["score"], reverse=True)
        matching_tracks = matching_tracks[:min(200, len(matching_albums))]
        for trk in matching_tracks:
            trk["matchScore"] = fuzz.ratio(trk["name"], search_key)
        matching_tracks = sorted(matching_tracks, key=lambda t: t["matchScore"], reverse=True)

        # matching_artists = artists.find({"$text": {"$search": search_key}}) \
        #     .collection\
        #     .find({"name": re.compile(f".*{search_key}.*", re.IGNORECASE)})
        # matching_artists = sorted(matching_artists, key=lambda t: t["popularity"], reverse=True)

        if env["verbose"]:
            print("Time taken for searching: ", time() - start_time)
        trimmed_albums = []
        if len(matching_albums):
            for album in matching_albums[: 10 if 10 <= len(matching_albums) else len(matching_albums)]:
                # if env["verbose"]:
                #     print("Album: ", album["name"], "MatchScore:", album["matchScore"])
                trimmed_album = {
                    "name": album["name"],
                    "_id": album["_id"],
                    "imageUrl": album["imageUrl"] if "imageUrl" in album else None,
                    "type": album["type"]
                }
                if len(album["artists"]):
                    trimmed_album["artists"] = album["artists"][0]["name"]
                trimmed_albums.append(trimmed_album)
        trimmed_tracks = []
        if len(matching_tracks):
            for track in matching_tracks[: 10 if 10 <= len(matching_tracks) else len(matching_tracks)]:
                # if env["verbose"]:
                #     print("Track: ", track["name"], "MatchScore:", track["matchScore"])
                track_dict = {
                    "name": track["name"],
                    "_id": track["_id"],
                    "imageUrl": track["imageUrl"] if "imageUrl" in track else None,
                    "type": track["type"]
                }
                if len(track["artists"]):
                    track_dict["artists"] = track["artists"][0]["name"]
                trimmed_tracks.append(track_dict)

        trimmed_artists = []
        # if len(matching_artists):
        #     for artist in matching_artists[: 2 if 2 <= len(matching_artists) else len(matching_artists)]:
        #         if env["verbose"]:
        #             print("Artist: ", artist["name"], "Popularity:", artist["popularity"])
        #         trimmed_artists.append({
        #             "name": artist["name"],
        #             "_id": artist["_id"],
        #             "imageUrl": artist["imageUrl"] if "imageUrl" in artist else None,
        #             "type": artist["type"]
        #         })
        response = jsonify(searchResults=trimmed_albums + trimmed_tracks)
        response.status_code = 200
        return response
