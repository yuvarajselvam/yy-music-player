import json
import requests
from os import environ as env

from mongoengine import ValidationError

from utils import retrieve
from models.UserModel import Google, Facebook, User
from utils.secrets import Secrets

from google.oauth2 import id_token
from google.auth.transport import requests as grequests

from flask import request, jsonify
from flask_restful import Resource


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
        "fullName": credentials["fullName"],
        "email": credentials["email"]
    }
    user = User.from_json(json_data=json.dumps(user_dict))
    if update_social(user, credentials):
        if env['verbose']:
            print(json.dumps(user.to_json(), indent=2, sort_keys=True))
        return user.to_json(), 201
    else:
        response = jsonify(Error="Type invalid")
        response.status_code = 401
        if env['verbose']:
            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response


class SingleSignOn(Resource):
    @staticmethod
    def post():
        credentials = request.get_json()
        if env['verbose']:
            print("\nSingle sign on:", json.dumps(credentials, indent=2, sort_keys=True))
        try:
            user = retrieve.get_user_by_email(credentials["email"])
            if user:
                if credentials["type"] in user:
                    authorized = False
                    if credentials["type"] == "google":
                        id_info = id_token.verify_oauth2_token(credentials['idToken'], grequests.Request())

                        if env['verbose']:
                            print("Trying to refresh google token...")
                            print(id_info)

                        if id_info['iss'] in ['accounts.google.com', 'https://accounts.google.com']:
                            authorized = True

                    elif credentials["type"] == "facebook":
                        url = "https://" + \
                              f"graph.facebook.com/me?fields=id,name,email&access_token={credentials['accessToken']}"
                        r = requests.post(url)

                        if env['verbose']:
                            print("Trying to refresh facebook token...\n",
                                  json.dumps(json.loads(r.text), indent=2, sort_keys=True))

                        authorized = "email" in r.text

                    if authorized:
                        update_social(user, credentials)
                        response = jsonify(message=f"User present and has a {credentials['type']} account.")
                        response.status_code = 200
                        if env['verbose']:
                            print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                    else:
                        response = jsonify(Error="Token expired.")
                        response.status_code = 401
                        if env['verbose']:
                            print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                else:
                    if update_social(user, credentials):
                        response = jsonify(message=f"User present but did not link {credentials['type']} " +
                                                   "account before. Updated now.")
                        response.status_code = 200
                        if env['verbose']:
                            print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                    else:
                        response = jsonify(Error="Type invalid")
                        response.status_code = 400
                        if env['verbose']:
                            print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
            else:
                return create_new_user(credentials)

        except (KeyError, ValidationError) as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
