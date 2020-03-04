import datetime
import sys

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_jwt_extended import create_access_token, JWTManager

from passlib.hash import sha256_crypt
from mongoengine import connect, DoesNotExist
from models import User
import urllib
import json
import ssl

PASSWORD = "Musiqplayer@123"
HOST_NAME = "mongodb+srv://yympserver:" + urllib.parse.quote_plus(
    PASSWORD) + "@yy-music-player-dev-fygew.mongodb.net/YY-MP-DB?retryWrites=true&w=majority"

connect('YY-MP-DB', host=HOST_NAME, ssl_cert_reqs=ssl.CERT_NONE)

JWT_SECRET_KEY = "Musiqplayer@123"

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
CORS(app)
api = Api(app)
jwt = JWTManager(app)



class CreateUser(Resource):
    def post(self):
        user = request.get_json()
        user["password"] = sha256_crypt.encrypt(user["password"])
        userJson = json.dumps(user)
        try:
            newUser = User.from_json(json_data=userJson)
            newUser.save()
        except:
            return jsonify(Error=str(sys.exc_info()[1]))
        return newUser.to_json(), 201


class Authenticate(Resource):
    def post(self):
        credentials = request.get_json()
        try:
            user = User.objects.get(email=credentials["email"])
        except DoesNotExist:
            response = jsonify(message="Bad Email!")
            response.status_code = 401
            return response
        if user and sha256_crypt.verify(credentials["password"], user["password"]):
            response = jsonify(token=create_access_token(str(user.id), expires_delta=datetime.timedelta(hours=3)),
                           userId=str(user.id))
            response.status_code = 200
            return response
        else:
            response = jsonify(message="Bad Password!")
            response.status_code = 401
            return response


api.add_resource(CreateUser, '/user/create/')
api.add_resource(Authenticate, '/user/authenticate/')
