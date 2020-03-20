import base64
import json
import os
import pickle
from utils.SecretsUtils import Secrets
from email.mime.text import MIMEText

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

GMAIL_SCOPES = ['https://mail.google.com/']
CLIENT_CONFIG = json.loads(Secrets.OAUTH_CLIENT_CONFIG)


credentials = None
if os.path.exists('token.pickle'):
    with open('token.pickle', 'rb') as token:
        credentials = pickle.load(token)
if not credentials or not credentials.valid:
    if credentials and credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_config(
            CLIENT_CONFIG, GMAIL_SCOPES)
        credentials = flow.run_local_server(port=0)
    with open('token.pickle', 'wb') as token:
        pickle.dump(credentials, token)

service = build('gmail', 'v1', credentials=credentials)


def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    print(message)
    return {'raw': base64.urlsafe_b64encode(message.as_string().encode()).decode()}


def send_message(to_address, subject, message_text, from_address="yymusicplayer@gmail.com"):
    try:
        message = create_message(sender=from_address,
                                 to=to_address,
                                 subject=subject,
                                 message_text=message_text
                                 )
        message = (service.users().messages().send(userId=from_address, body=message)
                   .execute())
        return True
    except HttpError as error:
        print(error)
        return False
