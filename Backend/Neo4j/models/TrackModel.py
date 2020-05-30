import inspect

from utils.extensions import neo4j
from utils.querying import get_related_nodes
from utils.selenium import BrowserService


graph = neo4j.get_db()


class Track:
    _id = \
        _name = \
        _artists = \
        _imageUrl = \
        _saavnUrl = \
        _node = None

    def __init__(self, *args, **kwargs):
        [setattr(self, k, v) for arg in args for k, v in arg.items() if hasattr(self, k)]
        [setattr(self, k, v) for k, v in kwargs.items() if hasattr(self, k)]

    def json(self):
        attributes = inspect.getmembers(self, lambda a: not (inspect.isroutine(a)))
        return dict([(a, v) for a, v in attributes if not (a.startswith('_')) and v])

    @classmethod
    def find_one(cls, **kwargs):
        track = graph.nodes.match('Track', **kwargs).first()
        return cls(dict(track), _node=track)

    def get_node(self):
        return self._node

    # Properties

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        self._id = value

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

