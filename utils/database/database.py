from configparser import ConfigParser
import os


class Database:
    '''Database Accessor'''
    # region constants for server info
    config_object = ConfigParser()
    config_path = f"utils/config.ini"
    config_object.read(config_path)


    info = config_object["DATABASE ACCESS INFO"]

    CORESERVER = info["coreserver"]
    COREUSER = info["coreuser"]
    COREPASSWORD = info["corepassword"]
    CALIGULA = info["caligula"]
    del config_object

    DRIVER = '{ODBC Driver 17 for SQL Server}'

    # endregion constants for server info
    driver = 'ODBC17',
    servername = 'COREServer',
    database = 'FAJITA',
    userid = 'COREUser',
    password = 'COREPassword'

    def __init__(self):
        try:
            self._driver = self.DRIVER
            self._servername = self.CORESERVER
            self._database = self.CALIGULA
            self._userid = self.COREUSER
            self._password = self.COREPASSWORD
        except Exception as err:
            print(err)

    def get_info(self):
        URI = '*****\nDriver: {}\nServer Address: {}\nDatabase Name: {}\nUserID: {}\nPassword: {}\n*****'.format(
            self._driver, self._servername, self._database, self._userid, self._password
        )
        return URI

    def get_driver(self):
        return self._driver

    def get_server(self):
        return self._servername

    def get_database(self):
        return self._database

    def get_user_id(self):
        return self._userid

    def get_password(self):
        return self._password
