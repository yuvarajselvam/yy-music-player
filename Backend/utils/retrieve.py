import json

from flask import jsonify

from mongoengine import DoesNotExist

from models.UserModel import User
from models.PasswordChangeTokenModel import PasswordChangeToken

from utils.response import resource_not_found, error_response
from utils.logging import Logger

logger = Logger("retrieve").logger


def get_user_by_email(email):
    try:
        return User.objects.get(email=email)
    except DoesNotExist:
        return


def get_token_by_user(user):
    try:
        return PasswordChangeToken.objects(user=user).order_by('-createdAt')[0]
    except DoesNotExist:
        return


def list_api(source_model, target_model, source_id, source_key):
    try:
        source_object = source_model.objects(pk=source_id).first()
    except:
        return error_response("Invalid ID", 400)

    if not source_object:
        return resource_not_found(source_model.__name__)

    if source_key in source_object and len(source_object[source_key]):
        target_list = []
        for target in source_object[source_key]:
            try:
                target = target_model.objects(pk=target.pk).first().to_json()
                target_list.append(target)
            except:
                return resource_not_found(f"{source_key[:-1].title()} [{str(target.pk)}]")
        response = jsonify(target_list)
        response.status_code = 200
        logger.debug(json.dumps(response.get_json(), indent=2, sort_keys=True))
        return response
    else:
        response = jsonify([])
        response.status_code = 204
        return response
