from flask import request
from flask_restplus import Namespace, Resource
from firebase_admin.messaging import UnregisteredError

from models.UserModel import User
from models.DeviceModel import Device

from utils.logging import Logger
from utils.exceptions import AppLogicError
from utils.notifications import NotificationUtil as Notify
from utils.response import check_required_fields, make_response

logger = Logger("follow").logger
social_ns = Namespace('Social', description='Endpoints that perform social operations')


class FollowRequestSender(Resource):
    @social_ns.doc("Sends follow request")
    def post(self):
        """Sends follow request"""
        request_json = request.get_json()
        required_fields = ["follower", "followee"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        follower = User.find_one(id=request_json["follower"])
        if not follower:
            return make_response((f"User[{request_json['follower']}] not found.", 404))
        followee = User.find_one(id=request_json["followee"])
        if not followee:
            return make_response((f"User[{request_json['followee']}] not found.", 404))

        try:
            followee.send_follow_request(follower.get_node())
        except AppLogicError as e:
            return make_response((str(e), 400))

        data_payload = {"Message": f"{follower.name} has requested to follow you.",
                        "follower": str(follower.name)}
        notify_payload = {"title": f"{follower.name} has requested to follow you.",
                          "body": "Tap to accept/reject"}

        for device in followee.get_devices():
            try:
                Notify.send(token=device["token"], data=data_payload, notification=notify_payload)
            except UnregisteredError:
                device = Device.find_one(id=device["id"])
                device.delete()

        return make_response((f"Request sent successfully to {followee.name}", 200))


class FollowRequestResponder(Resource):
    @social_ns.doc("Responds to follow request")
    def post(self, _op):
        """Responds to follow request"""
        request_json = request.get_json()
        required_fields = ["follower", "followee"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        follower = User.find_one(id=request_json["follower"])
        if not follower:
            return make_response((f"User[{request_json['follower']}] not found.", 404))
        followee = User.find_one(id=request_json["followee"])
        if not followee:
            return make_response((f"User[{request_json['followee']}] not found.", 404))

        try:
            followee.respond_to_follow_request(follower.get_node(), _op)
        except AppLogicError as e:
            return make_response((str(e), 400))

        data_payload = {"Message": f"{followee.name} has {_op.lower()}ed your follow request."}
        notify_payload = {"title": f"{followee.name} has {_op.lower()}ed your follow request.", "body": ""}
        for device in follower.get_devices():
            try:
                Notify.send(token=device["token"], data=data_payload, notification=notify_payload)
            except UnregisteredError:
                device = Device.find_one(id=device["id"])
                device.delete()

        return make_response((f"{followee.name} {_op.lower()}ed the request.", 200))


class ListFollowers(Resource):
    @social_ns.doc("Lists the followers of the user given an User ID")
    def get(self, _user_id):
        """Lists the followers of the user given an User ID"""
        user = User.find_one(id=_user_id)
        if user:
            return {"followers": user.get_followers()}, 200
        else:
            return make_response((f"User[{_user_id}] not found.", 404))


class ListFollowing(Resource):
    @social_ns.doc("Lists the following of the user given an User ID")
    def get(self, _user_id):
        """Lists the following of the user given an User ID"""
        user = User.find_one(id=_user_id)
        if user:
            return {"following": user.get_following()}, 200
        else:
            return make_response((f"User[{_user_id}] not found.", 404))


class GetAllUsers(Resource):
    @social_ns.doc("Get all users")
    def get(self):
        return {"users": User.get_all_users()}, 200


class ListPendingRequests(Resource):
    @social_ns.doc("Lists all the inbound and outbound follow requests of the user given an User ID")
    def get(self, _user_id):
        """Lists all the inbound and outbound follow requests of the user given an User ID"""
        user = User.find_one(id=_user_id)
        if user:
            return {"pendingRequests": user.get_pending_requests()}, 200
        else:
            return make_response((f"User[{_user_id}] not found.", 404))


social_ns.add_resource(FollowRequestSender, '/follow-request/')
social_ns.add_resource(FollowRequestResponder, '/follow-request/<_op>/')
social_ns.add_resource(ListFollowers, '/user/<_user_id>/followers/')
social_ns.add_resource(ListFollowing, '/user/<_user_id>/following/')
social_ns.add_resource(GetAllUsers, '/users/')
social_ns.add_resource(ListPendingRequests, '/user/<_user_id>/pending-requests/')
