from flask import request, jsonify
from flask_restplus import Resource

from utils.logging import Logger
from utils.response import make_response
from utils.querying import music_search
from api.music.metadata import music_ns

logger = Logger("music_search").logger


class MusicSearch(Resource):
    @music_ns.doc("Returns matching albums/tracks given a search term")
    def get(self):
        """Returns matching albums/tracks given a search term"""
        search_key = request.args["searchKey"]
        response = jsonify(searchResults=music_search(search_key), searchKey=search_key)
        response.status_code = 200
        return response


music_ns.add_resource(MusicSearch, '/autocomplete/')

