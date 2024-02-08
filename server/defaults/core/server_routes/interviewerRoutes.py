import os

from flask import Blueprint, request, make_response

from server.defaults.core.dashboard.periodic_update.periodicUpdate import PeriodicUpdate
from server.defaults.utils.database.datapuller import DataPuller
from .config import allowed_domain


pu = PeriodicUpdate()
interviewer_update = Blueprint('interviewer', __name__)
dp = DataPuller()


@interviewer_update.route('/interviewer', methods=['POST', 'OPTIONS'])
def interviewer():
    pass


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', allowed_domain)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

