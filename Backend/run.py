import os

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api

from User.Authenticate import Authenticate
from User.ChangePassword import ChangePassword
from User.CreateUser import CreateUser
from User.ForgotPassword import ForgotPassword, ValidatePasswordChangeToken
from User.SingleSignOn import SingleSignOn
from utils.DbUtils import DbUtils
from utils.SecretsUtils import Secrets


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

DbUtils().db_connect()


port = int(os.environ.get("PORT", 5000))
app.run(host="0.0.0.0", port=port)
