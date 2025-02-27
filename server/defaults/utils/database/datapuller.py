import traceback
import os

import pandas
import pandas as pd
from sqlalchemy import create_engine, text

from .database import Database, DataBaseAccessInfo
from .sqldictionary import SQLDictionary

from server.defaults.utils.logger_config import logger


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
        self.dbai2 = DataBaseAccessInfo()

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

    def __str__(self):
        return self.SQL_CONNECTION

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

    def get_voxco_project_database(self, project_number: str):
        voxco_ids = {}
        try:
            self.dbai2.find_voxco_project_database()
            # cnxn = self.dbai2.connect_engine()

            # df = pd.read_sql_query(sql, cnxn)
            #
            # dbs = df['ProjectDatabase'].tolist()
            # for db in dbs:
            #     sql = text(f"SELECT MIN(projectId) FROM [{db}].[dbo].[Installation]")
            #     pid = pd.read_sql_query(sql, cnxn)
            #     voxco_ids.append(pid[0])
            # logger.debug(voxco_ids)
            # cnxn.close()
            # del cnxn

            with self.dbai2.connect_engine() as conn:
                sql = text(f"{os.environ['voxco_project_database']}{project_number}'")
                result = conn.execute(sql)
                voxco_ids['ll'] = result.scalar()

                sql = text(f"{os.environ['voxco_project_database']}{project_number}C'")
                result = conn.execute(sql)
                voxco_ids['cell'] = result.scalar()

                sql = text(f"{os.environ['voxco_project_database']}{project_number}COM'")
                result = conn.execute(sql)
                voxco_ids['com'] = result.scalar()

                sql = text(f"{os.environ['acuity_project_database']}{project_number}%'")
                result = conn.execute(sql)
                voxco_ids['web'] = result.scalar()

            return voxco_ids
        except Exception as err:
            raise err
