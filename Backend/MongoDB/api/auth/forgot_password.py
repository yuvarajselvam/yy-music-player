import json
from datetime import datetime, timedelta
from random import randint
from os import environ as env

from flask import request, jsonify
from flask_restful import Resource
from mongoengine import ValidationError

from utils import retrieve
from utils.email import EmailUtil
from models.PasswordChangeTokenModel import PasswordChangeToken
from hmac import compare_digest


class ForgotPassword(Resource):
    @staticmethod
    def post():
        if env['verbose']:
            print("\nForgot password:", json.dumps(request.get_json(), indent=2, sort_keys=True))
        email = request.get_json()["email"]
        token = randint(100000, 999999)
        subject = "Password reset - Weplay"
        msg = f"Your 6-Digit verification code is We-{token}"
        user = retrieve.get_user_by_email(email)
        if user:
            if "password" in user:
                try:
                    password_change_token = PasswordChangeToken(user=user, token=token)
                    is_mail_sent = EmailUtil().send_message(email, subject, msg)
                    if env['verbose']:
                        print("Mail sent:", is_mail_sent)
                    password_change_token.save()

                except ValidationError as e:
                    response = jsonify(Error=str(e))
                    response.status_code = 400
                    if env['verbose']:
                        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                    return response

                if is_mail_sent:
                    response = jsonify(message=f"A 6-Digit token has been sent to {email}.")
                    response.status_code = 200
                    if env['verbose']:
                        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                    return response
                else:
                    response = jsonify(message="Error sending email")
                    response.status_code = 503
                    if env['verbose']:
                        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                    return response
            else:
                response = jsonify(message="User previously signed in via SSO.")
                response.status_code = 400
                if env['verbose']:
                    print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                return response

        else:
            response = jsonify(message=f"{email} is not a registered user.")
            response.status_code = 404
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response


class ValidatePasswordChangeToken(Resource):
    @staticmethod
    def post():
        req = request.get_json()
        if env['verbose']:
            print("\nValidate token:", json.dumps(request.get_json(), indent=2, sort_keys=True))
        try:
            email = req['email']
            token = req['token']
            timestamp = req['timestamp']
            datetime_object = datetime.strptime(timestamp, '%d/%m/%y %H:%M:%S')
            user = retrieve.get_user_by_email(email)
            forgot_password_token = retrieve.get_token_by_user(user)
            is_expired = (timedelta.total_seconds(datetime_object - forgot_password_token['createdAt']) / 60) > 60
            if env['verbose']:
                print(f"The token {forgot_password_token['token']} was created at {forgot_password_token['createdAt']}")
                print("Has the token expired: ", is_expired)
            if is_expired:
                response = jsonify(message="Token expired.")
                response.status_code = 401
                if env['verbose']:
                    print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                return response
            else:
                if compare_digest(str(forgot_password_token['token']), token):
                    response = jsonify(message="Token matched.")
                    response.status_code = 200
                    if env['verbose']:
                        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                    return response
                else:
                    response = jsonify(message="Token did not match.")
                    response.status_code = 401
                    if env['verbose']:
                        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
                    return response
        except ValueError as e:
            response = jsonify(Error=str(e))
            response.status_code = 400
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
        except KeyError as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            if env['verbose']:
                print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
            return response
