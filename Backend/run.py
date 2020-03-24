import os

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api

from api.auth.authenticate import Authenticate
from api.auth.change_password import ChangePassword
from api.auth.create_user import CreateUser
from api.auth.forgot_password import ForgotPassword, ValidatePasswordChangeToken
from api.auth.single_sign_on import SingleSignOn
from api.search.test import Track
from utils.db import DbUtils
from utils.secrets import Secrets

os.environ.__setitem__('verbose', 'abs')
if os.environ['verbose']:
    print("[INFO] Running in verbose mode. \n")

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = Secrets.JWT_SECRET_KEY
CORS(app)
api = Api(app)
jwt = JWTManager(app)


@app.route('/')
def StartupPage():
    return "<h1>YY-Music-Player</h1>"


api.add_resource(CreateUser, '/signup/')
api.add_resource(Authenticate, '/signin/')
api.add_resource(SingleSignOn, '/sso/')
api.add_resource(ForgotPassword, '/forgot_password/')
api.add_resource(ValidatePasswordChangeToken, '/forgot_password/validate/')
api.add_resource(ChangePassword, '/change_password/')
api.add_resource(Track, '/get_track_url/')

DbUtils().db_connect()

port = int(os.environ.get("PORT", 5000))
app.run(port=port)
# host="0.0.0.0"
