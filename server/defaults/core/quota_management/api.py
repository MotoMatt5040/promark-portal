import os
import requests

class API:

    def __init__(self):
        self._acuity_access_token = os.environ['access_token']
        self._voxco_access_token = None  # this token must be refreshed every hour, easier to do upon update

        self._com_sid = None
        self._com_quotas_url = None
        self._com_survey_url = None

        self._web_sid = None
        self._web_quotas_url = None
        self._web_survey_url = None

        self._landline_sid = None
        self._landline_quotas_url = None
        self._landline_survey_url = None

        self._cell_sid = None
        self._cell_quotas_url = None
        self._cell_survey_url = None

        self._project_base_url = os.environ['voxco_survey_url']

    @property
    def project_base_url(self):
        return self._project_base_url

    '----------com----------'

    @property
    def com_sid(self):
        return self._com_sid

    @property
    def com_quotas_url(self):
        return self._com_quotas_url

    @com_sid.setter
    def com_sid(self, sid):
        self._com_sid = sid
        self._com_quotas_url = f"{os.environ['voxco_survey_url']}{sid}/stratas?status=All"
        self._com_survey_url = f"{os.environ['voxco_survey_url']}{sid}"

    @property
    def com_survey_url(self):
        return self._com_survey_url

    '----------web----------'

    @property
    def web_sid(self):
        return self._web_sid

    @property
    def web_quotas_url(self):
        return self._web_quotas_url

    @web_sid.setter
    def web_sid(self, sid):
        self._web_sid = sid
        self._web_quotas_url = f"{os.environ['web_quotas_url']}{sid}"
        self._web_survey_url = f"{os.environ['web_survey_url']}{sid}"

    @property
    def web_survey_url(self):
        return self._web_survey_url

    '----------landline----------'

    @property
    def landline_sid(self):
        return self._landline_sid

    @property
    def landline_quotas_url(self):
        return self._landline_quotas_url

    @landline_sid.setter
    def landline_sid(self, sid):
        self._landline_sid = sid
        self._landline_quotas_url = f"{os.environ['voxco_survey_url']}{sid}/stratas?status=All"
        self._landline_survey_url = f"{os.environ['voxco_survey_url']}{sid}"

    @property
    def landline_survey_url(self):
        return self._landline_survey_url

    '----------cell----------'

    @property
    def cell_sid(self):
        return self._cell_sid

    @property
    def cell_quotas_url(self):
        return self._cell_quotas_url

    @cell_sid.setter
    def cell_sid(self, sid):
        self._cell_sid = sid
        self._cell_quotas_url = f"{os.environ['voxco_survey_url']}{sid}/stratas?status=All"
        self._cell_survey_url = f"{os.environ['voxco_survey_url']}{sid}"

    @property
    def cell_survey_url(self):
        return self._cell_survey_url

    @property
    def voxco_access_token(self):
        return requests.get(os.environ['voxco_access_token_url']).json()['Token']
