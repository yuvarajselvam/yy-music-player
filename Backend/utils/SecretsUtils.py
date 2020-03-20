from google.cloud import secretmanager

client = secretmanager.SecretManagerServiceClient.from_service_account_file("resources/service_credentials.json")


def get_secret(secret_name):
    return client.access_secret_version(f"projects/156841541425/secrets/{secret_name}/versions/1") \
        .payload \
        .data \
        .decode('UTF-8')


class Secrets:
    JWT_SECRET_KEY = get_secret("jwt_secret_key")
    OAUTH_CLIENT_CONFIG = get_secret("oauth_client_config")
    IOS_CLIENT_ID = get_secret("ios_client_id")
    ANDROID_CLIENT_ID = get_secret("android_client_id")
    DB_HOST_NAME = get_secret("db_host_name")
