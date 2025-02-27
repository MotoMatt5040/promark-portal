import json
import shutil
import os

from flask import Blueprint, request, make_response, send_file, session


from ..quota_management.dataManagement import DataManagement
from .config import allowed_domain
from flask_login import login_required, current_user
if os.environ['environment'] == 'dev':
    from server.defaults.utils.database.datapuller import DataPuller
    from server.defaults.utils.logger_config import logger
else:
    from defaults.utils.database.datapuller import DataPuller
    from defaults.utils.logger_config import logger

quotas = Blueprint('quota_management', __name__)
dp = DataPuller()
dm = DataManagement()


# @quotas.before_request
# @login_required
# def permissions():
#     pass


@quotas.route('/survey_quotas', methods=['POST', 'OPTIONS'])
def survey_quotas():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    for source in ['COM', 'Web', 'LL', 'Cell']:
        dm.source = source
        data = dm.set_data()
    return {}


@quotas.route('/check', methods=['GET'])
def check():
    dm.merge_data()
    return ''


@quotas.route('/merge', methods=['GET'])
def merge():
    return dm.merge_data().to_json()


@quotas.route('/surveyIDs', methods=['POST', 'OPTIONS'])
def surveyIDs():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    voxco_ids = dp.get_voxco_project_database(sid)

    dm.set_sid_for("com", voxco_ids['com'])
    dm.set_sid_for("web", voxco_ids['web'])
    dm.set_sid_for("landline", voxco_ids['ll'])
    dm.set_sid_for("cell", voxco_ids['cell'])

    return voxco_ids


@quotas.route('/survey_name', methods=['POST', 'OPTIONS'])
def survey_name():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    source = request.json['source']
    sid = request.json['surveyID']

    dm.source = source

    print(source)

    match source:
        case "COM":
            dm.set_sid_for("com", sid)
        case "Web":
            dm.set_sid_for("web", sid)
        case "LL":
            dm.set_sid_for("landline", sid)
        case "Cell":
            dm.set_sid_for("cell", sid)
        case "project":
            voxco_ids = dp.get_voxco_project_database(sid)
            return voxco_ids
        case _:
            return {}
    name = dm.survey_name()
    return name


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', allowed_domain)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRFToken")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response