import uuid
import inspect
import neotime
import datetime

from py2neo import Node, Relationship

from utils import validation
from utils.extensions import neo4j


graph = neo4j.get_db()


class Device:
    _resource_prefix = 'DVC'
    _required_fields = ["token", "uniqueId"]
    _id = \
        _name = \
        _token = \
        _uniqueId = \
        _osName = \
        _osVersion = \
        _appVersion = \
        _deviceType = \
        _model = \
        _updatedAt = \
        _createdAt = \
        _node = None

    _allowed_osVersions = {"ANDROID", "IOS"}

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
            device = Node('Device', **self.json())
            graph.create(device)
            self._node = device
        else:
            device = Node('Device', **self.json())
            self._updatedAt = neotime.DateTime.from_native(datetime.datetime.now())
            graph.merge(device, "Device", "id")
            self._node = device

    @classmethod
    def find_one(cls, **kwargs):
        device = graph.nodes.match('Device', **kwargs).first()
        return cls(dict(device), _node=device)

    # Create/Delete Relationships

    def link_user(self, user_node):
        if self._node:
            device_user = Relationship(self._node, "USED_BY", user_node)
            graph.create(device_user)
        else:
            raise Exception("Device node does not exist.")

    def delete(self):
        if self._node:
            graph.delete(self._node)
        else:
            raise Exception("Device does not exist")

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
    def token(self):
        return self._token

    @token.setter
    def token(self, value):
        validation.check_instance_type("Token", value, str)
        self._token = value

    @property
    def uniqueId(self):
        return self._uniqueId

    @uniqueId.setter
    def uniqueId(self, value):
        validation.check_instance_type("Unique Id", value, str)
        self._uniqueId = value

    @property
    def model(self):
        return self._model

    @model.setter
    def model(self, value):
        validation.check_instance_type("Model", value, str)
        self._model = value

    @property
    def osName(self):
        return self._osName

    @osName.setter
    def osName(self, value):
        field = "OS Name"
        validation.check_instance_type(field, value, str)
        validation.check_choices(field, value, self._allowed_osVersions)
        self._osName = value.upper()

    @property
    def osVersion(self):
        return self._osVersion

    @osVersion.setter
    def osVersion(self, value):
        validation.check_instance_type("OS Version", value, str)
        self._osVersion = value

    @property
    def appVersion(self):
        return self._appVersion

    @appVersion.setter
    def appVersion(self, value):
        validation.check_instance_type("App Version", value, str)
        self._appVersion = value

    @property
    def deviceType(self):
        return self._deviceType

    @deviceType.setter
    def deviceType(self, value):
        validation.check_instance_type("Device Type", value, str)
        self._deviceType = value

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
