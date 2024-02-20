import io
import json
import os

import numpy as np
import pandas as pd
import requests

class ExtractionBuilder():
    def dat(self, prc_number, survey_id, variables: []):
        dat = {
            "Name": f"{prc_number}dat",
            "SurveyId": survey_id,
            "Language": "en",
            "Description": "Used by automation program to create ",
            "DestinationFileName": f"{prc_number}dat",
            "ExtractFormat": "CSV",
            "Filter": {
                "Id": 0,
                "DispositionResults": [
                  "Completed"
                ],
                "EmailStatus": "All",
                "SMSStatus": "All",
                "LastActivity": {
                  "UseCurrentDate": True
                },
                "Languages": [
                  "string"
                ],
                "Devices": [
                  "Unknown"
                ],
                "Samples": [
                  0
                ],
                "UserId": 0,
                "Expression": "string"
            },
            "IncludeOpenEnds": False,
            "IncludeConnectionHistory": False,
            "IncludeLabels": False,
            "StripHtmlFromLabels": True,
            "FieldDelimiter": "Comma",
            "Encoding": "Windows1252",
            "EncloseValuesInDoubleQuotes": False,
            "IncludeHeader": True,
            "UseChoiceLabels": False,
            "MergeOpenEnds": False,
            "DichotomizedMultiple": False,
            "DichotomizedEmptyWhenNoAnswer": False,
            "UseNegativeIntegersForEmptyAnswers": False,
            "DapresyDataFormat": False,
            "LoopsInQuestionnaireOrder": False,
            "RemoveBracesOfSystemVariables": True,
            "Variables": variables
        }
        info = requests.post(
            f"{os.environ['extraction_url']}",
            headers={
                "Authorization": os.environ['access_token']},
            data=dat
        )
        print(info)

    def test(self):
        order = {
            "Name": "order",
            "SurveyId": 420,
            "Language": "en",
            "Description": "Used by automation program to create ",
            "DestinationFileName": "order",
            "ExtractFormat": "CSV",
            "Filter": {
                "Id": 0,
                "DispositionResults": [
                  "Completed"
                ],
                "EmailStatus": "All",
                "SMSStatus": "All",
                "LastActivity": {
                  "UseCurrentDate": True
                },
                "Languages": [
                  "string"
                ],
                "Devices": [
                  "Unknown"
                ],
                "Samples": [
                  0
                ],
                "UserId": 0,
                "Expression": "string"
            },
            "IncludeOpenEnds": False,
            "IncludeConnectionHistory": False,
            "IncludeLabels": False,
            "StripHtmlFromLabels": True,
            "FieldDelimiter": "Comma",
            "Encoding": "Windows1252",
            "EncloseValuesInDoubleQuotes": False,
            "IncludeHeader": True,
            "UseChoiceLabels": False,
            "MergeOpenEnds": True,
            "DichotomizedMultiple": False,
            "DichotomizedEmptyWhenNoAnswer": False,
            "UseNegativeIntegersForEmptyAnswers": False,
            "DapresyDataFormat": False,
            "LoopsInQuestionnaireOrder": False,
            "RemoveBracesOfSystemVariables": True,
            "Variables": [
                "QA"
            ]
        }
        print(type(order))
        info = requests.post(
          f"{os.environ['extraction_url']}",
          headers={f"Authorization": f"Client {os.environ['access_token']}"},
          data=order
        )
        print(info)


