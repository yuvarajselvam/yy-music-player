from py2neo import Node, Relationship

from models.BaseModel import Entity, require_node

from utils import validation
from utils.enums import DeviceOs
from utils.extensions import neo4j


graph = neo4j.get_db()


class Device(Entity):
    _resource_prefix = 'DVC'
    _required_fields = ["token", "uniqueId"]
    _name = \
        _token = \
        _uniqueId = \
        _osName = \
        _osVersion = \
        _appVersion = \
        _deviceType = \
        _model = None

    # Create/Delete Relationships

    @require_node
    def link_user(self, user_node):
        device_user = Relationship(self._node, "USED_BY", user_node)
        graph.create(device_user)

    # Properties

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
        return self._osName.value if self._osName else None

    @osName.setter
    def osName(self, value):
        self._osName = DeviceOs(value.upper())

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

