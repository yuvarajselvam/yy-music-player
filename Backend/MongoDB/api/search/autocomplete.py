import re
import json
import time
from fuzzywuzzy import fuzz
from flask import request, jsonify
from flask_restful import Resource
from utils.db import Saavn
from utils.logging import Logger


logger = Logger("autocomplete").logger


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
        logger.debug(json.dumps(request.args, indent=2, sort_keys=True))
        search_key = request.args["searchKey"]
        start_time = time.time()
        trimmed_tracks = []
        trimmed_albums = trimmed_artists = []
        for language in request.args["languages"].split(','):
            my_albums = Saavn["albums_" + language.lower()]
            my_tracks = Saavn["tracks_" + language.lower()]

            no_custom_filter = {"$not": {"$eq": "Custom"}}
            project_fields = {"name": 1, "_id": 1, "type": 1, "imageUrl": 1, "artists": 1}
            if len(search_key) < 3:
                matching_albums = list(my_albums.find({"name": re.compile(f"^{search_key}.*", re.IGNORECASE), "albumType": no_custom_filter},
                                                      project_fields).sort("name").limit(50))
                matching_tracks = list(my_tracks.find({"name": re.compile(f"^{search_key}.*", re.IGNORECASE), "trackType": no_custom_filter},
                                                      project_fields).sort("name").limit(50))
            else:
                matching_albums = list(my_albums.find({"$text": {"$search": search_key}, "albumType": no_custom_filter}, project_fields))
                matching_tracks = list(my_tracks.find({"$text": {"$search": search_key}, "trackType": no_custom_filter}, project_fields))

            for alb in matching_albums:
                album_name = re.sub("[(\[].*[)\]]", "", alb["name"]).strip()
                alb["matchScore"] = get_score(search_key, album_name)
            matching_albums = sorted(matching_albums, key=lambda t: t["matchScore"], reverse=True)

            for trk in matching_tracks:
                track_name = re.sub("[(\[].*[)\]]", "", trk["name"]).strip()
                trk["matchScore"] = get_score(search_key, track_name)
            matching_tracks = sorted(matching_tracks, key=lambda t: t["matchScore"], reverse=True)

            # matching_artists = artists.find({"$text": {"$search": search_key}}) \
            #     .collection\
            #     .find({"name": re.compile(f".*{search_key}.*", re.IGNORECASE)})
            # matching_artists = sorted(matching_artists, key=lambda t: t["popularity"], reverse=True)

            if len(matching_albums):
                for album in matching_albums:
                    # logger.debug(f'Album: {album["name"]}, MatchScore: {album["matchScore"]}')
                    if len(album["artists"]):
                        album["artists"] = album["artists"][0]["name"]
                    album["language"] = language
                    trimmed_albums.append(album)

            if len(matching_tracks):
                for track in matching_tracks:
                    # logger.debug(f'Track: {track["name"]}, MatchScore: {track["matchScore"]}')
                    track_artists = [artist["name"] for artist in track["artists"]]
                    if len(track["artists"]):
                        track["artists"] = ', '.join(track_artists)
                    track["language"] = language
                    trimmed_tracks.append(track)

            # if len(matching_artists):
            #     for artist in matching_artists[: 2 if 2 <= len(matching_artists) else len(matching_artists)]:
            #         logger.debug(f'Artist: {artist["name"]}, MatchScore: {artist["matchScore"]}')
            #         trimmed_artists.append({
            #             "name": artist["name"],
            #             "_id": artist["_id"],
            #             "imageUrl": artist["imageUrl"] if "imageUrl" in artist else None,
            #             "type": artist["type"]
            #         })

        if not len(trimmed_albums + trimmed_tracks):
            response = jsonify([])
            response.status_code = 204
            return response

        search_results = sorted(trimmed_albums + trimmed_tracks, key=lambda t: t["matchScore"], reverse=True)
        search_results = search_results[:20]
        logger.info(f"Found {len(trimmed_albums)} albums & {len(trimmed_tracks)} tracks in {round(time.time()-start_time, 3)}s")
        response = jsonify(searchResults=search_results, searchKey=search_key)
        response.status_code = 200
        return response
