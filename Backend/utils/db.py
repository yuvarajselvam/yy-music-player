from mongoengine import connect, disconnect
import ssl
from pymongo import MongoClient
from utils.secrets import Secrets


client = MongoClient()
db = client.YYMP_Saavn
tracks = db.tracks
albums = db.albums
artists = db.artists
names = db.names

albums_telugu = db.albums_telugu
tracks_telugu = db.tracks_telugu


class DbUtils:
    host = Secrets.DB_HOST_NAME
    db_alias = None

    def db_connect(self):
        self.db_alias = connect('YY-MP-DB', host=self.host, ssl_cert_reqs=ssl.CERT_NONE)

    def db_disconnect(self):
        disconnect(self.db_alias)

