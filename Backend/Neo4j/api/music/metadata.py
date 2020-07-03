from flask import jsonify, request
from flask_restplus import Namespace, Resource

from models.AlbumModel import Album
from models.TrackModel import Track
from models.DeviceModel import Device
from utils.exceptions import AppLogicError

from utils.logging import Logger
from utils.response import make_response, check_required_fields


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


class DownloadTrack(Resource):
    @music_ns.doc("Downloads track into a device given a Device ID")
    def post(self, _language, _track_id):
        """Downloads track into a device given a Device ID"""
        track = Track.find_one(id=_track_id)
        if not track:
            return make_response((f"Track[{_track_id}] not found.", 404))

        request_json = request.get_json()
        required_fields = ["deviceId"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        device = Device.find_one(uniqueId=request_json["deviceId"])
        if not device:
            return make_response((f"Device[{request_json['deviceId']}] not found.", 404))

        try:
            device.download_track(track.get_node())
        except AppLogicError as e:
            return make_response((str(e), 400))

        response = jsonify(track.json())
        response.status_code = 200
        return response


class GetDownloadedTracks(Resource):
    @music_ns.doc("Returns all downloaded tracks for a device")
    def get(self, _device_id):
        """Returns all downloaded tracks for a device"""
        device = Device.find_one(uniqueId=_device_id)
        if not device:
            return make_response((f"Device[{_device_id}] not found.", 404))

        return {"downloadedTracks": device.get_downloaded_tracks()}, 200


music_ns.add_resource(GetAlbum, '/album/<_language>/<_album_id>/')
music_ns.add_resource(GetTrack, '/track/<_language>/<_track_id>/')
music_ns.add_resource(DownloadTrack, '/track/<_language>/<_track_id>/download/')
music_ns.add_resource(GetDownloadedTracks, '/device/<_device_id>/downloads/')
