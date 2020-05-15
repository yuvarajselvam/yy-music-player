import json

from flask import request, jsonify
from flask_restful import Resource

from models.UserModel import User
from utils import retrieve, logging, response as responseUtil


logger = logging.Logger("register_device").logger


class RegisterDevice(Resource):
    @staticmethod
    def post():
        data = request.get_json()
        logger.debug(f"Register device: \n {json.dumps(data, indent=2, sort_keys=True)}")
        user = User.objects(pk=data["userId"]).first()
        if not user:
            return responseUtil.resource_not_found(f"User [{data['userId']}]")
        if "newToken" in data:
            user.update(add_to_set__deviceTokens=data["newToken"])
        if "oldToken" in data:
            user.update(pull__deviceTokens=data["oldToken"])

        try:
            user.save()
            response = user.to_json()
            logger.info(f"User [{data['userId']}] devices updated.")
            return response, 200
        except Exception as e:
            logger.error(str(e))
            return responseUtil.error_response(str(e), 400)

