from mongoengine import connect, disconnect
import ssl

from utils.secrets import Secrets


class DbUtils:
    host = Secrets.DB_HOST_NAME
    db_alias = None

    def db_connect(self):
        self.db_alias = connect('YY-MP-DB', host=self.host, ssl_cert_reqs=ssl.CERT_NONE)

    def db_disconnect(self):
        disconnect(self.db_alias)