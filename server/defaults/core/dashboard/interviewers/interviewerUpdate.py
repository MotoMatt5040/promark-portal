from queryBuilder import QueryBuilder

from server.defaults.utils.database.datapuller import DataPuller  # need to remove "server" from import


class InterviewerUpdate(QueryBuilder):

    def __init__(self):
        super().__init__()
        self.dp = DataPuller()
        self.dp.set_database('CaligulaDTest')

