import json
from os import environ as env

from flask import jsonify
from flask_restful import Resource
from utils.db import albums


class Album(Resource):
    @staticmethod
    def get(_id):
        if env["verbose"]:
            print(f"Getting album: {_id}")

        album = albums.find_one({"_id": _id})

        if not album:
            response = jsonify(Error="Track not found!")
            response.status_code = 404
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response

        # TODO: Add a logic here to trigger fetching videoUrl for all the album's tracks

        response = jsonify(album)
        response.status_code = 200
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response
