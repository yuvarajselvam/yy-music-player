import uuid
import inspect
import neotime
import datetime

from py2neo import Node

from utils import validation
from utils.extensions import neo4j
from utils.exceptions import NodeDoesNotExistError

graph = neo4j.get_db()


def require_node(func):
    def wrapper(self, *args, **kwargs):
        if not self._node:
            raise NodeDoesNotExistError(func.__name__ + ' >> ' + self._entity)
        return func(self, *args, **kwargs)

    return wrapper


class EntityBase:
    _entity = ''
    _deep_fields = []

    _id = \
        _node = None

    def __init__(self, *args, **kwargs):
        self._entity = self.__class__.__name__
        [setattr(self, k, v) for arg in args for k, v in arg.items() if hasattr(self, k)]
        [setattr(self, k, v) for k, v in kwargs.items() if hasattr(self, k)]

    def json(self, deep=True):
        attributes = inspect.getmembers(self, lambda a: not (inspect.isroutine(a)))
        if deep:
            return dict([(a, v) for a, v in attributes if not (a.startswith('_')) and v])
        else:
            return dict([(a, v) for a, v in attributes
                         if not (a.startswith('_')) and a not in self._deep_fields and v])

    @classmethod
    def find_one(cls, **kwargs):
        entity = cls.__name__
        entity_node = graph.nodes.match(entity, **kwargs).first()
        if not entity_node:
            return
        return cls(dict(entity_node), _node=entity_node)

    @require_node
    def get_node(self):
        return self._node

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        self._id = value


class Entity(EntityBase):
    _resource_prefix = ''
    _required_fields = []

    _updatedAt = \
        _createdAt = None

    def validate(self):
        for field in self._required_fields:
            if getattr(self, field) is None:
                raise KeyError(f"{field.title()} is mandatory.")

    def save(self, validate=True, tx=None):
        if validate:
            self.validate()
        if not self.id:
            self.id = uuid.uuid4().hex
        if not self.createdAt:
            self._createdAt = neotime.DateTime.from_native(datetime.datetime.now())
        self._updatedAt = neotime.DateTime.from_native(datetime.datetime.now())
        entity_node = Node(self._entity, **self.json(deep=False))
        if not tx:
            graph.merge(entity_node, self._entity, "id")
        else:
            tx.merge(entity_node, self._entity, "id")
        self._node = entity_node

    @require_node
    def delete(self):
        graph.delete(self._node)

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
