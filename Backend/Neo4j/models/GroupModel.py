import neotime
import datetime

from py2neo import Relationship, RelationshipMatcher

from models.BaseModel import Entity, require_node

from utils import validation
from utils.enums import Scope
from utils.extensions import neo4j
from utils.exceptions import AppLogicError
from utils.querying import get_relationships, get_related_nodes


graph = neo4j.get_db()


class Group(Entity):
    _resource_prefix = 'GRP'
    _required_fields = ["name", "scope"]
    _deep_fields = ['members', 'playlists']
    _name = \
        _scope = None

    # Create/Delete Relationships

    @require_node
    def link_admin(self, admin_node):
        group_admin = Relationship(self._node, "ADMINED_BY", admin_node)
        graph.create(group_admin)
        self.add_member(admin_node)

    @require_node
    def check_adminship(self, user_node):
        relationships = get_relationships((self._node, user_node))
        return bool({"ADMINED_BY"} & relationships)

    @require_node
    def check_visibility(self, user_node):
        relationships = get_relationships((user_node, self._node))
        return bool({"MEMBER_OF"} & relationships)

    @require_node
    def invite(self, user_node, admin_node):
        relationships = get_relationships((user_node, self._node))
        if bool({"MEMBER_OF", "INVITED_TO"} & relationships):
            raise AppLogicError("User is already a member of/invited to the group.")
        user_group = Relationship(user_node, "INVITED_TO", self._node)
        admin_user = Relationship(admin_node, "HAS_INVITED", user_node, groupName=self.name, groupId=self.id)
        graph.create(user_group)
        graph.create(admin_user)

    @require_node
    def respond_to_group_invite(self, user_node, operation):
        rel_match = RelationshipMatcher(graph)
        rel = rel_match.match((user_node, self._node), r_type='INVITED_TO')
        if not rel.exists():
            raise AppLogicError("User does not have an invitation to the group.")
        if operation.upper() == 'ACCEPT':
            self.add_member(user_node)
        rel = rel.first()
        admin_user = rel_match.match((None, user_node), r_type='HAS_INVITED', groupId=self.id).first()
        graph.separate(rel)
        graph.separate(admin_user)

    @require_node
    def add_member(self, user_node):
        relationships = get_relationships((user_node, self._node))
        if bool({"MEMBER_OF"} & relationships):
            raise AppLogicError("User is already a member of the group.")
        current_time = neotime.DateTime.from_native(datetime.datetime.now())
        user_group = Relationship(user_node, "MEMBER_OF", self._node, since=current_time)
        graph.create(user_group)

    @require_node
    def remove_member(self, user_node):
        rel_match = RelationshipMatcher(graph)
        rel = rel_match.match((user_node, self._node), r_type='MEMBER_OF')
        if not rel.exists():
            raise AppLogicError("User is not a member of the group.")
        graph.separate(rel.first())

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
    def scope(self):
        return self._scope.value if self._scope else None

    @scope.setter
    def scope(self, value):
        self._scope = Scope(value.upper())

    @property
    def members(self):
        return get_related_nodes((None, self._node), 'MEMBER_OF')

    @property
    def playlists(self):
        return get_related_nodes((None, self._node), 'OWNED_BY')

