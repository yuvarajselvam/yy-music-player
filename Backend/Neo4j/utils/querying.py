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


def music_search(search_term, languages):
    if search_term.strip():
        fuzzy_term = ' '.join([term + '~' for term in search_term.split(' ') if len(term)])
        language_term = ' OR '.join([f"'{lang}'" for lang in languages])
        query = f'''CALL db.index.fulltext.queryNodes("searchTermIndex", "{fuzzy_term} searchTerm:{search_term}") 
                    YIELD node, score
                    WITH node, CASE WHEN toLower(node.name) = toLower("{search_term}") THEN score + 10 ELSE score END as s
                    ORDER BY s DESC LIMIT 20
                    OPTIONAL MATCH (node)-[:BELONGS_TO]->(a:Album)
                    OPTIONAL MATCH (node)<-[r]-(art:Artist)
                    WHERE type(r) = 'SINGER' OR type(r) = 'COMPOSED'
                    RETURN node.id as id, node.name as name, a as album,
                           node.imageUrl as imageUrl, labels(node)[0] as type, node.language as language,
                           REDUCE(mergedString = "", item IN COLLECT(art.name) | mergedString + 
                           CASE WHEN mergedString='' THEN '' ELSE ', ' END + item) AS artists
                           '''
        cursor = graph.run(query)
        return cursor.data()
    else:
        return []
