from datetime import date, timedelta, datetime
class QueryBuilder:

    def __init__(self):
        self._locationClause = None
        self._projectid = ''
        self._location = ''
        self._projectidclause = ''
        self._projectidclause2 = ''
        self._projectidclause3 = ''
        self._projectIDAllClause = ''

    def periodic_update_query(self) -> str:
        print(self._projectIDAllClause, ": ALL CLAUSE")
        return \
            f"SELECT {self._projectIDAllClause}{self._locationAllClause}tblCC3EMployeeList.EID, LastName + ', ' + FirstName AS MyName, " \
            f"Tenure, HRS, CMS, IntAVG AS IntAL, CPH, " \
            "MPH, PauseTime, ConnectTime, CodeQty AS TotalDials, NAAM " \
            "FROM tblHourlyProductionDetail INNER JOIN tblCC3EmployeeList " \
            "ON tblHourlyProductionDetail.VoxcoID = tblCC3EMployeeList.VoxcoID " \
            "INNER JOIN tblIntCodes ON tblIntCodes.VoxcoID = tblCC3EMployeeList.VoxcoID " \
            "AND tblHourlyProductionDetail.projectID = tblIntCodes.ProjectID " \
            "INNER JOIN tblEmployees ON tblEmployees.EmpID = tblCC3EMployeeList.EID " \
            "INNER JOIN (Select EID, sum(CodeQty) AS NAAM FROM tblIntCodes " \
            "INNER JOIN tblCC3EmployeeList ON tblIntCodes.VoxcoID = tblCC3EmployeeList.VoxcoID " \
            f"WHERE Code = '02' {self._projectidclause}GROUP BY EID) AS tblNAAM " \
            f"ON tblNAAM.EID = tblCC3Employeelist.EID " \
            "LEFT JOIN (Select VoxcoID, ROUND(AVG(duration/60), 2) AS IntAvg FROM tblavgLengthShift " \
            f"{self._projectidclause2}" \
            "GROUP BY VoxcoID) AS tblAvgLength ON tblAvgLength.VoxcoID = tblCC3EmployeeList.VoxcoID " \
            f"WHERE {self._projectidclause3} Code = 'TD'{self._locationClause} " \
            f"ORDER BY CMS DESC "

    '-----setters-----'

    @property
    def location(self):
        return self._location

    @location.setter
    def location(self, location):
        self.resetLocation()
        if location == 'All':
            self._locationAllClause = f"RecLoc, "
            return
        self._location = location
        self._locationClause = f" AND tblHourlyProductionDetail.recLoc = '{location}'"

    @property
    def projectid(self):
        return self._projectid

    @projectid.setter
    def projectid(self, projectid):
        self.resetProjectID()
        if projectid == "All":
            self._projectIDAllClause = 'tblHourlyProductionDetail.projectid, '
            return
        self._projectid = projectid
        self._projectidclause = f" AND projectID = '{projectid}' "
        self._projectidclause2 = f"WHERE projectID = '{projectid}' "
        self._projectidclause3 = f" tblHourlyProductionDetail.projectID = '{projectid}' AND "


    '-----reset variables-----(may not be needed)'

    def resetProjectID(self):
        self._projectid = None
        self._projectidclause = ''
        self._projectidclause2 = ''
        self._projectidclause3 = ''
        self._projectIDAllClause = ''

    def resetLocation(self):
        self._locationClause = None
        self._location = None
        self._locationClause = ''
        self._locationAllClause = ''
