from flask import Blueprint, request, jsonify, request, make_response
from server.defaults.core.dashboard.periodic_update.periodicUpdate import PeriodicUpdate
from server.defaults.utils.database.datapuller import DataPuller
from server.defaults.core.dashboard.defaultQueries import active_location_query
import json
import os

allowed_domain = os.environ["testing"]


pu = PeriodicUpdate()
periodic_update = Blueprint('periodic', __name__)
dp = DataPuller()


@periodic_update.route('/periodic_update', methods=['POST', 'OPTIONS'])
def updater():

    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    pu.projectid = request.json['projectID']
    pu.location = request.json['locationID']

    response = pu.update().to_json(orient='records')

    return response


@periodic_update.route('/active/locations', methods=['GET'])
def active_locations():
    response = pu.active_locations()
    # print(response)
    # print(response.to_string())
    response.set_index('LongName', inplace=True)
    response = response.to_dict()['LocationID']
    # print(json.dumps(response.to_dict()['LocationID'],indent=4))
    # print(json.dumps(json.loads(response.to_json()), indent=4))
    print(response)
    return response#.to_dict('records')


@periodic_update.route('/active/projects', methods=['GET'])
def active_projects():
    response = pu.active_projectIDs()
    return response.to_json()


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', allowed_domain)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
