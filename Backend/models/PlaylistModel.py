import json
from datetime import datetime
from mongoengine import DynamicDocument, DynamicEmbeddedDocument, EmbeddedDocumentListField, \
    StringField, DateTimeField, LongField, URLField, IntField, LazyReferenceField, ValidationError, CASCADE


class PlaylistTrack(DynamicEmbeddedDocument):
    id = StringField()
    name = StringField(required=True)
    type = StringField(required=True, choices=["local", "library"])
    path = URLField()
    language = StringField()
    artists = StringField()
    # TODO: Fill in choices with only supported languages here

    def clean(self):
        if self.type == "library" and not self.id:
            raise ValidationError("Track ID is required for type:library tracks.")
            # TODO: Verify Track ID


class Playlist(DynamicDocument):
    meta = {'collection': 'playlists'}
    name = StringField(required=True, min_length=1)
    type = StringField(required=True, default="playlist")
    scope = StringField(default="private", choices=["public", "private", "system"])
    owner = LazyReferenceField('User')
    tracks = EmbeddedDocumentListField(PlaylistTrack)
    totalTracks = IntField(default=0, min_value=0)
    imageUrl = URLField()
    addedByCount = LongField(default=1, min_value=0)
    createdAt = DateTimeField(default=datetime.now)

    def clean(self):
        if self.scope != "system" and not self.owner:
            raise ValidationError("Owner is required for user created playlists.")

        # TODO: Verify unique Track ID

    def to_json(self):
        obj = json.loads(super(Playlist, self).to_json())
        obj["_id"] = str(self.pk)
        obj["owner"] = str(self.owner.pk)
        return obj
