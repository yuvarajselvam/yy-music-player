import jwt
import bcrypt
import random
import neotime
import datetime

from hmac import compare_digest
from py2neo import Relationship
from py2neo.matching import RelationshipMatcher

from models.BaseModel import Entity, require_node

from utils import validation
from utils.secrets import Secrets
from utils.extensions import neo4j
from utils.exceptions import AppLogicError
from utils.querying import get_relationships, get_related_nodes


graph = neo4j.get_db()


class User(Entity):
    _resource_prefix = 'USR'
    _required_fields = ["name", "email"]
    _name = \
        _email = \
        _username = \
        _imageUrl = \
        _dob = \
        _phone = \
        _password = \
        _forgotPasswordToken = \
        _forgotPasswordRetries = None

    @classmethod
    def find_one(cls, **kwargs):
        user = graph.nodes.match('User', **kwargs).first()
        if not user:
            return None
        u = dict(user)
        pw = u.pop("password", None)
        fpw = u.pop("forgotPasswordToken", None)
        return cls(user, _node=user, _password=pw, _forgotPasswordToken=fpw)

    @classmethod
    def get_all_users(cls):
        return [dict(node) for node in graph.nodes.match('User')]

    def verify_password(self, password):
        if not self.password:
            return None
        return bcrypt.checkpw(password.encode(), self.password.encode())

    def generate_forgot_password(self):
        token = str(random.randint(100000, 999999))
        self.forgotPasswordToken = token
        self._forgotPasswordRetries = 3
        self.save()
        return token

    def verify_forgot_password_token(self, value):
        try:
            forgotPasswordToken = jwt.decode(self._forgotPasswordToken, Secrets.JWT_SECRET_KEY)
        except (jwt.ExpiredSignatureError, jwt.DecodeError):
            forgotPasswordToken = None
        if isinstance(forgotPasswordToken, dict) and self.forgotPasswordRetries >= 1:
            is_valid = compare_digest(forgotPasswordToken["token"], value)
            self.forgotPasswordRetries -= 1
            if is_valid:
                self.forgotPasswordToken = "True"
                self.save()
            return is_valid
        del self.forgotPasswordToken
        return False

    def change_password(self, new_password, old_password=None):
        is_verified = False
        if not old_password:
            if self.verify_forgot_password_token("True"):
                is_verified = True
                del self.forgotPasswordToken
        else:
            is_verified = self.verify_password(old_password)

        if is_verified:
            self.password = new_password
            self.save()
        return is_verified

    # Create/Delete Relationships

    @require_node
    def send_follow_request(self, follower_node):
        if self._node == follower_node:
            return
        relationships = get_relationships((follower_node, self._node))
        if bool({"REQUESTED_TO_FOLLOW", "FOLLOWS"} & relationships):
            raise AppLogicError("User already requested to follow/follows.")
        follower_followee = Relationship(follower_node, "REQUESTED_TO_FOLLOW", self._node)
        graph.create(follower_followee)

    @require_node
    def respond_to_follow_request(self, follower_node, operation):
        rel_match = RelationshipMatcher(graph)
        rel = rel_match.match((follower_node, self._node), r_type='REQUESTED_TO_FOLLOW')
        if not rel.exists():
            raise AppLogicError("User does not have a pending request from the follower.")
        if operation.upper() == 'ACCEPT':
            rel = rel.first()
            graph.separate(rel)
            current_time = neotime.DateTime.from_native(datetime.datetime.now())
            graph.create(Relationship(follower_node, 'FOLLOWS', self._node, since=current_time))

    @require_node
    def get_followers(self):
        return get_related_nodes((None, self._node), 'FOLLOWS')

    @require_node
    def get_following(self):
        return get_related_nodes((self._node,), 'FOLLOWS')

    @require_node
    def get_pending_requests(self):
        follow_requests = []
        group_invites = []
        for followee in get_related_nodes((self._node, None), 'REQUESTED_TO_FOLLOW'):
            followee["type"] = "follow"
            followee["isSender"] = True
            follow_requests.append(followee)
        for follower in get_related_nodes((None, self._node), 'REQUESTED_TO_FOLLOW'):
            follower["type"] = "follow"
            follower["isSender"] = False
            follow_requests.append(follower)

        rel_match = RelationshipMatcher(graph)
        invites = rel_match.match((self._node, None), r_type='HAS_INVITED')
        for invite in invites:
            invited_user = invite.end_node
            invite = dict(invite)
            invite["id"] = invited_user["id"]
            invite["name"] = invited_user["name"]
            invite["type"] = "group"
            invite["isSender"] = True
            group_invites.append(invite)
        rel_match = RelationshipMatcher(graph)
        invites = rel_match.match((None, self._node), r_type='HAS_INVITED')
        for invite in invites:
            invitor = invite.start_node
            invite = dict(invite)
            invite["id"] = invitor["id"]
            invite["name"] = invitor["name"]
            invite["type"] = "group"
            invite["isSender"] = False
            group_invites.append(invite)
        return follow_requests + group_invites

    @require_node
    def get_playlists(self):
        return get_related_nodes((None, self._node), 'OWNED_BY')

    @require_node
    def get_shared_playlists(self):
        return get_related_nodes((None, self._node), 'SHARED_WITH')

    @require_node
    def get_groups(self):
        return get_related_nodes((self._node, None), 'MEMBER_OF')

    @require_node
    def get_linked_accounts(self, **kwargs):
        return get_related_nodes((None, self._node), 'LINKED_TO', **kwargs)

    @require_node
    def get_devices(self):
        return get_related_nodes((None, self._node), 'USED_BY')

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
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        field = "email"
        validation.check_instance_type(field, value, str)
        validation.check_regex_match(field, value, validation.EMAIL_REGEX)
        self._email = value

    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, value):
        field = "username"
        validation.check_instance_type(field, value, str)
        validation.check_regex_match(field, value, "^[a-zA-Z0-9_]+$")
        self._username = value

    @property
    def imageUrl(self):
        return self._imageUrl

    @imageUrl.setter
    def imageUrl(self, value):
        validation.check_regex_match("Image URL", value, validation.URL_REGEX)
        self._imageUrl = value

    @property
    def dob(self):
        return self._dob

    @dob.setter
    def dob(self, value):
        field = "dob"
        validation.check_date(field, value)
        self._dob = value

    @property
    def phone(self):
        return self._phone

    @phone.setter
    def phone(self, value):
        field = "phone"
        validation.check_instance_type(field, value, str)
        validation.check_regex_match(field, value, validation.PHONE_REGEX)
        self._phone = value

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        field = "password"
        validation.check_instance_type(field, value, str)
        validation.check_min_length(field, value, 8)
        self._password = bcrypt.hashpw(value.encode(), bcrypt.gensalt()).decode()

    @property
    def forgotPasswordToken(self):
        return self._forgotPasswordToken

    @forgotPasswordToken.setter
    def forgotPasswordToken(self, value):
        payload = {"token": value, "userId": self.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)}
        self._forgotPasswordToken = jwt.encode(payload, Secrets.JWT_SECRET_KEY)

    @forgotPasswordToken.deleter
    def forgotPasswordToken(self):
        self.forgotPasswordRetries = 0
        self._forgotPasswordToken = None

    @property
    def forgotPasswordRetries(self):
        return self._forgotPasswordRetries

    @forgotPasswordRetries.setter
    def forgotPasswordRetries(self, value):
        validation.check_instance_type("forgot password retries", value, int)
        self._forgotPasswordRetries = value
