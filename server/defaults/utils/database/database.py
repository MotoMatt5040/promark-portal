import os
from configparser import ConfigParser
from pathlib import Path


class Database:
    '''Database Accessor'''
    # region constants for server info
    config_object = ConfigParser()
    config_path = Path(f"defaults/utils/config.ini")
    config_object.read(config_path)

    CORESERVER = os.environ.get('coreserver')
    COREUSER = os.environ.get("coreuser")
    COREPASSWORD = os.environ.get("corepassword")
    DATABASE = os.environ.get("portal_database")
    del config_object

    DRIVER = '{ODBC Driver 17 for SQL Server}'

    # endregion constants for server info
    # driver = 'ODBC17',
    # servername = 'COREServer',
    # database = 'FAJITA',
    # userid = 'COREUser',
    # password = 'COREPassword'

    def __init__(self):
        try:
            self._driver = self.DRIVER
            self._servername = self.CORESERVER
            self._database = self.DATABASE
            self._userid = self.COREUSER
            self._password = self.COREPASSWORD
        except Exception as err:
            print(err)

    def get_info(self):
        URI = '*****\nDriver: {}\nServer Address: {}\nDatabase Name: {}\nUserID: {}\nPassword: {}\n*****'.format(
            self._driver, self._servername, self._database, self._userid, self._password
        )
        return URI

    @property
    def driver(self):
        return self._driver

    @property
    def server(self):
        return self._servername

    @property
    def database(self):
        return self._database

    @database.setter
    def database(self, database):
        self._database = database

    @property
    def user_id(self):
        return self._userid

    @property
    def password(self):
        return self._password
