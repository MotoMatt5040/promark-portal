import os

import redis


allowed_domain = os.environ['testing']

#  initialize database access info to connect to database

#  TODO update to Driver 18

#  Build the connection string
SQL_CONNECTION = 'DRIVER={};SERVER={};DATABASE={};UID={};PWD={}'.format(
    '{ODBC Driver 17 for SQL Server}',
    os.environ['coreserver'],
    os.environ['caligula'],
    os.environ["coreuser"],
    os.environ["corepassword"]
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
    # SESSION_REDIS = redis.from_url(f"redis://:{os.environ['REDIS_PASS']}@redis:6379")  # FOR PRODUCTION/DEV
    SESSION_REDIS = redis.from_url("redis://localhost:6379")  # FOR TESTING
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_PATH = '/'
    SESSION_FILE_DIR = '/'
