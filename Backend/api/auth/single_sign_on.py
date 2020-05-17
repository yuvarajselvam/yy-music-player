import datetime
import json
import requests
from flask_jwt_extended import create_access_token

from mongoengine import ValidationError
from models.UserModel import Google, Facebook, User

from utils import retrieve
from utils.secrets import Secrets
from utils.logging import Logger

from google.oauth2 import id_token
from google.auth.transport import requests as grequests

from flask import request, jsonify
from flask_restful import Resource


logger = Logger('sso').logger


def refresh_sso(credential_type, credential):
    authorized = False
    if credential_type == "google":
        id_info = id_token.verify_oauth2_token(credential, grequests.Request())
        logger.debug("Trying to refresh google token...")
        if id_info['iss'] in ['accounts.google.com', 'https://accounts.google.com']:
            authorized = True

    elif credential_type == "facebook":
        url = "https://" + \
              f"graph.facebook.com/me?fields=id,name,email&access_token={credential}"
        r = requests.post(url)
        logger.debug("Trying to refresh facebook token...")
        authorized = "email" in r.text
    return authorized


def update_social(user, credentials):
    if credentials["type"] == "google":
        google_dict = {
            "userId": credentials["id"] if "id" in credentials else user["google"]["userId"],
            "idToken": credentials["idToken"],
            "accessToken": credentials["accessToken"],
        }

        if "photoUrl" in credentials:
            google_dict["photoUrl"] = credentials["photoUrl"]

        user.google = Google.from_json(json.dumps(google_dict))

    elif credentials["type"] == "facebook":
        facebook_dict = {
            "userId": credentials["id"] if "id" in credentials else user["facebook"]["userId"],
            "accessToken": credentials["accessToken"]
        }
        user.facebook = Facebook.from_json(json.dumps(facebook_dict))

    else:
        return
    user.save()
    return user


def create_new_user(credentials):
    user_dict = {
        "name": credentials["name"],
        "email": credentials["email"]
    }
    user = User.from_json(json_data=json.dumps(user_dict))
    if update_social(user, credentials):
        exp_delta = datetime.timedelta(hours=3)
        response = jsonify(authToken=create_access_token(str(user.id), expires_delta=exp_delta),
                           userId=str(user.id),
                           expires=datetime.datetime.now() + exp_delta)
        response.status_code = 201
        logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response
    else:
        response = jsonify(Error="Type invalid")
        response.status_code = 401
        logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response


class SingleSignOn(Resource):
    @staticmethod
    def post():
        credentials = request.get_json()
        logger.debug(f"\nSingle sign on: {json.dumps(credentials, indent=2, sort_keys=True)}")
        try:
            user = retrieve.get_user_by_email(credentials["email"])
            if user:
                if credentials["type"] in user:
                    credential = credentials["idToken"] if credentials["type"] == 'google' else credentials["accessToken"]
                    authorized = refresh_sso(credentials["type"], credential)
                    if authorized:
                        update_social(user, credentials)
                        exp_delta = datetime.timedelta(hours=3)
                        response = jsonify(authToken=create_access_token(str(user.id), expires_delta=exp_delta),
                                           userId=str(user.id),
                                           expires=datetime.datetime.now() + exp_delta)
                        response.status_code = 200
                        logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                    else:
                        response = jsonify(Error="Token expired.")
                        response.status_code = 401
                        logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                else:
                    if update_social(user, credentials):
                        exp_delta = datetime.timedelta(hours=3)
                        response = jsonify(authToken=create_access_token(str(user.id), expires_delta=exp_delta),
                                           userId=str(user.id),
                                           expires=datetime.datetime.now() + exp_delta)
                        response.status_code = 200
                        logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                    else:
                        response = jsonify(Error="Type invalid")
                        response.status_code = 400
                        logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
            else:
                return create_new_user(credentials)

        except (KeyError, ValidationError) as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
