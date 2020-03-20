from mongoengine import connect
from urllib import parse
import ssl

from utils.SecretsUtils import Secrets


class DbUtils:
    host = Secrets.DB_HOST_NAME
    def db_connect(self):
        connect('YY-MP-DB', host=self.host, ssl_cert_reqs=ssl.CERT_NONE)
