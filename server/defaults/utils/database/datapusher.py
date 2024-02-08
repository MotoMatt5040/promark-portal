from sqlalchemy import create_engine, MetaData, Table, Column, Integer
import webbrowser
from .database import Database
from .sqldictionary import SQLDictionary
import traceback
import os


def error_log(err):
    print(err)
    print(traceback.format_exc())
    input("Press Enter to continue...")


class DataPusher:
    """Data Pusher class"""
    sqld = SQLDictionary()

    #  initialize database access info to connect to database
    dbai = Database()

    #  Build the connection string
    SQL_CONNECTION = 'DRIVER={};SERVER={};DATABASE={};UID={};PWD={}'.format(
        dbai.get_driver(),
        dbai.get_server(),
        dbai.get_database(),
        dbai.get_user_id(),
        dbai.get_password()
    )
    del dbai
    dbcon = f'mssql+pyodbc:///?odbc_connect={SQL_CONNECTION}'
    engine = create_engine(dbcon)
    del dbcon

    def create_sample_table(self, samplePath: os.path):
        status_code = None
        if not os.path.exists(path=samplePath):
            error_log(f"\nNOTICE:\n***OS Path does not exist, please check sample path.***\nGiven Path: {samplePath}")

        try:
            conn = self.connect()
            with conn:
                pass
                # conn.create
                # cur = conn.cursor()
                # exe = cur.execute(f"SELECT * FROM {table} where username = '{username}'")
                # data = exe.fetchone()
                # if data is not None:
                #     if datetime.now() - timedelta(hours=2) > datetime.strptime(data[2], '%Y-%m-%d %H:%M:%S.%f'):
                #         data = update()
                # else:
                #     data = update()

            # return data[1]
        except Exception as err:
                print(err)
                return "ERROR"
        return status_code

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
