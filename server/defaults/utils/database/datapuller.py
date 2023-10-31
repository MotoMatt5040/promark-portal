import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy import text
import webbrowser
import pyodbc
from .database import Database
from .sqldictionary import SQLDictionary
import sys
import traceback

class DataPuller:
    '''Data Puller class'''
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

    def promark_phone_numbers(self):
        """Used to pull Promark phone numbers"""
        try:
            conn = self.connect()
            df = pd.read_sql_query(text(self.sqld.promark_phone_numbers()), conn)
            conn.close()
            del conn
            return df
        except Exception as err:
            self.error_log(err)
        return ['Error pulling promark phone numbers']

    def message_body(self, projectid: str):
        """used to pull text message body"""
        try:
            conn = self.connect()
            df = pd.read_sql_query(text(self.sqld.message_body(projectid)), conn)
            conn.close()
            del conn
            return df
        except Exception as err:
            self.error_log(err)
        return ['Error pulling message body']

    def connect(self):
        try:
            return self.engine.connect()
        except Exception:
            print("No ODBC Driver detected. Please install Microsoft ODBC Driver 17 for SQL Server from "
                  "https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16#version-17")
            webbrowser.open(
                "https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16#version-17")
            input("Press Enter to continue...")
        return "Connection Error"

    def error_log(self, err):
        print(err)
        print(traceback.format_exc())
        input("Press Enter to continue...")
