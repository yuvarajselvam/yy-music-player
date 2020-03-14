import re
from datetime import datetime
from mongoengine import StringField, DateTimeField, EmailField, Document, EmbeddedDocument, EmbeddedDocumentField


class Google(EmbeddedDocument):
    userId = StringField(required=True)
    accessToken = StringField()
    refreshToken = StringField(required=True)
    photoUrl = StringField()


class Facebook(EmbeddedDocument):
    userId = StringField(required=True)
    accessToken = StringField()


class User(Document):
    meta = {'collection': 'users'}
    fullName = StringField(required=True)
    email = EmailField(required=True, unique=True)
    phone = StringField(min_length=10, max_length=10, regex=re.compile('[0-9]{10}'))
    password = StringField()
    google = EmbeddedDocumentField(Google)
    facebook = EmbeddedDocumentField(Facebook)
    createdAt = DateTimeField(default=datetime.now)
