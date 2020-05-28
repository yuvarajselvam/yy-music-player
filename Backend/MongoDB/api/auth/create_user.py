from os import environ as env
import json

from flask import request, jsonify
from flask_restful import Resource
from mongoengine import ValidationError, NotUniqueError
from passlib.hash import sha256_crypt

from models.UserModel import User


class CreateUser(Resource):
    @staticmethod
    def post():
        user = request.get_json()
        if env['verbose']:
            print("\nUser sign up:", json.dumps(user, indent=2, sort_keys=True))
        try:
            if len(user["password"]) >= 6:
                user["password"] = sha256_crypt.encrypt(user["password"])
                user_json = json.dumps(user)
                new_user = User.from_json(json_data=user_json)
                new_user.save()
                response = new_user.to_json()
                if env['verbose']:
                    print("Response:", json.dumps(response, indent=2, sort_keys=True))
                return response, 201
            else:
                raise ValidationError("Password field must be at least 6 characters long!")
        except ValidationError as e:
            response = jsonify(Error=str(e))
            response.status_code = 400
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
        except NotUniqueError as e:
            response = jsonify(Error=str(e))
            response.status_code = 409
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
        except KeyError as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
