from collections import Sequence

from py2neo import RelationshipMatcher

from utils.extensions import neo4j

graph = neo4j.get_db()


def get_relationships(nodes):
    if isinstance(nodes, Sequence):
        if len(nodes) == 2:
            query = "MATCH (a {id: $x.id})-[r]->(b {id: $y.id}) RETURN type(r) as type;"
        elif nodes[0] is None:
            query = "MATCH (a)-[r]->(b {id: $y.id}) RETURN type(r) as type;"
        else:
            query = "MATCH (a {id: $x.id})-[r]->(b) RETURN type(r) as type;"
        cursor = graph.run(query, x=nodes[0], y=nodes[1])
        return set([relationship["type"] for relationship in cursor])
    else:
        raise ValueError("Nodes must be supplied as a Sequence")


def get_related_nodes(nodes, rel_type, **kwargs):
    relationship_matcher = RelationshipMatcher(graph)
    matches = relationship_matcher.match(nodes, r_type=rel_type, **kwargs)
    return [dict(match.start_node) for match in matches] if nodes[0] is None \
        else [dict(match.end_node) for match in matches]
