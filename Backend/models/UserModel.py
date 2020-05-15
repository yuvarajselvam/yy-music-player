import re
import json
from datetime import datetime
from mongoengine import StringField, DateTimeField, EmailField, DynamicDocument, DynamicEmbeddedDocument, \
    EmbeddedDocumentField, URLField, ValidationError, ListField, LazyReferenceField, PULL, DateField, BooleanField


class Google(DynamicEmbeddedDocument):
    userId = StringField(required=True)
    accessToken = StringField()
    idToken = StringField(required=True)
    photoUrl = URLField()


class Facebook(DynamicEmbeddedDocument):
    userId = StringField(required=True)
    accessToken = StringField()


class Preferences(DynamicEmbeddedDocument):
    genre = ListField(StringField())
    languages = ListField(StringField(choices=["TAMIL", "TELUGU"]))


class PendingRequest(DynamicEmbeddedDocument):
    userId = LazyReferenceField('User', required=True)
    isRequester = BooleanField(required=True)


class User(DynamicDocument):
    meta = {'collection': 'users'}
    fullName = StringField(required=True)
    # username = StringField(required=True, regex=re.compile("^[a-zA-Z0-9_]+$"), unique=True)
    email = EmailField(required=True, unique=True)
    dob = DateField()
    phone = StringField(min_length=10, max_length=10, regex=re.compile('[0-9]{10}'))
    password = StringField(min_length=6)
    google = EmbeddedDocumentField(Google)
    facebook = EmbeddedDocumentField(Facebook)
    preferences = EmbeddedDocumentField(Preferences)
    followers = ListField(LazyReferenceField('self', reverse_delete_rule=PULL))
    following = ListField(LazyReferenceField('self', reverse_delete_rule=PULL))
    pendingRequests = ListField(EmbeddedDocumentField(PendingRequest))
    playlists = ListField(LazyReferenceField('Playlist'))
    deviceTokens = ListField(StringField())
    createdAt = DateTimeField(default=datetime.now)

    def clean(self):
        if not self.password and not self.google and not self.facebook:
            raise ValidationError("Password field is required.")

    def to_json(self):
        obj = json.loads(super(User, self).to_json())
        obj["_id"] = str(self.pk)
        if "playlists" in obj:
            obj["playlists"] = [str(x) for x in obj["playlists"]]
        if "followers" in obj:
            obj["followers"] = [str(x) for x in obj["followers"]]
        if "following" in obj:
            obj["following"] = [str(x) for x in obj["following"]]
        return obj
