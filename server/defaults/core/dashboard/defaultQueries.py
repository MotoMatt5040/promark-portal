from datetime import date, timedelta

from server.defaults.core.auth.permissions import Permissions


def active_projectIDs_query():
    return \
        f'SELECT DISTINCT projectid FROM tblHourlyProduction ' \
        f"WHERE lastupdate >= '{date.today() - timedelta(hours=8)}'"


def active_location_query():
    return "SELECT LongName, LocationID FROM tblLocation WHERE TYPE = 'P' AND ACTIVE = 1 AND CATIModule# is not null"
    match Permissions.authorization_location:
        case '101':
            return "SELECT LongName FROM tblLocation WHERE TYPE = 'P' AND ACTIVE = 1  AND CATIModule# is not null"


def check_permissions():
    return "SELECT [FAJITA].[dbo].[users] location, authorization_level FROM tblUsers"