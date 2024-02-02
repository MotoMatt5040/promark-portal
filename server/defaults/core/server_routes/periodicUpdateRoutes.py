from flask import Blueprint, request, jsonify
from server.defaults.core.dashboard.periodic_update.periodicUpdate import PeriodicUpdate
from server.defaults.utils.database.datapuller import DataPuller
from server.defaults.core.dashboard.defaultQueries import active_location_query
import json


pu = PeriodicUpdate()
periodic_update = Blueprint('periodic', __name__)
dp = DataPuller()


@periodic_update.route('/periodic_update')
def updater():

    pu.projectid = request.json['projectid']
    pu.location = request.json['location']

    return pu.update()

@periodic_update.route('/active/locations', methods=['GET'])
def active_locations():
    response = pu.active_locations()
    print(response.to_string())
    # print(response)
    return response.to_json()#.to_dict('records')
