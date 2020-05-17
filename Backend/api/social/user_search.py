import json
import re
import datetime

from flask import request, jsonify
from flask_restful import Resource

from models.UserModel import User

from utils.db import DbUtils
from utils.retrieve import get_user_by_email
from utils import response as ResponseUtil
from utils.logging import Logger

logger = Logger("user_search").logger
my_db = DbUtils().get_pymongo_connection()["YY-MP-DB"]


def format_object(obj):
    obj["_id"] = str(obj["_id"])
    return obj


class GetUser(Resource):
    @staticmethod
    def get(_user_id):
        logger.debug(f"Getting user: {_user_id}")
        user = User.objects(pk=_user_id).first()
        if user:
            response = user.to_json()
            response["createdAt"] = datetime.datetime.strftime(user["createdAt"], "%Y-%m-%dT%H:%M:%S")
            logger.debug(response)
            return response, 200
        else:
            ResponseUtil.resource_not_found(f"User [{_user_id}]")


class GetUserByEmail(Resource):
    @staticmethod
    def get(_user_email):
        logger.debug(f"Getting user: {_user_email}")
        user = get_user_by_email(_user_email)
        if user:
            response = user.to_json()
            small_response = {"_id": response["_id"], "email": response["email"], "name": response["names"]}
            return small_response, 200
        else:
            ResponseUtil.resource_not_found(f"User [{_user_email}]")


class UserSearch(Resource):
    @staticmethod
    def get():
        logger.debug(json.dumps(request.args, indent=2, sort_keys=True))
        search_key = request.args["searchKey"]
        users = my_db.users
        starts_with = re.compile(f"^{search_key}.*", re.IGNORECASE)
        matching_users = list(users.find({"$or": [{"name": starts_with}, {"username": starts_with}]},
                                         {"_id": 1, "username": 1, "name": 1}).limit(20))
        matching_users = [format_object(_user) or _user for _user in matching_users]
        logger.debug(matching_users)
        response = jsonify(searchResults=matching_users, searchKey=search_key)
        response.status_code = 200
        return response
