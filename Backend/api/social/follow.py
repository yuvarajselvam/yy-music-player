import json

from flask import jsonify, request
from flask_restful import Resource

from models.UserModel import User, PendingRequest

from utils import response as ResponseUtil
from utils.retrieve import list_api
from utils.logging import Logger
from utils.notifications import NotificationUtil as Notify

logger = Logger("follow").logger


class ListFollowers(Resource):
    @staticmethod
    def get(_user_id):
        logger.info(f"Listing followers of user: {_user_id}")
        return list_api(User, User, _user_id, "followers")


class ListFollowing(Resource):
    @staticmethod
    def get(_user_id):
        logger.info(f"Listing following of user: {_user_id}")
        return list_api(User, User, _user_id, "following")


class ListPendingRequests(Resource):
    @staticmethod
    def get(_user_id):
        logger.info(f"Listing pending requests of user: {_user_id}")
        user = User.objects(pk=_user_id).first()
        if not user:
            return ResponseUtil.resource_not_found(f"User [{_user_id}]")
        if "pendingRequests" in user and len(user["pendingRequests"]):
            response = [{"userId": str(req["userId"].pk), "isRequester": req["isRequester"]} for req in user["pendingRequests"]]
            return response, 200
        else:
            return None, 204


class FollowUser(Resource):
    @staticmethod
    def post():
        data = request.get_json()
        logger.debug(f"Follower: {data['follower']}     Followee: {data['followee']}")

        if not data["follower"] == data["followee"] or data["follower"]:
            follower = User.objects(pk=data["follower"]).first()
            followee = User.objects(pk=data["followee"]).first()

            if not (followee and follower):
                ResponseUtil.resource_not_found("User")

            data_payload = {"Message": f"{follower['name']} has requested to follow you.",
                            "follower": str(follower.pk)}
            notify_payload = {"title": f"{follower['name']} has requested to follow you.",
                              "body": "Tap to accept/reject"}

            try:
                for deviceToken in followee["deviceTokens"]:
                    Notify.send(token=deviceToken, data=data_payload, notification=notify_payload)
            except Exception as e:
                logger.error(str(e))
                return ResponseUtil.error_response(f"Error when sending notification: {str(e)}", 500)

            try:
                follower.update(add_to_set__pendingRequests=PendingRequest(userId=data["followee"], isRequester=True))
                followee.update(add_to_set__pendingRequests=PendingRequest(userId=data["follower"], isRequester=False))
                follower.validate()
                followee.validate()
                follower.save(validate=False)
                followee.save(validate=False)
            except Exception as e:
                logger.error(f"Could not update DB: {str(e)}")
                return ResponseUtil.error_response(f"Could not update DB: {str(e)} Please try again later", 500)

            response = jsonify(message="Request sent.")
            response.status_code = 200
            return response
        else:
            response = jsonify(message="You cannot follow yourself.")
            response.status_code = 400
            return response


class RespondToFollowRequest(Resource):
    @staticmethod
    def post(_op):
        data = request.get_json()
        logger.debug(f"{_op.title()} follow request -Follower: {data['follower']}     Followee: {data['followee']}")

        follower = User.objects(pk=data["follower"]).first()
        followee = User.objects(pk=data["followee"]).first()

        if not (followee and follower):
            ResponseUtil.resource_not_found("User")

        data_payload = {"Message": f"{followee['name']} has {_op.lower()}ed your follow request."}
        notify_payload = {"title": f"{followee['name']} has {_op.lower()}ed your follow request.", "body": ""}
        try:
            for deviceToken in follower["deviceTokens"]:
                Notify.send(token=deviceToken, data=data_payload, notification=notify_payload)
        except Exception as e:
            logger.error(str(e))
            return ResponseUtil.error_response(f"Error when sending notification: {str(e)}", 500)

        try:
            follower.update(pull__pendingRequests=PendingRequest(userId=data["followee"], isRequester=True))
            followee.update(pull__pendingRequests=PendingRequest(userId=data["follower"], isRequester=False))

            if _op.upper() == 'ACCEPT':
                follower.update(add_to_set__following=followee)
                followee.update(add_to_set__followers=follower)

            follower.validate()
            followee.validate()
            follower.save(validate=False)
            followee.save(validate=False)

        except Exception as e:
            logger.error(f"Could not update DB: {str(e)}")
            return ResponseUtil.error_response(f"Could not update DB: {str(e)} Please try again later", 500)

