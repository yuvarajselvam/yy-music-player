import datetime
import json
from flask import request, jsonify
from flask_jwt_extended import create_access_token
from flask_restful import Resource

from passlib.hash import sha256_crypt
from utils import retrieve
from utils.logging import Logger


logger = Logger('authenticate').logger


class Authenticate(Resource):
    @staticmethod
    def post():
        credentials = request.get_json()
        logger.debug(f"\nUser sign in: {json.dumps(credentials, indent=2, sort_keys=True)}")

        user = retrieve.get_user_by_email(credentials["email"])

        if user and ("password" in user) and sha256_crypt.verify(credentials["password"], user["password"]):
            exp_delta = datetime.timedelta(hours=3)
            response = jsonify(authToken=create_access_token(str(user.id), expires_delta=exp_delta),
                               userId=str(user.id),
                               expires=datetime.datetime.now() + exp_delta)
            response.status_code = 200
            logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
        elif "password" not in user:
            response = jsonify(message="User previously signed in via SSO.")
            response.status_code = 400
            logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
        else:
            response = jsonify(message="Bad Email and Password!")
            response.status_code = 401
            logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
