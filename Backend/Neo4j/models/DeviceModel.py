from py2neo import Relationship, RelationshipMatcher

from models.BaseModel import Entity, require_node
from models.TrackModel import Track

from utils import validation
from utils.enums import DeviceOs
from utils.exceptions import AppLogicError
from utils.extensions import neo4j
from utils.querying import get_related_nodes, get_relationships

graph = neo4j.get_db()


class Device(Entity):
    _resource_prefix = 'DVC'
    _required_fields = ["token", "uniqueId"]
    _name = \
        _isSynced = \
        _token = \
        _uniqueId = \
        _osName = \
        _osVersion = \
        _appVersion = \
        _deviceType = \
        _playlistCreated = \
        _playlistUpdated = \
        _playlistDeleted = \
        _playlistTrackCreated = \
        _playlistTrackDeleted = \
        _model = None

    # Create/Delete Relationships

    @require_node
    def link_user(self, user_node):
        device_user = Relationship(self._node, "USED_BY", user_node)
        graph.create(device_user)

    @require_node
    def get_track_link_count(self, track_node, tx=graph):
        relationships = get_relationships((track_node, self._node))
        if bool({"DOWNLOADED_IN"} & relationships):
            return -1
        query = f'''
                MATCH (t:Track)-[:ADDED_TO]->(p:Playlist)-[:OWNED_BY|SHARED_WITH]->(u:User)<-[:USED_BY]-(d:Device)
                WHERE d.id = '{self.id}' AND t.id = '{track_node["id"]}'
                RETURN p
                '''
        cursor = tx.run(query)
        return len(cursor.data())

    @require_node
    def download_track(self, track_node):
        relationships = get_relationships((track_node, self._node))
        if bool({"DOWNLOADED_IN"} & relationships):
            raise AppLogicError("Track has already been downloaded in this device.")
        track_device = Relationship(track_node, "DOWNLOADED_IN", self._node)
        graph.create(track_device)

    @require_node
    def get_downloaded_tracks(self):
        tracks = get_related_nodes((None, self._node), 'DOWNLOADED_IN')
        tracks_with_album = []
        for track in tracks:
            track["album"] = Track.find_one(id=track["id"]).album
            tracks_with_album.append(track)
        return tracks_with_album

    @require_node
    def remove_track(self, track_node):
        rel_match = RelationshipMatcher(graph)
        rel = rel_match.match((track_node, self._node), r_type='DOWNLOADED_IN')
        if not rel.exists():
            raise AppLogicError("Track is not downloaded in the device.")
        graph.separate(rel.first())

    @require_node
    def clear_change_log(self):
        self.playlistCreated = []
        self.playlistUpdated = []
        self.playlistDeleted = []
        self.playlistTrackCreated = []
        self.playlistTrackDeleted = []
        self.isSynced = True
        self.save()

    def get_initial_sync_data(self):
        query = f'''MATCH (p:Playlist)-[:OWNED_BY|SHARED_WITH]->(u:User)<-[:USED_BY]-(d:Device)
                    WHERE d.id = '{self.id}'
                    OPTIONAL MATCH (a:Album)<-[:BELONGS_TO]-(t:Track)-[:ADDED_TO]->(p)
                    OPTIONAL MATCH (p)-[:OWNED_BY]->(o)
                    WITH {{created: COLLECT({{id: p.id, name: p.name, type: p.type, scope: p.scope, owner: o.id}}),
                           updated: [], deleted: [] }} as playlists, 
                         {{created: COLLECT({{id: p.id + '__' + t.id, playlistId: p.id, trackId: t.id}}),
                           updated: [], deleted: [] }} as playlistsTracks,
                         {{created: COLLECT({{id: t.id, name: t.name, artists: t.artists, imageUrl: t.imageUrl, 
                                        albumId: a.id}}),
                           updated: [], deleted: [] }} as tracks, 
                         {{created: COLLECT({{id: a.id, name: a.name, artists: a.artists, imageUrl: a.imageUrl, 
                                        totalTracks: a.totalTracks, releaseYear: a.releaseYear }}),
                           updated: [], deleted: [] }} as albums
                    RETURN playlists, tracks, playlistsTracks, albums'''
        return graph.run(query).data()[0]

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
    def isSynced(self):
        return self._isSynced

    @isSynced.setter
    def isSynced(self, value):
        validation.check_instance_type('is synced', value, bool)
        self._isSynced = value

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

    @property
    def playlistCreated(self):
        return self._playlistCreated if self._playlistCreated else []

    @playlistCreated.setter
    def playlistCreated(self, value):
        self._playlistCreated = value

    @property
    def playlistUpdated(self):
        return self._playlistUpdated if self._playlistUpdated else []

    @playlistUpdated.setter
    def playlistUpdated(self, value):
        self._playlistUpdated = value

    @property
    def playlistDeleted(self):
        return self._playlistDeleted if self._playlistDeleted else []

    @playlistDeleted.setter
    def playlistDeleted(self, value):
        self._playlistDeleted = value

    @property
    def playlistTrackCreated(self):
        return self._playlistTrackCreated if self._playlistTrackCreated else []

    @playlistTrackCreated.setter
    def playlistTrackCreated(self, value):
        self._playlistTrackCreated = value

    @property
    def playlistTrackDeleted(self):
        return self._playlistTrackDeleted if self._playlistTrackDeleted else []

    @playlistTrackDeleted.setter
    def playlistTrackDeleted(self, value):
        self._playlistTrackDeleted = value
