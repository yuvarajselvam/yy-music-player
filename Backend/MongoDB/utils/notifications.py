from firebase_admin import initialize_app, credentials as cred, messaging
from utils.secrets import Secrets
from utils.logging import Logger


logger = Logger("notification").logger


class NotificationUtil:
    firebase_app = None

    def init_firebase(self):
        self.firebase_app = initialize_app(credential=cred.Certificate(Secrets.FIREBASE_CREDENTIAL_CERTIFICATE_PATH))

    @staticmethod
    def send(token, data, notification=None):
        notification_obj = messaging.Notification(title=notification["title"], body=notification["body"])
        message = messaging.Message(data=data, notification=notification_obj, token=token)
        response = messaging.send(message)
        logger.info(f'Successfully sent notification: {response}')
