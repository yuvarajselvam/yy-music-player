from datetime import datetime

from mongoengine import Document, LazyReferenceField, IntField, DateTimeField
from models.UserModel import User


class ForgotPasswordToken(Document):
    meta = {'collection': 'forgot_password_tokens'}
    user = LazyReferenceField(User, dbref=False, required=True)
    token = IntField(min_value=0, max_value=999999, required=True)
    createdAt = DateTimeField(default=datetime.now)