import re
import jwt
from flask import request, Blueprint

from utils.logging import Logger
from utils.response import make_response
from utils.secrets import Secrets


logger = Logger("request_auth").logger

NO_AUTH_ENDPOINTS = ['signup', 'signin', 'sso', 'forgot-password', 'change-password', 'users']
SWAGGER_DOC_ENDPOINTS = ['docs', 'swaggerui', 'swagger.json']
authorize_request = Blueprint('api', __name__)


@authorize_request.before_app_request
def before_request():
    request_path = request.path.split("/")
    if request_path[1] not in SWAGGER_DOC_ENDPOINTS:
        Logger.log_request(logger, request)
        if request_path and request_path[1] not in NO_AUTH_ENDPOINTS:
            header_name = "Authorization"
            auth_header = request.headers.get(header_name, None)
            if not auth_header:
                return make_response((f"Missing {header_name} Header.", 403))
            auth_token = re.compile(f"Bearer (.*)").search(auth_header)
            if auth_token:
                try:
                    jwt_data = jwt.decode(auth_token.group(1), Secrets.JWT_SECRET_KEY)
                    request.user = jwt_data["userId"]
                except jwt.ExpiredSignatureError:
                    jwt_data = jwt.decode(auth_token.group(1), Secrets.JWT_SECRET_KEY, options={'verify_exp': False})
                    return make_response((f"Token expired for user[{jwt_data['userId']}]", 401))
                except Exception:
                    return make_response((f"Token invalid.", 403))
            else:
                return make_response(("Bad header format.", 403))


@authorize_request.after_app_request
def after_request(response):
    if not request.path.split('/')[1] in SWAGGER_DOC_ENDPOINTS:
        Logger.log_response(logger, response)
    return response
