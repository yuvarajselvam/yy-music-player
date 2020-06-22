from py2neo.database import GraphTransactionError

from models.UserModel import User
from models.DeviceModel import Device

from flask import request
from flask_restplus import Resource, Namespace

from utils.response import check_required_fields, make_response
from utils.logging import Logger

logger = Logger("register_device").logger

device_ns = Namespace('Device management', description='Allows for linking/unlinking of '
                                                       'devices to users for notifications')


class RegisterDevice(Resource):
    @device_ns.doc("Links/unlinks user device")
    def post(self):
        """Links/unlinks user device"""
        request_json = request.get_json()
        required_fields = ["userId", "token", "uniqueId"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        user_id = request_json.pop("userId")
        user = User.find_one(id=user_id)
        if not user:
            return make_response((f"User[{user_id}] not found.", 404))

        try:
            device = Device(request_json)
        except ValueError as e:
            return make_response((f"Error when creating device: {str(e)}.", 400))

        try:
            device.save()
            device.link_user(user.get_node())
            return make_response((f"Device registered successfully.", 200))
        except GraphTransactionError as e:
            return make_response((f"Device already registered: {device.name}.", 409))
        except Exception as e:
            return make_response((f"Error when creating device: {str(e)}.", 400))


device_ns.add_resource(RegisterDevice, '/register-device/')
