from py2neo import Graph
from utils.secrets import Secrets


class Neo4j:
    def __init__(self):
        self.app = None
        self.graph = None

    def init_app(self, app):
        self.app = app
        self.connect()

    def connect(self):
        self.graph = Graph("neo4j://localhost:7687", auth=Secrets.NEO4J_AUTH)
        return self.graph

    def get_db(self):
        if not self.graph:
            return self.connect()
        return self.graph
