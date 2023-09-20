from .login import TwilioLogin
import json
import requests


class TwilioRequests(TwilioLogin):
    """message class"""
    i = 0

    def __init__(self):
        super().__init__()
        self.message = None

    def send_sms(self, from_, to_):
        """Send sms"""

        self.message = self.client.messages \
            .create(
                body=f"Twilio Test Message Number {self.i}",
                from_=f'+1{from_}',
                # from_='+12296964616',
                to=f'+1{to_}'
        )

        print(f"Twilio Test Message Number {self.i}")
        self.i += 1

    def get_message_data(self):
        """
        {
            "account_sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

            "api_version": "YYYY-mm-dd",

            "body": "<message body>",

            "date_created": "ddd, dd mmm YYYY HH:MM:SS +0000",

            "date_sent": "ddd, dd mmm YYYY HH:MM:SS +0000",

            "date_updated": "ddd, dd mmm YYYY HH:MM:SS +0000",

            "direction": "outbound-api",

            "error_code": null,

            "error_message": null,

            "from": "+1XXXXXXXXXX",

            "messaging_service_sid": "MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

            "num_media": "0",

            "num_segments": "1",

            "price": null,

            "price_unit": null,

            "sid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

            "status": "sent",

            "subresource_uris": {
               "media": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Media.json"
            },

            "to": "+1XXXXXXXXXX",

            "uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json"
        }"""
        return self.message
