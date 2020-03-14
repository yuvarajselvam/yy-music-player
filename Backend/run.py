from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_jwt_extended import create_access_token, JWTManager

from User.Authenticate import Authenticate
from User.CreateUser import CreateUser
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

DbUtils().db_connect()

app.run(host="0.0.0.0")
