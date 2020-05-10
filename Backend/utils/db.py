from mongoengine import connect, disconnect
import ssl
from pymongo import MongoClient
from utils.secrets import Secrets


client = MongoClient()
Saavn = client.YYMPSaavn2
tracks = Saavn.tracks_tamil
albums = Saavn.albums_tamil
artists = Saavn.artists
albums_telugu = Saavn.albums_telugu
tracks_telugu = Saavn.tracks_telugu


class DbUtils:
    host = Secrets.DB_HOST_NAME
    db_alias = None

    def db_connect(self):
        self.db_alias = connect('YY-MP-DB', host=self.host, ssl_cert_reqs=ssl.CERT_NONE)

    def db_disconnect(self):
        disconnect(self.db_alias)

