import pandas
import os

if os.environ['environment'] == 'dev':
    from server.defaults.utils.database.datapuller import DataPuller  # need to remove "server" from import
else:
    from defaults.utils.database.datapuller import DataPuller

from .queryBuilder import QueryBuilder
from ..defaultQueries import active_location_query, active_projectIDs_query, project_summary_query
from ..config import DATABASE


class PeriodicUpdate(QueryBuilder):
    # An instance of DataPuller is imported here rather than in a master file because a different databasae is used for
    # anything related to the dashboard/e-manager
    def __init__(self):
        super().__init__()
        self.dp = DataPuller()
        self.dp.set_database(DATABASE)

    def periodic_update(self) -> pandas.DataFrame:
        return self.dp.pull(self.periodic_update_query())

    def project_summary(self) -> pandas.DataFrame:
        return self.dp.pull(project_summary_query())

    def active_locations(self) -> pandas.DataFrame:
        return self.dp.pull(active_location_query())

    def active_projectIDs(self) -> pandas.DataFrame:
        return self.dp.pull(active_projectIDs_query())


# p = PeriodicUpdate()
# print(p.active_locations().to_string())