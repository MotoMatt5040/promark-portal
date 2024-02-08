from datetime import date, timedelta

def active_projectIDs_query():
    return \
        f'SELECT DISTINCT projectid FROM tblHourlyProduction ' \
        f"WHERE lastupdate >= '2023-03-15'"
        # f"WHERE lastupdate >= '{date.today() - timedelta(hours=8)}'"


def active_location_query():
    return "SELECT LongName, LocationID FROM tblLocation WHERE TYPE = 'P' AND ACTIVE = 1 AND CATIModule# is not null"


def check_permissions():
    return "SELECT [FAJITA].[dbo].[users] location, authorization_level FROM tblUsers"