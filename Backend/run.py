import os
import time

from api.search.album import GetAlbum
from api.search.artist import GetArtist
from api.search.autocomplete import Autocomplete
from api.search.saavn_track import GetTrack
from api.auth.authenticate import Authenticate
from api.auth.change_password import ChangePassword
from api.auth.create_user import CreateUser
from api.auth.forgot_password import ForgotPassword, ValidatePasswordChangeToken
from api.auth.single_sign_on import SingleSignOn
from api.auth.register_device import RegisterDevice
from api.playlist.playlist import GetPlaylist, CreatePlaylist, DeletePlaylist, EditPlaylist, ListPlaylist
from api.social.follow import ListFollowers, ListFollowing, FollowUser, RespondToFollowRequest
from api.social.user_search import UserSearch, GetUser, GetUserByEmail

from utils.notifications import NotificationUtil
from utils.secrets import Secrets
from utils.db import DbUtils
from utils.logging import Logger

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api

os.environ.__setitem__('verbose', 'abs')

logger = Logger("run").logger
start_time = time.time()
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = Secrets.JWT_SECRET_KEY
CORS(app)
api = Api(app)
jwt = JWTManager(app)
NotificationUtil().init_firebase()


@app.route('/')
def StartupPage():
    return "<h1>YY-Music-Player</h1>"


api.add_resource(CreateUser, '/signup/')
api.add_resource(Authenticate, '/signin/')
api.add_resource(SingleSignOn, '/sso/')
api.add_resource(ForgotPassword, '/forgot-password/')
api.add_resource(ValidatePasswordChangeToken, '/forgot-password/validate/')
api.add_resource(ChangePassword, '/change-password/')
api.add_resource(GetTrack, '/track/<_language>/<_id>/')
api.add_resource(GetAlbum, '/album/<_language>/<_id>/')
api.add_resource(GetArtist, '/artist/<_id>/')
api.add_resource(Autocomplete, '/autocomplete/')
api.add_resource(GetPlaylist, '/user/<_user_id>/playlist/<_id>/')
api.add_resource(ListPlaylist, '/user/<_user_id>/playlists/')
api.add_resource(CreatePlaylist, '/playlist/create/')
api.add_resource(EditPlaylist, '/playlist/<_id>/edit/')
api.add_resource(DeletePlaylist, '/playlist/<_id>/delete/')
api.add_resource(ListFollowers, '/user/<_user_id>/followers/')
api.add_resource(ListFollowing, '/user/<_user_id>/following/')
api.add_resource(UserSearch, '/users/')
api.add_resource(GetUser, '/user/<_user_id>/')
api.add_resource(GetUserByEmail, '/user/email/<_user_email>/')
api.add_resource(FollowUser, '/follow-request/')
api.add_resource(RespondToFollowRequest, '/follow-request/<_op>/')
api.add_resource(RegisterDevice, '/register-device/')

DbUtils().setup_schema()
DbUtils().db_connect()

port = int(os.environ.get("PORT", 5000))
app.run(host='0.0.0.0', port=port)

DbUtils().db_disconnect()
