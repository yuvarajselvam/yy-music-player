from datetime import datetime, timedelta
from random import random

from flask import request, jsonify
from flask_restful import Resource
from mongoengine import ValidationError

from User import Retrieve
from models.ForgotPaswordTokenModel import ForgotPasswordToken
from utils import EmailUtils


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
            try:
                forgot_password_token = ForgotPasswordToken(user=user, token=token)
                is_mail_sent = EmailUtils.send_message(email, subject, msg)
                print(is_mail_sent)
                forgot_password_token.save()

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
            response = jsonify(message=f"{email} is not a registered user.")
            response.status_code = 404
            return response


class ValidateForgotPasswordToken(Resource):
    @staticmethod
    def post():
        req = request.get_json()
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
            if str(forgot_password_token['token']) == token:
                response = jsonify(message="Token expired")
                response.status_code = 200
                return response
            else:
                response = jsonify(message="Token did not match.")
                response.status_code = 401
                return response
