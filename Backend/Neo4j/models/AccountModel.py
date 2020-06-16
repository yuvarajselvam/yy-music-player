import neotime
import requests
import datetime

from py2neo import Relationship
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

from models.BaseModel import Entity, require_node

from utils import validation
from utils.enums import AccountType
from utils.extensions import neo4j


graph = neo4j.get_db()


class Account(Entity):
    _resource_prefix = 'ACC'
    _required_fields = ["externalId", "token", "type"]
    _externalId = \
        _token = \
        _type = \
        _photoUrl = \
        _lastRefreshedAt = None

    def refresh_token(self):
        is_authorized = False

        if self.type == AccountType.GOOGLE.value:
            id_info = id_token.verify_oauth2_token(self.token, grequests.Request())
            is_authorized = id_info['iss'] in ['accounts.google.com', 'https://accounts.google.com']
        elif self.type == AccountType.FACEBOOK.value:
            r = requests.post(f"https://graph.facebook.com/me?fields=id,name,email&access_token={self.token}")
            is_authorized = "email" in r.text

        if is_authorized:
            self.lastRefreshedAt = neotime.DateTime.from_native(datetime.datetime.now())
            self.save()

        return is_authorized

    # Create/Delete Relationships

    @require_node
    def link_user(self, user_node):
        account_user = Relationship(self._node, "LINKED_TO", user_node, accountType=self.type)
        graph.create(account_user)

    # Properties

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
        return self._type.value if self._type else None

    @type.setter
    def type(self, value):
        self._type = AccountType(value.upper())

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

