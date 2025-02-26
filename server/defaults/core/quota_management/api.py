import os
import requests
from dataclasses import dataclass
from server.defaults.utils.logger_config import logger

@dataclass
class SurveyType:
    name: str
    sid: str = None
    quotas_url: str = None
    survey_url: str = None

    def set_sid(self, sid, survey_type):
        self.sid = sid
        if survey_type == "web":
            self.quotas_url = f"{os.environ['web_quotas_url']}{sid}"
            self.survey_url = f"{os.environ['web_survey_url']}{sid}"
        else:
            self.quotas_url = f"{os.environ['voxco_survey_url']}{sid}/stratas?status=All"
            self.survey_url = f"{os.environ['voxco_survey_url']}{sid}"


class API:
    def __init__(self):
        self._acuity_access_token = os.environ['access_token']
        self._voxco_access_token = None  # this token must be refreshed every hour, easier to do upon update

        # Using dataclass instances for each survey type
        self.survey_types = {
            "com": SurveyType(name="com"),
            "web": SurveyType(name="web"),
            "landline": SurveyType(name="landline"),
            "cell": SurveyType(name="cell")
        }

        self._project_base_url = os.environ['voxco_survey_url']

    @property
    def project_base_url(self):
        return self._project_base_url

    @property
    def voxco_access_token(self):
        return requests.get(os.environ['voxco_access_token_url']).json()['Token']

    def set_sid_for(self, survey_type, sid):
        if survey_type in self.survey_types:
            self.survey_types[survey_type].set_sid(sid, survey_type)
        else:
            raise ValueError(f"Invalid survey type: {survey_type}")

    def get_sid_for(self, survey_type):
        if survey_type in self.survey_types:
            print(self.survey_types[survey_type].sid)
            return self.survey_types[survey_type].sid
        else:
            raise ValueError(f"Invalid survey type: {survey_type}")

    def get_quotas_url_for(self, survey_type):
        if survey_type in self.survey_types:
            print(self.survey_types[survey_type].quotas_url)
            return self.survey_types[survey_type].quotas_url
        else:
            raise ValueError(f"Invalid survey type: {survey_type}")

    def get_survey_url_for(self, survey_type):
        if survey_type in self.survey_types:
            print(self.survey_types[survey_type].survey_url)
            return self.survey_types[survey_type].survey_url
        else:
            raise ValueError(f"Invalid survey type: {survey_type}")
