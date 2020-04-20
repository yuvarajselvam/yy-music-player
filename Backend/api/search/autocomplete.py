import re
import json
from os import environ as env
from time import time
from fuzzywuzzy import fuzz
from flask import request, jsonify
from flask_restful import Resource
from utils.db import Saavn


def get_score(search_term, lookup_term):
    total_score = []
    for sw in search_term.split():
        sw_score = []
        for lw in lookup_term.split():
            sw_score.append(fuzz.ratio(sw, lw))
        total_score.append(max(sw_score))
    return sum(total_score) + fuzz.ratio(search_term, lookup_term)


class Autocomplete(Resource):
    @staticmethod
    def get():
        if env["verbose"]:
            print(json.dumps(request.args, indent=2, sort_keys=True))

        search_key = request.args["searchKey"]
        start_time = time()
        trimmed_tracks = trimmed_albums = trimmed_artists = []
        for language in json.loads(request.args["languages"]):
            my_albums = Saavn["albums_" + language]
            my_tracks = Saavn["tracks_" + language]

            matching_albums = my_albums.find({"$text": {"$search": search_key}}, {"score": {"$meta": "textScore"}})
            matching_tracks = my_tracks.find({"$text": {"$search": search_key}}, {"score": {"$meta": "textScore"}})

            matching_albums = sorted(matching_albums, key=lambda t: t["score"], reverse=True)
            for alb in matching_albums:
                album_name = re.sub("[(\[].*[)\]]", "", alb["name"]).strip()
                alb["matchScore"] = get_score(search_key, album_name)

            matching_tracks = sorted(matching_tracks, key=lambda t: t["score"], reverse=True)
            for trk in matching_tracks:
                track_name = re.sub("[(\[].*[)\]]", "", trk["name"]).strip()
                trk["matchScore"] = get_score(search_key, track_name)

            # matching_artists = artists.find({"$text": {"$search": search_key}}) \
            #     .collection\
            #     .find({"name": re.compile(f".*{search_key}.*", re.IGNORECASE)})
            # matching_artists = sorted(matching_artists, key=lambda t: t["popularity"], reverse=True)

            if env["verbose"]:
                print("Time taken for searching: ", time() - start_time)

            if len(matching_albums):
                for album in matching_albums[: 10 if 10 <= len(matching_albums) else len(matching_albums)]:
                    # if env["verbose"]:
                    #     print("Album: ", album["name"], "MatchScore:", album["matchScore"])
                    trimmed_album = {
                        "name": album["name"],
                        "_id": album["_id"],
                        "imageUrl": album["imageUrl"] if "imageUrl" in album else None,
                        "type": album["type"],
                        "matchScore": album["matchScore"],
                        "language": language
                    }
                    if len(album["artists"]):
                        trimmed_album["artists"] = album["artists"][0]["name"]
                    trimmed_albums.append(trimmed_album)

            if len(matching_tracks):
                for track in matching_tracks[: 10 if 10 <= len(matching_tracks) else len(matching_tracks)]:
                    # if env["verbose"]:
                    #     print("Track: ", track["name"], "MatchScore:", track["matchScore"])
                    track_dict = {
                        "name": track["name"],
                        "_id": track["_id"],
                        "imageUrl": track["imageUrl"] if "imageUrl" in track else None,
                        "type": track["type"],
                        "matchScore": track["matchScore"],
                        "language": language
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
        response = jsonify(searchResults=sorted(trimmed_albums + trimmed_tracks,
                                                key=lambda t: t["matchScore"], reverse=True))
        response.status_code = 200
        return response
