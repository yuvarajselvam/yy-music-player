from firebase_admin import initialize_app, credentials as cred, messaging
from utils.secrets import Secrets
from utils.logging import Logger


logger = Logger("notification").logger


class NotificationUtil:
    firebase_app = None

    @classmethod
    def init_firebase(cls):
        cls.firebase_app = initialize_app(credential=cred.Certificate(Secrets.FIREBASE_CREDENTIAL_CERTIFICATE_PATH))

    @staticmethod
    def send(token, data, notification=None):
        notification_obj = messaging.Notification(title=notification["title"], body=notification["body"]) if notification else None
        message = messaging.Message(data=data, notification=notification_obj, token=token)
        response = messaging.send(message)
        logger.debug(f"send method response: {response}")
