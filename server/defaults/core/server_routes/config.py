from dotenv import load_dotenv
load_dotenv()

import os
from ...utils.database.database import Database

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
class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = dbcon