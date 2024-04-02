import os


class Database:
    '''Database Accessor'''
    # region constants for server info

    CORESERVER = os.environ['coreserver']
    COREUSER = os.environ["coreuser"]
    COREPASSWORD = os.environ["corepassword"]
    DATABASE = os.environ["caligula"]

    DRIVER = '{ODBC Driver 17 for SQL Server}'

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
