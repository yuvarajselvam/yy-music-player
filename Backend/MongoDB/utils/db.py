from mongoengine import connect, disconnect, PULL, CASCADE
import ssl
from pymongo import MongoClient
from utils.secrets import Secrets

from models.PlaylistModel import Playlist
from models.UserModel import User, PendingRequest

client = MongoClient()
Saavn = client.YYMPSaavn2
artists = Saavn.artists


class DbUtils:
    host = Secrets.DB_HOST_NAME
    db_alias = None

    def db_connect(self):
        self.db_alias = connect('YY-MP-DB', host=self.host, ssl_cert_reqs=ssl.CERT_NONE)
        print("Db connected")

    def db_disconnect(self):
        disconnect(self.db_alias)

    @staticmethod
    def setup_schema():
        User.register_delete_rule(Playlist, 'playlists', PULL)
        User.register_delete_rule(PendingRequest, 'pendingRequests', PULL)
        Playlist.register_delete_rule(User, 'owner', CASCADE)

    def get_pymongo_connection(self):
        return MongoClient(self.host)
