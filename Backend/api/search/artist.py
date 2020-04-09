import json
from os import environ as env

from flask import jsonify
from flask_restful import Resource
from utils.db import artists


class Artist(Resource):
    @staticmethod
    def get(_id):
        if env["verbose"]:
            print(f"Getting artist: {_id}")

        artist = artists.find_one({"_id": _id})

        if not artist:
            response = jsonify(Error="Track not found!")
            response.status_code = 404
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response

        response = jsonify(artist)
        response.status_code = 200
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response
