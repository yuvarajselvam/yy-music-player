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

JWT_SECRET_KEY = "Musiqplayer@123"

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
CORS(app)
api = Api(app)
jwt = JWTManager(app)

api.add_resource(CreateUser, '/signup/')
api.add_resource(Authenticate, '/signin/')
api.add_resource(SingleSignOn, '/sso/')
api.add_resource(ForgotPassword, '/forgot_password/')
api.add_resource(ValidatePasswordChangeToken, '/forgot_password/validate/')
api.add_resource(ChangePassword, '/change_password/')

DbUtils().db_connect()

app.run(host="0.0.0.0")
