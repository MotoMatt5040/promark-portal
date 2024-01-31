from server.defaults.utils.database.datapuller import DataPuller
from .queryBuilder import QueryBuilder
import pandas


class PeriodicUpdate(QueryBuilder):
    def __init__(self):
        super().__init__()
        self.dp = DataPuller()
        self.dp.set_database('CaligulaD')

    def update(self) -> pandas.DataFrame:
        return self.dp.pull(self.query())
