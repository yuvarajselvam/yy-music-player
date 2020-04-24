import re
from datetime import datetime
from models.PlaylistModel import Playlist
from mongoengine import StringField, DateTimeField, EmailField, DynamicDocument, DynamicEmbeddedDocument, \
    EmbeddedDocumentField, URLField, ValidationError, ListField, LazyReferenceField, PULL


class Google(DynamicEmbeddedDocument):
    userId = StringField(required=True)
    accessToken = StringField()
    idToken = StringField(required=True)
    photoUrl = URLField()


class Facebook(DynamicEmbeddedDocument):
    userId = StringField(required=True)
    accessToken = StringField()


class User(DynamicDocument):
    meta = {'collection': 'users'}
    fullName = StringField(required=True)
    email = EmailField(required=True, unique=True)
    phone = StringField(min_length=10, max_length=10, regex=re.compile('[0-9]{10}'))
    password = StringField(min_length=6)
    google = EmbeddedDocumentField(Google)
    facebook = EmbeddedDocumentField(Facebook)
    playlists = ListField(LazyReferenceField(Playlist, reverse_delete_rule=PULL))
    createdAt = DateTimeField(default=datetime.now)

    def clean(self):
        if not self.password and not self.google and not self.facebook:
            raise ValidationError("Password field is required.")
