from py2neo import Relationship, RelationshipMatcher

from models.BaseModel import Entity, require_node
from models.GroupModel import Group

from utils import validation
from utils.extensions import neo4j
from utils.exceptions import AppLogicError
from utils.enums import Scope, PlaylistType
from utils.querying import get_relationships, get_related_nodes


graph = neo4j.get_db()


class Playlist(Entity):
    _resource_prefix = 'PLY'
    _required_fields = ["name", "scope", "type"]
    _deep_fields = ["tracks"]

    _name = \
        _scope = \
        _type = None

    @require_node
    def link_owner(self, owner_node):
        playlist_owner = Relationship(self._node, "OWNED_BY", owner_node)
        graph.create(playlist_owner)

    @require_node
    def get_owner(self):
        owner_id = get_related_nodes((self._node, None), 'OWNED_BY')[0]["id"]
        return Group.find_one(id=owner_id)

    @require_node
    def check_ownership(self, user_node):
        relationships = get_relationships((self._node, user_node))
        return bool({"OWNED_BY"} & relationships)

    @require_node
    def check_visibility(self, user_node):
        if self.type == PlaylistType.USER.value:
            relationships = get_relationships((self._node, user_node))
            return bool({"OWNED_BY", "SHARED_WITH"} & relationships)
        elif self.type == PlaylistType.GROUP.value:
            group = self.get_owner()
            return group.check_visibility(user_node)

    @require_node
    def add_track(self, track_node):
        relationships = get_relationships((track_node, self._node))
        if bool({"ADDED_TO"} & relationships):
            raise AppLogicError("Track is already present in the playlist.")
        track_playlist = Relationship(track_node, "ADDED_TO", self._node)
        graph.create(track_playlist)

    @require_node
    def remove_track(self, track_node):
        rel_match = RelationshipMatcher(graph)
        rel = rel_match.match((track_node, self._node), r_type='ADDED_TO')
        if not rel.exists():
            raise AppLogicError("Track is not present in the playlist.")
        graph.separate(rel.first())

    @require_node
    def share(self, user_node):
        relationships = get_relationships((self._node, user_node))
        # If the user already has access to the playlist, new link is not created
        # Error is not thrown either and the user is notified
        if not bool({"OWNED_BY", "SHARED_WITH"} & relationships):
            playlist_user = Relationship(self._node, "SHARED_WITH", user_node)
            graph.create(playlist_user)

    @require_node
    def get_linked_devices(self):
        query = ''
        if self.type == PlaylistType.USER.value:
            query = f'''
            MATCH (p:Playlist)-[:OWNED_BY|SHARED_WITH]->(u:User)<-[:USED_BY]-(d:Device)
            WHERE p.id = '{self.id}'
            RETURN d
            '''
        return graph.run(query).data()

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
    def type(self):
        return self._type.value if self._type else None

    @type.setter
    def type(self, value):
        self._type = PlaylistType(value.upper())

    @property
    def tracks(self):
        return get_related_nodes((None, self._node), 'ADDED_TO')
