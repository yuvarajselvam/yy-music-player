from models.BaseModel import EntityBase

from utils.querying import get_related_nodes


class Album(EntityBase):
    _name = \
        _artists = \
        _imageUrl = \
        _totalTracks = None

    # Properties

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        self._name = value

    @property
    def artists(self):
        return self._artists

    @artists.setter
    def artists(self, value):
        self._artists = value

    @property
    def imageUrl(self):
        return self._imageUrl

    @imageUrl.setter
    def imageUrl(self, value):
        self._imageUrl = value

    @property
    def totalTracks(self):
        return self._totalTracks

    @totalTracks.setter
    def totalTracks(self, value):
        self._totalTracks = value

    @property
    def tracks(self):
        return get_related_nodes((None, self._node), 'BELONGS_TO')
