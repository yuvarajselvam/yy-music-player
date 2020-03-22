import json
import requests
from os import environ as env

from utils import retrieve
from api.auth.create_user import create_user
from models.UserModel import Google, Facebook
from utils.secrets import Secrets

from flask import request, jsonify
from flask_restful import Resource


def update_social(user, credentials):
    if credentials["type"] == "google":
        google_dict = {
            "userId": credentials["id"],
            "refreshToken": credentials["refreshToken"],
            "accessToken": credentials["accessToken"],
        }
        if "photoUrl" in credentials:
            google_dict["photoUrl"] = credentials["photoUrl"]
        user.update(set__google=Google.from_json(json.dumps(google_dict)))

    elif credentials["type"] == "facebook":
        facebook_dict = {
            "userId": credentials["id"],
            "accessToken": credentials["accessToken"]
        }
        user.update(set__facebook=Facebook.from_json(json.dumps(facebook_dict)))

    else:
        return
    user.save()
    return user


def create_new_user(credentials):
    user_dict = {
        "fullName": credentials["fullName"],
        "email": credentials["email"]
    }
    user = create_user(json.dumps(user_dict))
    if update_social(user, credentials):
        return user.to_json(), 201
    else:
        response = jsonify(Error="Type invalid")
        response.status_code = 401
        return response


class SingleSignOn(Resource):
    @staticmethod
    def post():
        credentials = request.get_json()
        if env['verbose']:
            print("Single sign on:", json.dumps(credentials, indent=2, sort_keys=True))
        try:
            user = retrieve.get_user_by_email(credentials["email"])
            if user:
                if credentials["type"] in user:
                    authorized = False
                    if credentials["type"] == "google":
                        url = f"https://oauth2.googleapis.com/token?client_id=" \
                              f"{Secrets.IOS_CLIENT_ID if credentials['os'] == 'iOS' else Secrets.ANDROID_CLIENT_ID}" \
                              f"&grant_type=refresh_token&" + \
                              f"refresh_token={user['google']['refreshToken']}"
                        r = requests.post(url)
                        if env['verbose']:
                            print("Trying to refresh google token...\n",
                                  json.dumps(json.loads(r.text), indent=2, sort_keys=True))
                        authorized = "access_token" in r.text
                    elif credentials["type"] == "facebook":
                        url = f"https://graph.facebook.com/me?fields=id,name,email" + \
                              f"&access_token={user['facebook']['accessToken']}"
                        r = requests.post(url)
                        if env['verbose']:
                            print("Trying to refresh facebook token\n",
                                  json.dumps(json.loads(r.text), indent=2, sort_keys=True))
                        authorized = "email" in r.text

                    if authorized:
                        response = jsonify(message=f"User present and has a {credentials['type']} account.")
                        response.status_code = 200
                        if env['verbose']:
                            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                    else:
                        response = jsonify(Error="Token expired")
                        response.status_code = 401
                        if env['verbose']:
                            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                else:
                    if update_social(user, credentials):
                        response = jsonify(message=f"User present but did not link {credentials['type']}" +
                                                   "account before. Updated now.")
                        response.status_code = 200
                        if env['verbose']:
                            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
                    else:
                        response = jsonify(Error="Type invalid")
                        response.status_code = 400
                        if env['verbose']:
                            print(json.dumps(response.get_json(), indent=2, sort_keys=True))
                        return response
            else:
                return create_new_user(credentials)

        except KeyError as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            if env['verbose']:
                print(json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
