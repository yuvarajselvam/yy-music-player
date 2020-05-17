import base64
import json
import os
import pickle
from utils.secrets import Secrets
from email.mime.text import MIMEText

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from utils.logging import Logger


logger = Logger("email").logger


class EmailUtil:
    GMAIL_SCOPES = ['https://mail.google.com/']
    CLIENT_CONFIG = json.loads(Secrets.OAUTH_CLIENT_CONFIG)
    service = None
    sender = "yymusicplayer@gmail.com"

    def get_service(self):
        if self.service:
            return self.service
        credentials = None
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                credentials = pickle.load(token)
        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_config(self.CLIENT_CONFIG, self.GMAIL_SCOPES)
                credentials = flow.run_local_server(port=0)
            with open('token.pickle', 'wb') as token:
                pickle.dump(credentials, token)
        return build('gmail', 'v1', credentials=credentials)

    def create_message(self, to, subject, message_text):
        message = MIMEText(message_text)
        message['to'] = to
        message['from'] = self.sender
        message['subject'] = subject
        logger.debug("Email message:", message_text)
        return {'raw': base64.urlsafe_b64encode(message.as_string().encode()).decode()}

    def send_message(self, to_address, subject, message_text):
        try:
            message = self.create_message(to=to_address, subject=subject, message_text=message_text)
            message = (self.get_service().users().send(userId=self.sender, body=message).execute())
            return bool(message)
        except HttpError as error:
            logger.error(error)
            return False
