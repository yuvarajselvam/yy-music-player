import datetime
import json
from os import environ as env
from flask import request, jsonify
from flask_jwt_extended import create_access_token
from flask_restful import Resource

from passlib.hash import sha256_crypt
from utils import retrieve


class Authenticate(Resource):
    @staticmethod
    def post():
        credentials = request.get_json()
        if env['verbose']:
            print(json.dumps(credentials, indent=2, sort_keys=True))

        user = retrieve.get_user_by_email(credentials["email"])

        if user and ("password" in user) and sha256_crypt.verify(credentials["password"], user["password"]):
            response = jsonify(token=create_access_token(str(user.id), expires_delta=datetime.timedelta(hours=3)),
                               userId=str(user.id))
            response.status_code = 200
            return response
        elif "password" not in user:
            response = jsonify(message="User previously signed in via SSO.")
            response.status_code = 400
            return response
        else:
            response = jsonify(message="Bad Email and Password!")
            response.status_code = 401
            return response
