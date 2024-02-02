import os

import redis
from dotenv import load_dotenv

# from ...utils.database.database import Database

load_dotenv()

#  initialize database access info to connect to database
# dbai = Database()

#  Build the connection string
SQL_CONNECTION = 'DRIVER={};SERVER={};DATABASE={};UID={};PWD={}'.format(
    '{ODBC Driver 17 for SQL Server}',
    os.environ.get('coreserver'),
    os.environ.get('portal_database'),
    os.environ.get("coreuser"),
    os.environ.get("corepassword")
)
# del dbai
uri = f'mssql+pyodbc:///?odbc_connect={SQL_CONNECTION}'
class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = uri

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    # SESSION_REDIS = redis.from_url("redis://redis:6379")  # FOR PRODUCTION/DEV
    SESSION_REDIS = redis.from_url("redis://localhost:6379")  # FOR TESTING
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_SECURE = True
