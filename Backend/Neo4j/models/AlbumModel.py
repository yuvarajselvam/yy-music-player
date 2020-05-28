import inspect

from py2neo import Node

from utils.extensions import neo4j
from utils.querying import get_related_nodes

graph = neo4j.get_db()


class Album:
    _id = \
        _name = \
        _artists = \
        _imageUrl = \
        _totalTracks = \
        _node = None

    def __init__(self, *args, **kwargs):
        [setattr(self, k, v) for arg in args for k, v in arg.items() if hasattr(self, k)]
        [setattr(self, k, v) for k, v in kwargs.items() if hasattr(self, k)]

    def json(self):
        attributes = inspect.getmembers(self, lambda a: not (inspect.isroutine(a)))
        return dict([(a, v) for a, v in attributes if not (a.startswith('_')) and v])

    @classmethod
    def find_one(cls, **kwargs):
        album = graph.nodes.match('Album', **kwargs).first()
        return cls(dict(album), _node=album)

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
    def totalTracks(self):
        return self._totalTracks

    @totalTracks.setter
    def totalTracks(self, value):
        self._totalTracks = value

    @property
    def tracks(self):
        return get_related_nodes((None, self._node), 'BELONGS_TO')
