import datetime

from flask import request, jsonify
from flask_jwt_extended import create_access_token
from flask_restful import Resource

from passlib.hash import sha256_crypt
from User import Retrieve


class Authenticate(Resource):
    @staticmethod
    def post():
        credentials = request.get_json()
        user = Retrieve.get_user_by_email(credentials["email"])

        if user and sha256_crypt.verify(credentials["password"], user["password"]):
            response = jsonify(token=create_access_token(str(user.id), expires_delta=datetime.timedelta(hours=3)),
                               userId=str(user.id))
            response.status_code = 200
            return response
        else:
            response = jsonify(message="Bad Email and Password!")
            response.status_code = 401
            return response
