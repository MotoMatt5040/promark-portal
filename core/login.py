import os
import sys
import traceback


class TwilioLogin:
    '''
    Twilio Login
    '''

    def __init__(self):
        # self.account_sid = os.environ['TWILIO_ACCOUNT_SID'] PERSONAL LOGIN
        # self.auth_token = os.environ['TWILIO_AUTH_TOKEN'] PERSONAL LOGIN
        self.account_sid = os.environ['PROMARK_TWILIO_ACCOUNT_SID']
        self.auth_token = os.environ['PROMARK_TWILIO_AUTH_TOKEN']
        #self.main_sid = os.environ["PROMARK_TWILIO_MAIN_SID"] LIKELY NOT NEEDED NOW
        self.client = Client(self.account_sid, self.auth_token)
        #self.key = self.client.keys(self.main_sid).fetch() LIKELY NOT NEEDED NOW
        # print(f"login.py : key = {self.key}")

    def set_account_sid(self, account_sid):
        try:
            self.account_sid = account_sid
        except Exception as err:
            print(err)
            print(traceback.format_exc())

    def get_account_sid(self):
        return self.account_sid

    def set_auth_token(self, auth_token):
        try:
            self.auth_token = auth_token
        except Exception as err:
            print(err)
            print(traceback.format_exc())

    def get_auth_token(self):
        return self.auth_token

    def set_client(self):
        try:
            self.client = Client(self.account_sid, self.auth_token)
        except Exception as err:
            print(err)
            print(traceback.format_exc())

    def get_client(self):
        return self.client
