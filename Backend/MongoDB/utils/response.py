import json
from os import environ as env
from flask import jsonify


def resource_not_found(resource):
    response = jsonify(Error=f"{resource} not found!")
    response.status_code = 404
    if env['verbose']:
        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
    return response


def error_response(message, status_code):
    response = jsonify(Error=message)
    response.status_code = status_code
    if env['verbose']:
        print("Response:", json.dumps(response.get_json(), indent=2, sort_keys=True))
    return response
