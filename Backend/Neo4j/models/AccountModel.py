import uuid
import inspect
import neotime
import requests
import datetime

from py2neo import Node, Relationship
from google.oauth2 import id_token
from google.auth.transport import requests as grequests


from utils import validation
from utils.extensions import neo4j


graph = neo4j.get_db()


class Account:
    _resource_prefix = 'ACC'
    _required_fields = ["externalId", "token", "type"]
    _id = \
        _externalId = \
        _token = \
        _type = \
        _photoUrl = \
        _lastRefreshedAt = \
        _updatedAt = \
        _createdAt = \
        _node = None

    _allowed_types = {"GOOGLE", "FACEBOOK"}

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
            account = Node('Account', **self.json())
            graph.create(account)
            self._node = account
        else:
            account = Node('Account', **self.json())
            self._updatedAt = neotime.DateTime.from_native(datetime.datetime.now())
            graph.merge(account, "Account", "id")
            self._node = account

    @classmethod
    def find_one(cls, **kwargs):
        account = graph.nodes.match('Account', **kwargs).first()
        return cls(dict(account), _node=account)

    def refresh_token(self):
        if self.type == "GOOGLE":
            id_info = id_token.verify_oauth2_token(self.token, grequests.Request())
            is_authorized = id_info['iss'] in ['accounts.google.com', 'https://accounts.google.com']
        else:
            r = requests.post(f"https://graph.facebook.com/me?fields=id,name,email&access_token={self.token}")
            is_authorized = "email" in r.text

        if is_authorized:
            self.lastRefreshedAt = neotime.DateTime.from_native(datetime.datetime.now())
            self.save()

        return is_authorized

    # Create/Delete Relationships

    def link_user(self, user_node):
        if self._node:
            account_user = Relationship(self._node, "LINKED_TO", user_node, accountType=self.type)
            graph.create(account_user)
        else:
            raise Exception("Account node does not exist.")

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
    def externalId(self):
        return self._externalId

    @externalId.setter
    def externalId(self, value):
        validation.check_instance_type("External Id", value, str)
        self._externalId = value

    @property
    def token(self):
        return self._token

    @token.setter
    def token(self, value):
        validation.check_instance_type("Token", value, str)
        self._token = value

    @property
    def type(self):
        return self._type

    @type.setter
    def type(self, value):
        validation.check_choices("type", value, self._allowed_types)
        self._type = value.upper()

    @property
    def photoUrl(self):
        return self._photoUrl

    @photoUrl.setter
    def photoUrl(self, value):
        field = "Photo url"
        validation.check_instance_type(field, value, str)
        validation.check_regex_match(field, value, validation.URL_REGEX)

    @property
    def lastRefreshedAt(self):
        return str(self._lastRefreshedAt).split('.')[0] if self._lastRefreshedAt else None

    @lastRefreshedAt.setter
    def lastRefreshedAt(self, value):
        self._lastRefreshedAt = value

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
