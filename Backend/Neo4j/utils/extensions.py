from utils.db import Neo4j
from utils.notifications import NotificationUtil

neo4j = Neo4j()
NotificationUtil.init_firebase()

from flask_restplus import Api

from api.auth.auth import auth_ns
from api.auth.register_device import device_ns
from api.social.follow import social_ns
from api.playlist.playlist import playlist_ns
from api.music.search import music_ns

api = Api(tile='YY Music Player', version='1.0', doc='/docs/')
api.add_namespace(auth_ns)
api.add_namespace(device_ns)
api.add_namespace(social_ns)
api.add_namespace(playlist_ns)
api.add_namespace(music_ns)



