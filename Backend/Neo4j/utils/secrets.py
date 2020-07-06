class Secrets:
    JWT_SECRET_KEY = "Musiqplayer@123"
    OAUTH_CLIENT_CONFIG = '''{"installed":{
            "client_id":"156841541425-bgdm6k995b8ksrj52mkiopr7ucsfgv4a.apps.googleusercontent.com",
            "project_id":"yy-music-player","auth_uri":"https://accounts.google.com/o/oauth2/auth",
            "token_uri":"https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
            "client_secret":"Vy-DZNtmZ4p_QoU7qMmBPSvr",
            "redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}'''
    NEO4J_URL = "neo4j://localhost:7687"
    NEO4J_AUTH = ("neo4j", "Musiqplayer@123")
    FIREBASE_CREDENTIAL_CERTIFICATE_PATH = "resources/service_credentials.json"