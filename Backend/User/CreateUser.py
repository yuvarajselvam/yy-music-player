import sys

from flask import request, jsonify
from flask_restful import Resource
from mongoengine import ValidationError

from passlib.hash import sha256_crypt

from utils.DbUtils import DbUtils
from models.UserModel import User
import json


def create_user(user_json):
    new_user = User.from_json(json_data=user_json)
    new_user.save()
    return new_user


class CreateUser(Resource):
    @staticmethod
    def post():
        user = request.get_json()
        user["password"] = sha256_crypt.encrypt(user["password"])
        user_json = json.dumps(user)
        try:
            response = create_user(user_json)
            return response.to_json(), 201
        except ValidationError as e:
            response = jsonify(Error=str(e))
            response.status_code = 401
            return response
        except:
            return jsonify(Error=str(sys.exc_info()[1])), 500
