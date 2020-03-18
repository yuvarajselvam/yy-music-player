from mongoengine import DoesNotExist

from models.UserModel import User
from models.PasswordChangeTokenModel import PasswordChangeToken


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
