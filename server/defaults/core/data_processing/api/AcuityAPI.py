import os


class AcuityAPI():

    def __init__(self):
        self._dat_url = None
        self._access_token = os.environ['access_token']
        self._sid = None
        self._questions_url = None
        self._variables_url = None
        self._order_extraction_task_url = None
        self._order_extraction_id = None
        self._order_extraction_res_url = None
        self._survey_url = None
        self._order_url = None
        self._dat_extraction_task_url = None
        self._dat_extraction_id = None
        self._dat_extraction_res_url = None

    @property
    def access_token(self):
        return self._access_token

    @access_token.setter
    def access_token(self, value):
        self._access_token = value

    @property
    def sid(self):
        return self._sid

    @sid.setter
    def sid(self, sid):
        self._sid = sid
        self._questions_url = f"{os.environ['questions_url']}{sid}"
        self._variables_url = f"{os.environ['variables_url']}{sid}"
        self._order_extraction_task_url = f"{os.environ['extraction_url']}?surveyId={sid}"
        self._survey_url = f"{os.environ['web_survey_url']}{sid}"

    @property
    def questions_url(self):
        return self._questions_url

    @property
    def variables_url(self):
        return self._variables_url

    @property
    def extraction_task_url(self):
        return self._order_extraction_task_url

    @property
    def order_extraction_id(self):
        return self._order_extraction_id

    @order_extraction_id.setter
    def order_extraction_id(self, extraction_id):
        self._order_extraction_id = extraction_id
        self._order_extraction_res_url = f"{os.environ['extraction_url']}/{extraction_id}"

    @property
    def order_extraction_res_url(self):
        return self._order_extraction_res_url

    @property
    def order_url(self):
        return self._order_url

    @order_url.setter
    def order_url(self, order_id):
        self._order_url = f"{os.environ['extraction_file_id_url']}?extractionId={self._order_extraction_id}&fileId={order_id}"

    @property
    def survey_url(self):
        return self._survey_url

    @property
    def dat_extraction_id(self):
        return self._dat_extraction_id

    @dat_extraction_id.setter
    def dat_extraction_id(self, extraction_id):
        self._dat_extraction_id = extraction_id
        self._dat_extraction_res_url = f"{os.environ['extraction_url']}/{extraction_id}"

    @property
    def dat_url(self):
        return self._dat_url

    @dat_url.setter
    def dat_url(self, dat_id):
        self._dat_url = f"{os.environ['extraction_file_id_url']}?extractionId={self._dat_extraction_id}&fileId={dat_id}"

    @property
    def dat_extraction_res_url(self):
        return self._dat_extraction_res_url
