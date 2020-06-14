from models.BaseModel import EntityBase

from utils.querying import get_related_nodes
from utils.selenium import BrowserService


class Track(EntityBase):
    _name = \
        _artists = \
        _imageUrl = \
        _saavnUrl = None

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
    def saavnUrl(self):
        return self._saavnUrl

    @saavnUrl.setter
    def saavnUrl(self, value):
        self._saavnUrl = value

    @property
    def album(self):
        return get_related_nodes((self._node, None), 'BELONGS_TO')[0]

    @property
    def trackUrl(self):
        return BrowserService.get_track_url(self.saavnUrl)

