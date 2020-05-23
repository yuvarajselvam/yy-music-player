from flask import request, jsonify
from flask_restplus import Namespace, Resource

from models.UserModel import User
from models.AccountModel import Account

from utils.logging import Logger
from utils.mailing import MailingService
from utils.response import make_response, generate_auth_token_response, check_required_fields


logger = Logger("auth").logger
auth_ns = Namespace('Authorization', description='Endpoints that enable signing in to the app')


class CreateUser(Resource):
    @auth_ns.doc("Creates an user")
    def post(self):
        """Creates an user"""
        request_json = request.get_json()

        try:
            user = User(request_json)
        except ValueError as e:
            return make_response((f"Error when creating user: {str(e)}.", 400))

        try:
            user.save()
            response = jsonify(user.json())
            response.status_code = 201
            return response
        except Exception as e:
            return make_response((f"Error when creating user: {str(e)}.", 400))


class SignIn(Resource):
    @auth_ns.doc("Verifies email and password")
    def post(self):
        """Verifies email and password"""
        request_json = request.get_json()
        required_fields = ["email", "password"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        user = User.find_one(email=request_json["email"])
        if not user:
            return make_response((f"User[{request_json['email']}] not found.", 404))

        is_valid = user.verify_password(request_json["password"])
        if is_valid is None:
            return make_response((f"User[{request_json['email']}] previously signed in via SSO.", 400))
        elif is_valid:
            return generate_auth_token_response(user.id)
        else:
            return make_response((f"Email and password did not match.", 401))


class ForgotPasswordTokenGenerator(Resource):
    @auth_ns.doc("Sends forgot password token to the specified email")
    def post(self):
        """Sends forgot password token to the specified email"""
        request_json = request.get_json()
        required_fields = ["email"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        user = User.find_one(email=request_json["email"])
        if not user:
            return make_response((f"User[{request_json['email']}] not found.", 404))

        if user.password is None:
            return make_response((f"User[{request_json['email']}] previously signed in via SSO.", 400))

        token = user.generate_forgot_password()
        subject = "Password reset - YYMP"
        msg = f"Your 6-Digit verification code is YY-{token}"

        is_mail_sent = MailingService().send_message(request_json['email'], subject, msg)
        if is_mail_sent:
            return make_response((f"A 6-Digit token has been sent to {request_json['email']}.", 200))
        else:
            return make_response((f"Could not send email", 503))


class ForgotPasswordTokenValidator(Resource):
    @auth_ns.doc("Validates the forgot password token")
    def post(self):
        """Validates the forgot password token"""
        request_json = request.get_json()
        required_fields = ["email", "token"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        user = User.find_one(email=request_json["email"])
        if not user:
            return make_response((f"User[{request_json['email']}] not found.", 404))

        if not user.verify_forgot_password_token(request_json["token"]):
            return make_response(("Invalid token.", 401))
        else:
            return make_response(("Token matched.", 200))


class ChangePassword(Resource):
    @auth_ns.doc("Changes user password")
    def post(self):
        """Changes user password"""
        request_json = request.get_json()
        required_fields = ["email", "grantType", "newPassword"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        user = User.find_one(email=request_json["email"])
        if not user:
            return make_response((f"User[{request_json['email']}] not found.", 404))

        if request_json["grantType"] == 'forgot_password_token':
            if user.change_password(request_json["newPassword"]):
                return make_response((f"Password changed successfully for user[{request_json['email']}]", 200))
            else:
                return make_response((f"User[{request_json['email']}] does not have a consumable token", 400))
        else:
            raise NotImplementedError(f"Change password grant type: {request_json['grantType']}")


class SingleSignOn(Resource):
    @auth_ns.doc("Creates an user or logs in based on user existence")
    def post(self):
        """Creates an user or logs in based on user existence"""
        request_json = request.get_json()
        required_fields = ["email", "type"]

        is_bad_request = check_required_fields(required_fields, request_json)
        if bool(is_bad_request):
            return is_bad_request

        user = User.find_one(email=request_json["email"])

        if not user:
            try:
                user = User(name=request_json["name"], email=request_json["email"])
                account = Account(externalId=request_json["id"], token=request_json["token"], type=request_json["type"])
                if "photoUrl" in request_json:
                    account.photoUrl = request_json["photoUrl"]
                user.save()
                account.save()
                account.link_user(user.get_node())
                response = generate_auth_token_response(user.id)
                response.status_code = 201
                return response
            except Exception as e:
                return make_response((f"Error in SSO: {str(e)}.", 400))
        else:
            accounts = user.get_linked_accounts(accountType=request_json["type"].upper())
            if len(accounts):
                account = Account(accounts[0])
                if "token" in request_json:
                    account.token = request_json["token"]
                if account.refresh_token():
                    return generate_auth_token_response(user.id)
                else:
                    return make_response((f"{account.type.title()} refresh token expired.", 401))
            else:
                account = Account(externalId=request_json["id"], token=request_json["token"], type=request_json["type"])
                account.save()
                account.link_user(user.get_node())
                return generate_auth_token_response(user.id)


class GetUser(Resource):
    @auth_ns.doc("Returns the user object given its ID")
    def get(self, _user_id):
        """Returns the user object given its ID"""
        user = User.find_one(id=_user_id)
        if user:
            user_dict = user.json()
            user_dict.pop("password", None)
            response = jsonify(user_dict)
            response.status_code = 200
            return response
        else:
            return make_response((f"User[{_user_id}] not found.", 404))


auth_ns.add_resource(CreateUser, '/signup/')
auth_ns.add_resource(SignIn, '/signin/')
auth_ns.add_resource(SingleSignOn, '/sso/')
auth_ns.add_resource(ForgotPasswordTokenGenerator, '/forgot-password/')
auth_ns.add_resource(ForgotPasswordTokenValidator, '/forgot-password/validate/')
auth_ns.add_resource(ChangePassword, '/change-password/')
auth_ns.add_resource(GetUser, '/user/<_user_id>/')
