class QueryBuilder:

    def __init__(self):
        self._locationClause = None
        self._projectid = ''
        self._location = ''
        self._projectidclause = ''
        self._projectidclause2 = ''
        self._projectidclause3 = ''
        self._allclause = 'tblHourlyProductionDetail.projectid, '

    def query(self) -> str:
        return \
            f"SELECT {self._allclause}RecLoc, tblCC3EMployeeList.EID, LastName + ', ' + FirstName AS MyName, " \
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
            "LEFT JOIN (Select VoxcoID, AVG(duration/60) AS IntAvg FROM tblavgLengthShift " \
            f"{self._projectidclause2}" \
            "GROUP BY VoxcoID) AS tblAvgLength ON tblAvgLength.VoxcoID = tblCC3EmployeeList.VoxcoID " \
            f"WHERE {self._projectidclause3} Code = 'TD'{self._location} " \
            f"ORDER BY CMS DESC "


    '-----setters-----'

    @property
    def location(self):
        return self._location

    @location.setter
    def location(self, location):
        self._location = location
        self._locationClause = f" AND tblHourlyProductionDetail.recLoc = '{location}'"

    @property
    def projectid(self):
        return self._projectid

    @projectid.setter
    def projectid(self, projectid):
        self._projectid = projectid
        self._projectidclause = f" AND projectID = '{projectid}' "
        self._projectidclause2 = f"WHERE projectID = '{projectid}' "
        self._projectidclause3 = f" tblHourlyProductionDetail.projectID = '{projectid}' AND "
        self._allclause = ''

    '-----reset variables-----(may not be needed)'

    def reset(self):
        self._locationClause = None
        self._projectid = None
        self._location = None
        self._projectidclause = ''
        self._projectidclause2 = ''
        self._projectidclause3 = ''
        self._allclause = 'tblHourlyProductionDetail.projectid, '
        self._qry = None
