from mongoengine import DoesNotExist

from models.UserModel import User
from models.ForgotPaswordTokenModel import ForgotPasswordToken


def get_user_by_email(email):
    try:
        return User.objects.get(email=email)
    except DoesNotExist:
        return


def get_token_by_user(user):
    try:
        return ForgotPasswordToken.objects(user=user).order_by('-createdAt')[0]
    except DoesNotExist:
        return
