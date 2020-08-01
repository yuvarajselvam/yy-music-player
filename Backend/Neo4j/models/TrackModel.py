from models.BaseModel import EntityBase

from utils.querying import get_related_nodes
from utils.selenium import BrowserService


class Track(EntityBase):
    _name = \
        _imageUrl = \
        _language = \
        _playCount = \
        _duration = \
        _releaseDate = \
        _lyrics = \
        _encryptedUrl = None

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
    def playCount(self):
        return self._playCount

    @playCount.setter
    def playCount(self, value):
        self._playCount = value

    @property
    def duration(self):
        return self._duration

    @duration.setter
    def duration(self, value):
        self._duration = value

    @property
    def releaseDate(self):
        return self._releaseDate

    @releaseDate.setter
    def releaseDate(self, value):
        self._releaseDate = value

    @property
    def lyrics(self):
        return self._lyrics

    @lyrics.setter
    def lyrics(self, value):
        self._lyrics = value

    @property
    def encryptedUrl(self):
        return self._encryptedUrl

    @encryptedUrl.setter
    def encryptedUrl(self, value):
        self._encryptedUrl = value

    @property
    def album(self):
        return get_related_nodes((self._node, None), 'BELONGS_TO')[0]

    @property
    def artists(self):
        return ', '.join([artist['name'] for artist in get_related_nodes((None, self._node), 'SINGER')])

    @property
    def trackUrl(self):
        return BrowserService.get_track_url(self.encryptedUrl)

