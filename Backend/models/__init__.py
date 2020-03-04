import re
from datetime import datetime
from mongoengine import StringField, DateTimeField, EmailField, Document


class User(Document):
    meta = {'collection': 'users'}
    firstName = StringField(required=True)
    lastName = StringField(required=True)
    email = EmailField(required=True, unique=True)
    phone = StringField(required=True, min_length=10, max_length=10, regex=re.compile('[0-9]{10}'))
    country = StringField()
    city = StringField()
    stateName = StringField()
    password = StringField()
    createdAt = DateTimeField(default=datetime.now)
