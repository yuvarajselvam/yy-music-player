import json
from os import environ as env

import requests
import spotipy
from youtube_dl import YoutubeDL

from flask import request, jsonify
from flask_restful import Resource
from spotipy.oauth2 import SpotifyClientCredentials

spotify = spotipy.Spotify(client_credentials_manager=
                          SpotifyClientCredentials(client_id="8dcb999ad6b44ab6836cca85866d97ac",
                                                   client_secret="f16d77ead260492ea9ee0cb9df147705"))

ydl_opts = {
    'nocheckcertificate': True,
    'format': 'bestaudio/best',
    'quiet': True,
    'skip_download': True,
}


def getVideoURL(keyword):
    youtube_url = "https://www.googleapis.com/youtube/v3/search?" \
                  f"part=snippet&maxResults=5&q={keyword}&key=AIzaSyBo_rii4kR_Px3OPadnqf9RRfaBCw_v1wg" \
                  f"&order=viewCount&type=video&videoCategoryId=10"
    response = requests.get(youtube_url)
    print(response.text)
    for item in json.loads(response.text)["items"]:
        video_id = item["id"]["videoId"]
        print(video_id)
        with YoutubeDL(ydl_opts) as ydl:
            url = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)['url']
        if "manifest" not in url:
            return url
    return url


class Track(Resource):
    @staticmethod
    def post():
        req = request.get_json()
        if env["verbose"]:
            print(json.dumps(req, indent=2, sort_keys=True))
        try:
            track_list = spotify.search(q='track:' + req["searchKey"], type='track')["tracks"]["items"]
            track_list = sorted(track_list, key=lambda t: t["popularity"], reverse=True)
            if env['verbose']:
                for track in track_list:
                    print(track["name"], track["album"]["name"], track["album"]["artists"][0]["name"])

            track = track_list[0]
            url = getVideoURL(track["name"] + " "
                              + track["album"]["name"] + " "
                              + track["album"]["artists"][0]["name"])

            response = jsonify(url=url, trackName=track["name"], albumName=track["album"]["name"],
                               albumArtist=track["album"]["artists"][0]["name"])
            response.status_code = 200
            if env['verbose']:
                print(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response

        except KeyError as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            if env['verbose']:
                print(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
