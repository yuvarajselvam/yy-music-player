from flask import jsonify
from flask_restplus import Namespace, Resource

from models.AlbumModel import Album
from models.TrackModel import Track

from utils.logging import Logger
from utils.response import make_response


logger = Logger("metadata").logger
music_ns = Namespace('Music', description='Endpoints that retrieves music metadata')


class GetAlbum(Resource):
    @music_ns.doc("Returns the album object given an Album ID")
    def get(self, _language, _album_id):
        """Returns the album object given an Album ID"""
        album = Album.find_one(id=_album_id)
        if not album:
            return make_response((f"Album[{_album_id}] not found.", 404))

        response = jsonify(album.json())
        response.status_code = 200
        return response


class GetTrack(Resource):
    @music_ns.doc("Returns the track object given a Track ID")
    def get(self, _language, _track_id):
        """Returns the track object given a Track ID"""
        track = Track.find_one(id=_track_id)
        if not track:
            return make_response((f"Track[{_track_id}] not found.", 404))

        response = jsonify(track.json())
        response.status_code = 200
        return response


music_ns.add_resource(GetAlbum, '/album/<_language>/<_album_id>/')
music_ns.add_resource(GetTrack, '/track/<_language>/<_track_id>/')
