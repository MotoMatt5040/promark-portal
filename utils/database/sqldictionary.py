from datetime import date, timedelta
from configparser import ConfigParser
import os

class SQLDictionary:
    """A dictionary class used to determine SQL select statements"""

    @staticmethod
    def message_body(projectid):
        """sql query for text body"""
        return f"SELECT text FROM tblTextInfo WHERE projectid = '{projectid}'"

    @staticmethod
    def promark_phone_numbers():
        """sql query for Promarks Phone Numbers"""
        return "SELECT phone_number FROM tblPromarkPhoneNumbers"

    def __init__(self):
        pass
