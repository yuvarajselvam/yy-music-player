import sys

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api

from mongoengine import connect
from models import User
import urllib
import json
import ssl

PASSWORD = "Musiqplayer@123"
HOST_NAME = "mongodb+srv://yympserver:" + urllib.parse.quote_plus(
    PASSWORD) + "@yy-music-player-dev-fygew.mongodb.net/YY-MP-DB?retryWrites=true&w=majority"

app = Flask(__name__)
CORS(app)
api = Api(app)


class CreateUser(Resource):
    def post(self):
        print(request.get_json())
        user = json.dumps(request.get_json())
        connect('YY-MP-DB', host=HOST_NAME, ssl_cert_reqs=ssl.CERT_NONE)
        try:
            newUser = User.from_json(json_data=user)
            newUser.save()
        except:
            return jsonify(Error=str(sys.exc_info()[1]))

        print(newUser.id)
        return newUser.to_json(), 201


api.add_resource(CreateUser, '/user/create/')
