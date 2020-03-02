from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse

from mongoengine import connect
from models import User
import urllib
import ssl

PASSWORD = "Musiqplayer@123"
HOST_NAME = "mongodb+srv://yympserver:" + urllib.parse.quote_plus(PASSWORD) + "@yy-music-player-dev-fygew.mongodb.net/YY-MP-DB?retryWrites=true&w=majority"

app = Flask(__name__)
CORS(app)
api = Api(app)


class CreateUser(Resource):
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("firstName", required=True)
        parser.add_argument("lastName", required=True)
        parser.add_argument("email", required=True)
        parser.add_argument("phone", required=True)
        parser.add_argument("password", required=True)
        user = parser.parse_args()
        connect('YY-MP-DB', host=HOST_NAME, ssl_cert_reqs=ssl.CERT_NONE)
        newUser = User(firstName=user["firstName"], lastName=user["lastName"], email=user["email"], phone=user["phone"], password=user["password"])
        newUser.save()
        print(newUser.id)
        return newUser.to_json(), 201


api.add_resource(CreateUser, '/user/create/')
