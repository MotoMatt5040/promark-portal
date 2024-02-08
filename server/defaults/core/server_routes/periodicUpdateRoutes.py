from flask import Blueprint, request, make_response

from server.defaults.core.dashboard.periodic_update.periodicUpdate import PeriodicUpdate
from server.defaults.utils.database.datapuller import DataPuller
from .config import allowed_domain

pu = PeriodicUpdate()
periodic_update = Blueprint('periodic', __name__)
dp = DataPuller()


@periodic_update.route('/periodic_update', methods=['POST', 'OPTIONS'])
def updater():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    try:
        pu.projectid = request.json['projectID']
        pu.location = request.json['locationID']
    except KeyError as err:
        raise Exception(
            "Key Error from request json (project or location id) in periodicUpdate.py -> updater() (/periodic_update)"
        )
    response = pu.update().to_json(orient='records')
    return response


@periodic_update.route('/active/locations', methods=['GET'])
def active_locations():
    response = pu.active_locations()
    response.set_index('LongName', inplace=True)
    response = response.to_dict()['LocationID']
    return response


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
