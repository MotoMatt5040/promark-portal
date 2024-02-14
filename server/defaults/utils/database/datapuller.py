import traceback

import pandas
import pandas as pd
from sqlalchemy import create_engine

from .database import Database
from .sqldictionary import SQLDictionary


def error_log(err):
    print("\n\n\n")
    print("*" * 350)
    print(err)
    print("\n")
    print("*" * 50)
    print("\n")
    print(traceback.format_exc())
    # input("Press Enter to continue...")
    print("*" * 150)
    print("\n\n\n")

class DataPuller:

    def __init__(self):
        '''Data Puller class'''
        self.sqld = SQLDictionary()

        #  initialize database access info to connect to database
        self.dbai = Database()

        #  Build the connection string
        self.SQL_CONNECTION = 'DRIVER={};SERVER={};DATABASE={};UID={};PWD={}'.format(
            self.dbai.driver,
            self.dbai.server,
            self.dbai.database,
            self.dbai.user_id,
            self.dbai.password
        )

        self.dbcon = f'mssql+pyodbc:///?odbc_connect={self.SQL_CONNECTION}'
        # connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": self.SQL_CONNECTION})
        try:
            # self.engine = create_engine(self.dbcon, pool_pre_ping=True)
            self.engine = create_engine(self.dbcon)
        except Exception as err:
            error_log(err)

    def pull(self, qry: str) -> pandas.DataFrame:
        conn = self.connect()
        if not conn:
            return pd.DataFrame([['connection failed']])
        df = pd.read_sql_query(qry, conn)
        conn.close()
        del conn
        return df

    def connect(self):
        try:
            return self.engine.connect()
        except Exception as err:
            error_log(err)
        return "Connection Error"

    def set_database(self, database):
        self.dbai.database = database
        SQL_CONNECTION = 'DRIVER={};SERVER={};DATABASE={};UID={};PWD={}'.format(
            self.dbai.driver,
            self.dbai.server,
            self.dbai.database,
            self.dbai.user_id,
            self.dbai.password
        )

        dbcon = f'mssql+pyodbc:///?odbc_connect={SQL_CONNECTION}'
        self.engine = create_engine(dbcon)
