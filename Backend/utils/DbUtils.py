from mongoengine import connect
import urllib
import ssl


class DbUtils:
    PASSWORD = "Musiqplayer@123"
    HOST_NAME = "mongodb+srv://yympserver:" + urllib.parse.quote_plus(
        PASSWORD) + "@yy-music-player-dev-fygew.mongodb.net/YY-MP-DB?retryWrites=true&w=majority"

    def db_connect(self):
        connect('YY-MP-DB', host=self.HOST_NAME, ssl_cert_reqs=ssl.CERT_NONE)
