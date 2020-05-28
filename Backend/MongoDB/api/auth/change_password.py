import json

from flask import request, jsonify
from flask_restful import Resource
from passlib.handlers.sha2_crypt import sha256_crypt

from utils import retrieve
from os import environ as env


class ChangePassword(Resource):
    @staticmethod
    def post():
        credentials = request.get_json()
        if env['verbose']:
            print("\nChange password:", json.dumps(credentials, indent=2, sort_keys=True))
        try:
            if credentials["grantType"] == "forgot_password_token":
                user = retrieve.get_user_by_email(credentials["email"])
                if user:
                    token = retrieve.get_token_by_user(user)
                    if token["consumed"]:
                        response = jsonify(message="Token already consumed.")
                        response.status_code = 401
                        if env['verbose']:
                            print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                    else:
                        user.update(set__password=sha256_crypt.encrypt(credentials["newPassword"]))
                        token.update(set__consumed=True)
                        user.save()
                        token.save()
                        response = jsonify(message="Password change successful.")
                        response.status_code = 200
                        if env['verbose']:
                            print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                else:
                    response = jsonify(message="Bad request.")
                    response.status_code = 400
                    if env['verbose']:
                        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                    return response
            else:
                pass
        except KeyError as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
