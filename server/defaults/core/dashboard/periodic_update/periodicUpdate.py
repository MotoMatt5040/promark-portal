from server.defaults.utils.database.datapuller import DataPuller
from .queryBuilder import QueryBuilder
import pandas
from ..defaultQueries import active_location_query, active_projectIDs_query, convert_location_name_to_id


class PeriodicUpdate(QueryBuilder):
    # An instance of DataPuller is imported here rather than in a master file because a different databasae is used for
    # anything related to the dashboard/e-manager
    def __init__(self):
        super().__init__()
        self.dp = DataPuller()
        self.dp.set_database('CaligulaD')

    def update(self) -> pandas.DataFrame:
        return self.dp.pull(self.periodic_update_query())

    def active_locations(self) -> pandas.DataFrame:
        return self.dp.pull(active_location_query())

    def active_projectIDs(self) -> pandas.DataFrame:
        return self.dp.pull(active_projectIDs_query())


# p = PeriodicUpdate()
# print(p.active_locations().to_string())