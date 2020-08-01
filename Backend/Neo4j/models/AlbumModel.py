from models.BaseModel import EntityBase
from models.TrackModel import Track

from utils.querying import get_related_nodes


class Album(EntityBase):
    _name = \
        _imageUrl = \
        _language = \
        _releaseYear = \
        _totalTracks = None

    # Properties

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        self._name = value

    @property
    def imageUrl(self):
        return self._imageUrl

    @imageUrl.setter
    def imageUrl(self, value):
        self._imageUrl = value

    @property
    def language(self):
        return self._language

    @language.setter
    def language(self, value):
        self._language = value

    @property
    def releaseYear(self):
        return self._releaseYear

    @releaseYear.setter
    def releaseYear(self, value):
        self._releaseYear = value

    @property
    def totalTracks(self):
        return self._totalTracks

    @totalTracks.setter
    def totalTracks(self, value):
        self._totalTracks = value

    @property
    def tracks(self):
        track_list = []
        for track in get_related_nodes((None, self._node), 'BELONGS_TO'):
            track["artists"] = Track.find_one(id=track["id"]).artists
            track_list.append(track)
        return track_list

    @property
    def artists(self):
        return ', '.join([artist['name'] for artist in get_related_nodes((None, self._node), 'COMPOSED')])
