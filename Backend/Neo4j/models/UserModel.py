import jwt
import uuid
import bcrypt
import random
import inspect
import neotime
import datetime
from hmac import compare_digest

from py2neo import Node, Relationship
from py2neo.matching import RelationshipMatcher
from py2neo import DatabaseError

from utils import validation
from utils.secrets import Secrets
from utils.extensions import neo4j
from utils.querying import get_relationships, get_related_nodes


graph = neo4j.get_db()


class User:
    _resource_prefix = 'USR'
    _required_fields = ["name", "email"]
    _id = \
        _name = \
        _email = \
        _username = \
        _dob = \
        _phone = \
        _password = \
        _forgotPasswordToken = \
        _forgotPasswordRetries = \
        _createdAt = \
        _updatedAt = \
        _node = None

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
            user = Node('User', **self.json())
            graph.create(user)
            self._node = user
        else:
            user = Node('User', **self.json())
            self._updatedAt = neotime.DateTime.from_native(datetime.datetime.now())
            graph.merge(user, "User", "id")
            self._node = user

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

    def send_follow_request(self, follower):
        follower_node = follower.get_node()
        if self._node and follower_node and not self._node == follower_node:
            relationships = get_relationships((follower_node, self._node))
            if len({"REQUESTED_TO_FOLLOW", "FOLLOWS"} & relationships):
                raise DatabaseError("User already requested to follow/follows")
            follower_followee = Relationship(follower_node, "REQUESTED_TO_FOLLOW", self._node)
            graph.create(follower_followee)
            return True
        else:
            raise DatabaseError("Follower/Followee node does not exist.")

    def respond_to_follow_request(self, follower, operation):
        follower_node = follower.get_node()
        if self._node and follower_node:
            rel_match = RelationshipMatcher(graph)
            rel = rel_match.match((follower_node, self._node), r_type='REQUESTED_TO_FOLLOW')
            if rel.exists() and (operation.upper() == 'ACCEPT'):
                rel = rel.first()
                graph.separate(rel)
                current_time = neotime.DateTime.from_native(datetime.datetime.now())
                graph.create(Relationship(follower_node, 'FOLLOWS', self._node, since=current_time))
        else:
            raise DatabaseError("Follower/Followee node does not exist.")

    def get_followers(self):
        return get_related_nodes((None, self._node), 'FOLLOWS')

    def get_following(self):
        return get_related_nodes((self._node,), 'FOLLOWS')

    def get_pending_requests(self):
        sent = []
        received = []
        for followee in get_related_nodes((self._node, None), 'REQUESTED_TO_FOLLOW'):
            followee["type"] = "sent"
            sent.append(followee)
        for follower in get_related_nodes((None, self._node), 'REQUESTED_TO_FOLLOW'):
            follower["type"] = "received"
            received.append(follower)
        return sent + received

    def get_linked_accounts(self, **kwargs):
        return get_related_nodes((None, self._node), 'LINKED_TO', **kwargs)

    def get_devices(self):
        return get_related_nodes((None, self._node), 'USED_BY')

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
