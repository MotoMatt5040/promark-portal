from sqlalchemy import create_engine, MetaData, Table, Column, Integer
import webbrowser
from .database import Database
from .sqldictionary import SQLDictionary
import traceback
import os


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


class DataPusher:
    def __init__(self):
        '''Data Pusher class'''
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

    def add_user(selfself, ):
        pass


    # def push(self, table: str, columns: [], rows: []):
    #
    #     try:
    #         conn = self.connect()
    #         with conn:
    #             pass
    #             conn.create()
    #             cur = conn.cursor()
    #             exe = cur.execute(f"SELECT * FROM {table} where username = '{username}'")
    #             # data = exe.fetchone()
    #             # if data is not None:
    #             #     if datetime.now() - timedelta(hours=2) > datetime.strptime(data[2], '%Y-%m-%d %H:%M:%S.%f'):
    #             #         data = update()
    #             # else:
    #             #     data = update()
    #
    #         # return data[1]
    #     except Exception as err:
    #             print(err)
    #             return "ERROR"
    #     return []

    # def execute_query(table, username):
    #
    #     def update():
    #         sql = f"""INSERT OR REPLACE INTO {table}(username, result, date)
    #                     VALUES (?,?,?)"""
    #         cur.execute(sql, [username, random.randint(0, 100), datetime.now()])
    #         conn.commit()
    #         exe = cur.execute(f"SELECT * FROM {table} where username = '{username}'")
    #         return exe.fetchone()
    #
    #     try:
    #         conn = sqlite3.connect('Database/Nami.db')
    #         with conn:
    #             cur = conn.cursor()
    #             exe = cur.execute(f"SELECT * FROM {table} where username = '{username}'")
    #             data = exe.fetchone()
    #             if data is not None:
    #                 if datetime.now() - timedelta(hours=2) > datetime.strptime(data[2], '%Y-%m-%d %H:%M:%S.%f'):
    #                     data = update()
    #             else:
    #                 data = update()
    #
    #         return data[1]
    #
    #     except Exception as err:
    #         print(err)
    #         return "ERROR"

    def connect(self):
        try:
            return self.engine.connect()
        except Exception as err:
            print("No ODBC Driver detected. Please install Microsoft ODBC Driver 17 for SQL Server from "
                  "https://learn.microsoft.com/en-us/sql/connect/odbc/"
                  "download-odbc-driver-for-sql-server?view=sql-server-ver16#version-17")
            webbrowser.open(
                "https://learn.microsoft.com/en-us/sql/connect/odbc/"
                "download-odbc-driver-for-sql-server?view=sql-server-ver16#version-17")
            input("Press Enter to continue...")
            print("*"*20)
            error_log(err)
            print("*" * 20)
        return "Connection Error"
