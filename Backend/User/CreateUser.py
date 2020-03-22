import json

from flask import request, jsonify
from flask_restful import Resource
from mongoengine import ValidationError, NotUniqueError
from passlib.hash import sha256_crypt

from models.UserModel import User


def create_user(user_json):
    new_user = User.from_json(json_data=user_json)
    new_user.save()
    return new_user


class CreateUser(Resource):
    @staticmethod
    def post():
        user = request.get_json()
        try:
            if len(user["password"]) > 6:
                user["password"] = sha256_crypt.encrypt(user["password"])
                user_json = json.dumps(user)
                response = create_user(user_json)
                return response.to_json(), 201
            else:
                raise ValidationError("Password field must be at least 6 characters long!")
        except ValidationError as e:
            response = jsonify(Error=str(e))
            response.status_code = 400
            return response
        except NotUniqueError as e:
            response = jsonify(Error=str(e))
            response.status_code = 409
            return response
        except KeyError as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            return response
