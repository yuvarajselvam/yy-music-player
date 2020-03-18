import re
from datetime import datetime
from mongoengine import StringField, DateTimeField, EmailField, DynamicDocument, DynamicEmbeddedDocument, \
    EmbeddedDocumentField, URLField


class Google(DynamicEmbeddedDocument):
    userId = StringField(required=True)
    accessToken = StringField()
    refreshToken = StringField(required=True)
    photoUrl = URLField()


class Facebook(DynamicEmbeddedDocument):
    userId = StringField(required=True)
    accessToken = StringField()


class User(DynamicDocument):
    meta = {'collection': 'users'}
    fullName = StringField(required=True)
    email = EmailField(required=True, unique=True)
    phone = StringField(min_length=10, max_length=10, regex=re.compile('[0-9]{10}'))
    password = StringField()
    google = EmbeddedDocumentField(Google)
    facebook = EmbeddedDocumentField(Facebook)
    createdAt = DateTimeField(default=datetime.now)
