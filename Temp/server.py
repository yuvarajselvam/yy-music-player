from __future__ import unicode_literals

from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import youtube_dl



ydl_opts = {
    'nocheckcertificate': True,
    'format': 'bestaudio/best',
    'outtmpl': '~/Yadhu/personal/music-ytd/YTdownload/songs/%(title)s.%(ext)s',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '320',
    }],
}

application = Flask(__name__)
CORS(application)
api = Api(application)


class Song(Resource):
    def post(self):
        parser = reqparse.RequestParser()

        parser.add_argument('link', required=True)
        args = parser.parse_args()
        print(args['link'])
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([args['link']])
            print("Download successful.")
        return {'message': 'Download successful.'}, 201

api.add_resource(Song, '/download/')

if __name__ == "__main__":
    application.run()