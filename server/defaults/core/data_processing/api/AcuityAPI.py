import os


class AcuityAPI():

    def __init__(self):
        self._access_token = os.environ['access_token']
        self._sid = None
        self._questions_url = None
        self._variables_url = None
        self._extraction_task_url = None
        self._extraction_id = None
        self._extraction_res_url = None
        self._survey_url = None
        self._order_url = None

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
        self._extraction_task_url = f"{os.environ['extraction_task_url']}{sid}"
        self._survey_url = f"{os.environ['web_survey_url']}{sid}"

    @property
    def questions_url(self):
        return self._questions_url

    @property
    def variables_url(self):
        return self._variables_url

    @property
    def extraction_task_url(self):
        return self._extraction_task_url

    @property
    def extraction_id(self):
        return self._extraction_id

    @extraction_id.setter
    def extraction_id(self, extraction_id):
        self._extraction_id = extraction_id
        self._extraction_res_url = f"{os.environ['extraction_result_url']}{extraction_id}"

    @property
    def extraction_res_url(self):
        return self._extraction_res_url

    @property
    def survey_url(self):
        return self._survey_url

    @property
    def order_url(self):
        return self._order_url

    @order_url.setter
    def order_url(self, order_id):
        self._order_url = f"{os.environ['order_url']}?extractionId={self._extraction_id}&fileId={order_id}"
