import uuid
import inspect
import neotime
import datetime

from py2neo import Node, Relationship, RelationshipMatcher, DatabaseError

from utils.extensions import neo4j
from utils import validation
from utils.querying import get_relationships, get_related_nodes


graph = neo4j.get_db()


class Group:
    _resource_prefix = 'GRP'
    _required_fields = ["name", "scope"]
    _id = \
        _name = \
        _scope = \
        _updatedAt = \
        _createdAt = \
        _node = None

    _allowed_scopes = {"PUBLIC", "PRIVATE"}

    def __init__(self, *args, **kwargs):
        [setattr(self, k, v) for arg in args for k, v in arg.items() if hasattr(self, k)]
        [setattr(self, k, v) for k, v in kwargs.items() if hasattr(self, k)]

    def json(self, deep=True):
        attributes = inspect.getmembers(self, lambda a: not (inspect.isroutine(a)))
        if deep:
            return dict([(a, v) for a, v in attributes if not (a.startswith('_')) and v])
        else:
            return dict([(a, v) for a, v in attributes if not (a.startswith('_')) and a not in ['members'] and v])

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
            group = Node('Group', **self.json(deep=False))
            graph.create(group)
            self._node = group
        else:
            group = Node('Group', **self.json(deep=False))
            self._updatedAt = neotime.DateTime.from_native(datetime.datetime.now())
            graph.merge(group, "Group", "id")
            self._node = group

    @classmethod
    def find_one(cls, **kwargs):
        group = graph.nodes.match('Group', **kwargs).first()
        return cls(dict(group), _node=group)

    # Create/Delete Relationships

    def link_admin(self, admin_node):
        if self._node and admin_node:
            group_admin = Relationship(self._node, "ADMINED_BY", admin_node)
            graph.create(group_admin)
            self.add_member(admin_node)
        else:
            raise Exception("Group/Admin node does not exist.")

    def check_adminship(self, user_node):
        if self._node and user_node:
            relationships = get_relationships((self._node, user_node))
            return bool({"ADMINED_BY"} & relationships)
        else:
            raise Exception("Group/User node does not exist.")

    def check_visibility(self, user_node):
        if self._node and user_node:
            relationships = get_relationships((user_node, self._node))
            return bool({"MEMBER_OF"} & relationships)
        else:
            raise Exception("Group/User node does not exist.")

    def invite(self, user_node):
        if self._node and user_node:
            relationships = get_relationships((user_node, self._node))
            if bool({"MEMBER_OF"} & relationships):
                raise DatabaseError("User is already a member.")
            user_group = Relationship(user_node, "INVITED_TO", self._node)
            graph.create(user_group)
        else:
            raise DatabaseError("Group/User node does not exist.")

    def respond_to_group_invite(self, user_node, operation):
        if self._node and user_node:
            rel_match = RelationshipMatcher(graph)
            rel = rel_match.match((user_node, self._node), r_type='INVITED_TO')
            if rel.exists() and (operation.upper() == 'ACCEPT'):
                rel = rel.first()
                graph.separate(rel)
                self.add_member(user_node)
            else:
                raise DatabaseError("User has not been invited to the group.")
        else:
            raise DatabaseError("Group/User node does not exist.")

    def add_member(self, user_node):
        if self._node and user_node:
            if "MEMBER_OF" not in get_relationships((user_node, self._node)):
                current_time = neotime.DateTime.from_native(datetime.datetime.now())
                user_group = Relationship(user_node, "MEMBER_OF", self._node, since=current_time)
                graph.create(user_group)
        else:
            raise Exception("Group/User node does not exist.")

    def remove_member(self, user_node):
        if self._node and user_node:
            rel_match = RelationshipMatcher(graph)
            rel = rel_match.match((user_node, self._node), r_type='MEMBER_OF')
            if rel.exists():
                graph.separate(rel.first())
        else:
            raise Exception("Group/User node does not exist.")

    def delete(self):
        if self._node:
            graph.delete(self._node)
        else:
            raise Exception("Group does not exist.")

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
    def members(self):
        return get_related_nodes((None, self._node), 'MEMBER_OF')

    @property
    def playlists(self):
        return get_related_nodes((None, self._node), 'OWNED_BY')

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
