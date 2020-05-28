import uuid
import inspect
import neotime
import datetime

from py2neo import Node, Relationship, RelationshipMatcher

from utils.extensions import neo4j
from utils import validation
from utils.querying import get_relationships, get_related_nodes


graph = neo4j.get_db()


class Playlist:
    _resource_prefix = 'PLY'
    _required_fields = ["name", "scope"]
    _id = \
        _name = \
        _scope = \
        _updatedAt = \
        _createdAt = \
        _node = None

    _allowed_scopes = {"PUBLIC", "PRIVATE", "SYSTEM"}

    def __init__(self, *args, **kwargs):
        [setattr(self, k, v) for arg in args for k, v in arg.items() if hasattr(self, k)]
        [setattr(self, k, v) for k, v in kwargs.items() if hasattr(self, k)]

    def json(self):
        attributes = inspect.getmembers(self, lambda a: not (inspect.isroutine(a)))
        return dict([(a, v) for a, v in attributes if not (a.startswith('_')) and v])

    def validate(self):
        for field in self._required_fields:
            if getattr(self, field) is None:
                raise KeyError(f"{field.title()} is mandatory.")

    def save(self, validate=True):
        if validate:
            self.validate()
        if not self.id:
            self.id = uuid.uuid4().hex
            self._createdAt = neotime.DateTime.from_native(datetime.datetime.now())
            self._updatedAt = neotime.DateTime.from_native(datetime.datetime.now())
            playlist = Node('Playlist', **self.json())
            graph.create(playlist)
            self._node = playlist
        else:
            playlist = Node('Playlist', **self.json())
            self._updatedAt = neotime.DateTime.from_native(datetime.datetime.now())
            graph.merge(playlist, "Playlist", "id")
            self._node = playlist

    @classmethod
    def find_one(cls, **kwargs):
        playlist = graph.nodes.match('Playlist', **kwargs).first()
        return cls(dict(playlist), _node=playlist)

    # Create/Delete Relationships

    def link_owner(self, owner_node):
        if self._node and owner_node:
            playlist_owner = Relationship(self._node, "OWNED_BY", owner_node)
            graph.create(playlist_owner)
        else:
            raise Exception("Playlist/Owner node does not exist.")

    def check_visibility(self, user_node):
        if self._node and user_node:
            relationships = get_relationships((self._node, user_node))
            return "OWNED_BY" in relationships
        else:
            raise Exception("Playlist/User node does not exist.")

    def add_track(self, track_node):
        if self._node and track_node:
            if "ADDED_TO" not in get_relationships((track_node, self._node)):
                track_playlist = Relationship(track_node, "ADDED_TO", self._node)
                graph.create(track_playlist)
        else:
            raise Exception("Playlist/Track node does not exist.")

    def remove_track(self, track_node):
        if self._node and track_node:
            rel_match = RelationshipMatcher(graph)
            rel = rel_match.match((track_node, self._node), r_type='ADDED_TO')
            if rel.exists():
                graph.separate(rel.first())
        else:
            raise Exception("Playlist/Track node does not exist.")

    def delete(self):
        if self._node:
            graph.delete(self._node)
        else:
            raise Exception("Playlist does not exist.")

    def get_node(self):
        return self._node

    def set_node(self, node):
        self._node = node

    # Properties

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        validation.check_instance_type("id", value, str)
        self._id = self._resource_prefix + value if not value.startswith(self._resource_prefix) else value

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        field = "name"
        validation.check_instance_type(field, value, str)
        validation.check_min_length(field, value, 1)
        self._name = value

    @property
    def scope(self):
        return self._scope

    @scope.setter
    def scope(self, value):
        validation.check_choices("scope", value, self._allowed_scopes)
        self._scope = value.upper()

    @property
    def tracks(self):
        return get_related_nodes((None, self._node), 'ADDED_TO')

    @property
    def createdAt(self):
        return str(self._createdAt).split('.')[0] if self._createdAt else None

    @createdAt.setter
    def createdAt(self, value):
        self._createdAt = value

    @property
    def updatedAt(self):
        return str(self._updatedAt).split('.')[0] if self._updatedAt else None

    @updatedAt.setter
    def updatedAt(self, value):
        self._updatedAt = value
