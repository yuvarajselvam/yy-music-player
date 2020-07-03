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


def music_search(search_term):
    if search_term.strip():
        fuzzy_term = ' '.join([term + '~' for term in search_term.split(' ') if len(term)])
        query = f'''CALL db.index.fulltext.queryNodes("searchTermIndex", "{fuzzy_term} searchTerm:{search_term}") 
                    YIELD node
                    OPTIONAL MATCH (node)-[:BELONGS_TO]->(a:Album)
                    RETURN node.id as id, node.name as name, node.artists as artists, a as album,
                           node.imageUrl as imageUrl, labels(node)[0] as type, 'tamil' as language                    
                    LIMIT 20'''
        cursor = graph.run(query)
        return cursor.data()
    else:
        return []
