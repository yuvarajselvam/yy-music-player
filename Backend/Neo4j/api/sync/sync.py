import time

from flask import request, jsonify
from flask_restplus import Resource, Namespace

from models.UserModel import User

from utils.response import make_response
from utils.logging import Logger

logger = Logger("register_device").logger

sync_ns = Namespace('Synchronization', description='Allows for synchronising changes between'
                                                   ' Local Database and Server')


class Sync(Resource):
    @sync_ns.doc("Returns changes made on all the resources associated to the user given an User ID")
    def get(self):
        """Returns changes made on all the resources associated to the user given an User ID"""
        current_user = User.find_one(id=request.user)
        if not current_user:
            return make_response((f"User[{request.user}] not found.", 404))
        sync_fields = ["id", "email", "phone", "name", "username", "dob", "imageUrl"]
        user_dict = dict((k, v) for k, v in current_user.json().items() if k in sync_fields)
        final = {
            "changes": {
                "users": {
                    "created": [],
                    "updated": [user_dict],
                    "deleted": []
                }
            },
            "timestamp": str(time.time())
        }
        response = jsonify(final)
        response.status_code = 200
        return response

    def post(self):
        pass


sync_ns.add_resource(Sync, '/sync/')
