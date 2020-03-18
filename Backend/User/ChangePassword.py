from flask import request, jsonify
from flask_restful import Resource
from passlib.handlers.sha2_crypt import sha256_crypt

from User import Retrieve


class ChangePassword(Resource):
    @staticmethod
    def post():
        credentials = request.get_json()
        try:
            if credentials["grantType"] == "forgot_password_token":
                user = Retrieve.get_user_by_email(credentials["email"])
                if user:
                    token = Retrieve.get_token_by_user(user)
                    if token["consumed"]:
                        response = jsonify(message="Token already consumed.")
                        response.status_code = 401
                        return response
                    else:
                        user.update(set__password=sha256_crypt.encrypt(credentials["newPassword"]))
                        token.update(set__consumed=True)
                        user.save()
                        token.save()
                        response = jsonify(message="Password change successful.")
                        response.status_code = 200
                        return response
                else:
                    response = jsonify(message="Bad request.")
                    response.status_code = 400
                    return response
            else:
                pass
        except KeyError as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            return response
