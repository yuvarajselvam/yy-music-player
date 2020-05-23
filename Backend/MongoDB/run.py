import os
import re
import time

from api.search.album import GetAlbum
from api.search.artist import GetArtist
from api.search.autocomplete import Autocomplete
from api.search.saavn_track import GetTrack
from api.auth.auth import Authenticate
from api.auth.auth import ChangePassword
from api.auth.auth import CreateUser
from api.auth.auth import ForgotPassword, ValidatePasswordChangeToken
from api.auth.auth import SingleSignOn
from api.auth.auth import RegisterDevice
from api.playlist.playlist import GetPlaylist, CreatePlaylist, DeletePlaylist, EditPlaylist, ListPlaylist
from api.social.follow import ListFollowers, ListFollowing, FollowUser, RespondToFollowRequest, ListPendingRequests
from api.social.user_search import UserSearch, GetUser, GetUserByEmail

from utils.notifications import NotificationUtil
from utils.secrets import Secrets
from utils.db import DbUtils
from utils.logging import Logger

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, decode_token
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


@app.before_request
def before_request():
    request_path = request.path.split("/")
    if request_path and request_path[1] not in ['signup', 'signin', 'sso', 'forgot-password', 'change-password']:
        header_name = "Authorization"
        header_type = "Bearer"
        header_pattern = re.compile(f"{header_type} (.*)")
        auth_header = request.headers.get(header_name, None)
        if not auth_header:
            response = jsonify(Error=f"Missing {header_name} Header.")
            logger.debug(f"Missing {header_name} Header.")
            response.status_code = 400
            return response
        auth_token = header_pattern.search(auth_header)
        if auth_token:
            try:
                jwt_data = decode_token(auth_token.group(1))
            except Exception as e:
                jwt_data = decode_token(auth_token.group(1), allow_expired=True)
                response = jsonify(Error=f"Token expired for user: {jwt_data['identity']}")
                response.status_code = 400
                logger.debug(f"Token expired for user: {jwt_data['identity']}")
                return response
        else:
            response = jsonify(Error=f"Bad header format.")
            logger.debug("Bad header format")
            response.status_code = 400
            return response


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
api.add_resource(ListPendingRequests, '/user/<_user_id>/pending-requests/')
api.add_resource(RegisterDevice, '/register-device/')

DbUtils().setup_schema()
DbUtils().db_connect()

port = int(os.environ.get("PORT", 5000))
app.run(host='0.0.0.0', port=port)

DbUtils().db_disconnect()
