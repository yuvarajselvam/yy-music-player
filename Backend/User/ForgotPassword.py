from datetime import datetime, timedelta
from random import random

from flask import request, jsonify
from flask_restful import Resource
from mongoengine import ValidationError

from User import Retrieve
from models.PasswordChangeTokenModel import PasswordChangeToken
from utils import EmailUtils
from hmac import compare_digest


class ForgotPassword(Resource):
    @staticmethod
    def post():
        email = request.get_json()["email"]
        token = int(random() * 1000000)
        subject = "Password reset - Weplay"
        msg = f"Your 6-Digit verification code is We-{token}"
        user = Retrieve.get_user_by_email(email)
        print(email, token, user)
        if user:
            if "password" in user:
                try:
                    password_change_token = PasswordChangeToken(user=user, token=token)
                    is_mail_sent = EmailUtils.send_message(email, subject, msg)
                    print(is_mail_sent)
                    password_change_token.save()

                except ValidationError as e:
                    response = jsonify(Error=str(e))
                    response.status_code = 400
                    return response

                if is_mail_sent:
                    response = jsonify(message=f"A 6-Digit token has been sent to {email}.")
                    response.status_code = 200
                    return response
                else:
                    response = jsonify(message="Error sending email")
                    response.status_code = 503
                    return response
            else:
                response = jsonify(message="User previously signed in via SSO.")
                response.status_code = 400
                return response

        else:
            response = jsonify(message=f"{email} is not a registered user.")
            response.status_code = 404
            return response


class ValidatePasswordChangeToken(Resource):
    @staticmethod
    def post():
        req = request.get_json()
        try:
            email = req['email']
            token = req['token']
            timestamp = req['timestamp']
            datetime_object = datetime.strptime(timestamp, '%d/%m/%y %H:%M:%S')
            user = Retrieve.get_user_by_email(email)
            forgot_password_token = Retrieve.get_token_by_user(user)
            print(forgot_password_token['token'], forgot_password_token['createdAt'])
            is_expired = (timedelta.total_seconds(datetime_object - forgot_password_token['createdAt']) / 60) > 60
            print(timedelta.total_seconds(datetime_object - forgot_password_token['createdAt']) / 60, is_expired)
            if is_expired:
                response = jsonify(message="Token expired.")
                response.status_code = 401
                return response
            else:
                if compare_digest(str(forgot_password_token['token']), token):
                    response = jsonify(message="Token matched.")
                    response.status_code = 200
                    return response
                else:
                    response = jsonify(message="Token did not match.")
                    response.status_code = 401
                    return response
        except ValueError as e:
            response = jsonify(Error=str(e))
            response.status_code = 400
            return response
        except KeyError as e:
            response = jsonify(Error=str(e) + " field is mandatory!")
            response.status_code = 400
            return response
