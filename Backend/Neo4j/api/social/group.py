from flask import request, jsonify
from flask_restplus import Resource

from firebase_admin.messaging import UnregisteredError

from models.DeviceModel import Device
from models.UserModel import User
from models.GroupModel import Group

from utils.logging import Logger
from utils.exceptions import AppLogicError
from utils.notifications import NotificationUtil as Notify
from utils.response import check_required_fields, make_response
from api.social.follow import social_ns


logger = Logger("group").logger


class CreateGroup(Resource):
    @social_ns.doc("Creates a new group for user")
    def post(self):
        """Creates a new group for user"""
        request_json = request.get_json()
        required_fields = ["name", "scope"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        owner = User.find_one(id=request.user)
        if not owner:
            return make_response((f"User[{request.user}] not found.", 404))

        try:
            group = Group(request_json)
        except ValueError as e:
            return make_response((f"Error when creating group: {str(e)}.", 400))

        try:
            group.save()
            group.link_admin(owner.get_node())
            response = jsonify(group.json())
            response.status_code = 201
            return response
        except Exception as e:
            return make_response((f"Error when creating group: {str(e)}.", 400))


class GetGroup(Resource):
    @social_ns.doc("Get group object given an User ID and Group ID")
    def get(self, _id):
        """Get group object given an User ID and Group ID"""
        user = User.find_one(id=request.user)
        if not user:
            return make_response((f"User[{request.user}] not found.", 404))

        group = Group.find_one(id=_id)
        if not group:
            return make_response((f"Group[{_id}] not found.", 404))

        if group.check_visibility(user.get_node()):
            response = jsonify(group.json())
            response.status_code = 200
            return response
        else:
            return make_response((f"User[{user.id}] does not have access to the group[{_id}].", 401))


class ListGroups(Resource):
    @social_ns.doc("Lists the groups of the user given an User ID")
    def get(self):
        """Lists the groups of the user given an User ID"""
        user = User.find_one(id=request.user)
        if not user:
            return make_response((f"User[{request.user}] not found.", 404))

        return {"groups": user.get_groups()}, 200


class EditGroup(Resource):
    @social_ns.doc("Adds/Removes members to/from a group or edits group details")
    def put(self, _id):
        """Adds/Removes members to/from a group or edits group details"""
        request_json = request.get_json()
        required_fields = ["operation", "members"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        group = Group.find_one(id=_id)
        if not group:
            return make_response((f"Group[{_id}] not found.", 404))

        user = User.find_one(id=request.user)
        if not user:
            return make_response((f"User[{request.user}] not found.", 404))

        if group.check_adminship(user.get_node()):
            for user_dict in request_json["members"]:
                user_id = user_dict["id"]
                user = User.find_one(id=user_id)
                if request_json["operation"] == "removeMembers":
                    try:
                        group.remove_member(user.get_node())
                    except AppLogicError as e:
                        return make_response((str(e), 400))
                else:
                    return make_response((f"Invalid operation[{request_json['operation']}]", 400))
        else:
            return make_response((f"User[{request.user}] does not have required permissions.", 401))


class DeleteGroup(Resource):
    @social_ns.doc("Deletes a group")
    def delete(self, _id):
        """Deletes a group"""
        group = Group.find_one(id=_id)
        if not group:
            return make_response((f"Group[{_id}] not found.", 404))

        user = User.find_one(id=request.user)
        if group.check_adminship(user.get_node()):
            group.delete()
            return make_response(("Delete successful.", 200))
        else:
            return make_response((f"User[{request.user}] does not have required permissions.", 401))


class GroupInviteSender(Resource):
    @social_ns.doc("Invites an user to a group")
    def post(self, _id):
        """Invites an user to a group"""
        request_json = request.get_json()
        required_fields = ["users"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        current_user = User.find_one(id=request.user)
        if not current_user:
            return make_response((f"User[{request.user}] not found.", 404))

        group = Group.find_one(id=_id)
        if not group:
            return make_response((f"Group[{_id}] not found.", 404))
        if not group.check_adminship(current_user.get_node()):
            return make_response((f"User[{request.user}] does not have required permissions.", 401))

        for user_dict in request_json["users"]:
            user_id = user_dict["id"]
            user = User.find_one(id=user_id)
            if not user:
                return make_response((f"User[{user_id}] not found.", 404))

            try:
                group.invite(user.get_node(), current_user.get_node())
            except AppLogicError as e:
                return make_response((str(e), 400))

            data_payload = {"Message": f"{current_user.name} has invited you to their group: {group.name}."}
            notify_payload = {"title": f"{current_user.name} has invited you to their group: {group.name}.",
                              "body": "Tap to accept/reject"}

            for device in user.get_devices():
                try:
                    Notify.send(token=device["token"], data=data_payload, notification=notify_payload)
                except UnregisteredError:
                    device = Device.find_one(id=device["id"])
                    device.delete()

        return make_response((f"Invite(s) sent successfully.", 200))


class GroupInviteResponder(Resource):
    @social_ns.doc("Responds to group invite")
    def post(self, _id, _op):
        """Responds to group invite"""
        request_json = request.get_json()
        required_fields = ["userId"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        current_user = User.find_one(id=request.user)
        if not current_user:
            return make_response((f"User[{request.user}] not found.", 404))

        group = Group.find_one(id=_id)
        if not group:
            return make_response((f"Group[{_id}] not found.", 404))

        user = User.find_one(id=request_json["userId"])
        if not user:
            return make_response((f"User[{request_json['userId']}] not found.", 404))

        try:
            group.respond_to_group_invite(current_user.get_node(), _op)
        except AppLogicError as e:
            return make_response((str(e), 400))

        data_payload = {"Message": f"{current_user.name} has {_op.lower()}ed your group invite."}
        notify_payload = {"title": f"{current_user.name} has {_op.lower()}ed your group invite.", "body": ""}
        for device in user.get_devices():
            try:
                Notify.send(token=device["token"], data=data_payload, notification=notify_payload)
            except UnregisteredError:
                device = Device.find_one(id=device["id"])
                device.delete()

        return make_response((f"{current_user.name} {_op.lower()}ed the invite.", 200))


social_ns.add_resource(CreateGroup, '/group/create/')
social_ns.add_resource(GetGroup, '/group/<_id>/')
social_ns.add_resource(ListGroups, '/groups/')
social_ns.add_resource(EditGroup, '/group/<_id>/edit/')
social_ns.add_resource(DeleteGroup, '/group/<_id>/delete/')
social_ns.add_resource(GroupInviteSender, '/group/<_id>/invite/')
social_ns.add_resource(GroupInviteResponder, '/group/<_id>/invite/<_op>/')
