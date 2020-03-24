from google.cloud import secretmanager

# client = secretmanager.SecretManagerServiceClient.from_service_account_file("resources/service_credentials.json")


# def get_secret(secret_name):
#     return client.access_secret_version(f"projects/156841541425/secrets/{secret_name}/versions/1") \
#         .payload \
#         .data \
#         .decode('UTF-8')


class Secrets:
    print("Fetching secrets...", end=" ")
    # JWT_SECRET_KEY = get_secret("jwt_secret_key")
    # OAUTH_CLIENT_CONFIG = get_secret("oauth_client_config")
    # IOS_CLIENT_ID = get_secret("ios_client_id")
    # ANDROID_CLIENT_ID = get_secret("android_client_id")
    # DB_HOST_NAME = get_secret("db_host_name")
    JWT_SECRET_KEY = "Musiqplayer@123"
    IOS_CLIENT_ID = "156841541425-5iehdba23m6iejp3bbi40b5d2dfr7emn.apps.googleusercontent.com"
    ANDROID_CLIENT_ID = "156841541425-i10f8nvlbrotbh13gl0jfk997j342d52.apps.googleusercontent.com"
    DB_HOST_NAME = "mongodb+srv://yympserver:Musiqplayer%40123@yy-music-player-dev-fygew.mongodb.net" \
                   "/YY-MP-DB?retryWrites=true&w=majority"
    OAUTH_CLIENT_CONFIG = '''{"installed":{
        "client_id":"156841541425-bgdm6k995b8ksrj52mkiopr7ucsfgv4a.apps.googleusercontent.com",
        "project_id":"yy-music-player","auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret":"Vy-DZNtmZ4p_QoU7qMmBPSvr","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}'''
    print("Done!")
