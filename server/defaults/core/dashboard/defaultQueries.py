from datetime import date, timedelta

def active_projectIDs_query():
    return \
        f'SELECT DISTINCT projectid FROM tblHourlyProduction ' \
        f"WHERE lastupdate >= '2024-02-09'"
        # f"WHERE lastupdate >= '{date.today() - timedelta(hours=8)}'"


def active_location_query():
    return "SELECT LongName, LocationID FROM tblLocation WHERE TYPE = 'P' AND ACTIVE = 1 AND CATIModule# is not null"


def project_summary_query():
    return "Select DISTINCT tblHourlyProduction.ProjectID, tblBlueBookProjmaster.ProjName, " \
           "tblHourlyProduction.RecLoc, tblHourlyProduction.AL, tblHourlyProduction.CMS, tblHourlyProduction.CPH, " \
           "tblHourlyProduction.MPH, tblHourlyProduction.HRS From tblHourlyProduction " \
           "inner join tblBlueBookProjMaster ON tblHourlyPRoduction.ProjectID = tblBlueBookProjMaster.ProjectID " \
           "where recLoc <> '99' order by tblHourlyProduction.ProjectID"


def check_permissions():
    return "SELECT [FAJITA].[dbo].[users] location, authorization_level FROM tblUsers"