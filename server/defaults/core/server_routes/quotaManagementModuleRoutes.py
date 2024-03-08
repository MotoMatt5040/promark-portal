import json
import shutil

from flask import Blueprint, request, make_response, send_file

from server.defaults.utils.database.datapuller import DataPuller
from ..quota_management.dataManagement import DataManagement
from .config import allowed_domain

quotas = Blueprint('quota_management', __name__)
dp = DataPuller()
dm = DataManagement()


@quotas.route('/quotas/survey_quotas', methods=['POST', 'OPTIONS'])
def survey_quotas():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    source = request.json['source']
    sid = request.json['surveyID']

    dm.source = source

    match source:
        case 'com':
            dm.com_sid = sid
        case 'web':
            dm.web_sid = sid
        case 'landline':
            dm.landline_sid = sid
        case 'cell':
            dm.cell_sid = sid
        case _:
            return {}

    data = dm.set_data()

    return data.to_json()


@quotas.route('/quotas/check', methods=['GET'])
def check():
    dm.merge_data()
    return ''


@quotas.route('/quotas/merge', methods=['GET'])
def merge():
    return dm.merge_data().to_json()


@quotas.route('/quotas/survey_name', methods=['POST', 'OPTIONS'])
def survey_name():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    source = request.json['source']
    sid = request.json['surveyID']

    dm.source = source

    match source:
        case 'com':
            dm.com_sid = sid
        case 'web':
            dm.web_sid = sid
        case 'landline':
            dm.landline_sid = sid
        case 'cell':
            dm.cell_sid = sid
        case _:
            return ''
    name = dm.survey_name()
    return name


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', allowed_domain)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response