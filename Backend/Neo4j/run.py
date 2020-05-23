import os
import logging

from flask import Flask

from utils.extensions import neo4j
from utils.logging import Logger
from utils.extensions import api
from api.auth.request_auth import authorize_request


logger = Logger("run").logger

app = Flask(__name__)
app.logger.setLevel(logging.ERROR)
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app.register_blueprint(authorize_request)
neo4j.init_app(app)
api.init_app(app)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
