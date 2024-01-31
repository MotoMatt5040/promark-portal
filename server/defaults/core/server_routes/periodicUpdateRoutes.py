from flask import Blueprint, request
from server.defaults.core.dashboard.periodic_update.periodicUpdate import PeriodicUpdate

pu = PeriodicUpdate()
periodic_update = Blueprint('periodic', __name__)


@periodic_update.route('/periodic_update')
def updater():

    pu.projectid = request.json['projectid']
    pu.location = request.json['location']

    return pu.update()

