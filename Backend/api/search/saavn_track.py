import re
import json
from os import environ as env
import time
from flask import jsonify
from flask_restful import Resource

from utils.db import Saavn
from utils.saavn_url import get_track_url


def resource_not_found(resource):
    response = jsonify(Error=f"{resource} not found!")
    response.status_code = 404
    if env['verbose']:
        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
    return response


class GetTrack(Resource):
    @staticmethod
    def get(_language, _id):
        if env["verbose"]:
            print(f"Getting track: {_id}")
        st = time.time()
        my_tracks = Saavn["tracks_" + _language.lower()]
        track = my_tracks.find_one({"_id": _id}, {"substrings": 0})
        print(time.time() - st)
        if not track:
            return resource_not_found("Track")
        try:
            track["trackUrl"] = get_track_url(track["saavnUrl"])
            print(time.time() - st)
        except FileNotFoundError:
            return resource_not_found("Track")

        response = jsonify(track)
        response.status_code = 200
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response
