from mongoengine import DoesNotExist

from models.UserModel import User


def get_user_by_email(email):
    try:
        return User.objects.get(email=email)
    except DoesNotExist:
        return

