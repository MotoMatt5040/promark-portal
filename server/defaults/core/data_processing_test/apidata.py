import os
from dataclasses import dataclass
import requests
import json
import io
import zipfile
import pandas as pd


@dataclass(init=False)
class SharedVariables:
    sid: str = None
    prc_id: str = None
    survey_name = None


class ApiData:

    def __init__(self):
        self._survey_name = None
        self._url = None
        self._survey_url = None

    @property
    def sid(self):
        """
        Get or set the sid property.

        Notes
        -----
        * Setting the SID here updates the questions, variables, extraction task url, and survey url
        * Parent Class: SharedVariables
        """
        return SharedVariables.sid

    # @sid.setter
    # def sid(self, sid):
    #     SharedVariables.sid = sid

    @property
    def survey_name(self):
        return SharedVariables.survey_name

    @survey_name.setter
    def survey_name(self, survey_name):
        SharedVariables.survey_name = survey_name
        SharedVariables.prc_id = survey_name[:survey_name.find(' ')]

    @property
    def prc_id(self):
        return SharedVariables.prc_id

    @prc_id.setter
    def prc_id(self, prc_id):
        SharedVariables.prc_id = prc_id

    def prc_update(self):
        SharedVariables.prc_id = self._survey_name[:self._survey_name.find(' ')]

    @property
    def questions_url(self):
        return f"{os.environ['questions_url']}{self.sid}"

    @property
    def variables_url(self):
        return f"{os.environ['variables_url']}{self.sid}"

    @property
    def survey_url(self):
        return f"{os.environ['web_survey_url']}{self.sid}"


@dataclass(init=False)
class ExtractionData:
    # target_task_id: str
    # target_file_id: str

    def __init__(self):
        self._extraction_url = None
        self._extraction_id = None

    @property
    def sid(self):
        """
        Get the current SID value.

        NOTES
        _____
        This value can only be updated by calling the API class
        Parent class: SharedVariables
        """
        return SharedVariables.sid

    @property
    def extraction_task_list_url(self):
        """
        Get or Set the extraction url.
        """
        return f"{os.environ['extraction_url']}?surveyId={self.sid}"

    # @extraction_url.setter
    # def extraction_url(self):
    #     self._extraction_url = f"{os.environ['extraction_url']}?surveyId={self.sid}"

    @property
    def extraction_id(self):
        return self._extraction_id

    @extraction_id.setter
    def extraction_id(self, extraction_id):
        self._extraction_id = extraction_id
         # This is the url that is used to extract the file

    @property
    def target_extraction_task_url(self):
        """Get the target task data. This can only be called after setting the extraction id.
        """
        print(f"{os.environ['extraction_url']}/{self.extraction_id}")
        return f"{os.environ['extraction_url']}/{self.extraction_id}"


class VoxcoDataGrabber:
    _access_token: str = os.environ['access_token']
    api_data = ApiData()
    extraction_data = ExtractionData()

    def __init__(self):
        pass

    def survey_name(self) -> str:
        """
        Pull survey name from the api. This request must be made after the sid is set.
        :return: str: survey name
        """
        self.api_data.survey_name = requests.get(self.api_data.survey_url, headers={"Authorization": f"Client {self._access_token}"}).json()['Name']
        # The prc id is auto set inside the API class
        return self.api_data.survey_name

    def target_task_list(self) -> list[dict]:
        """
        Get the target task data from the extraction task url. This value will return False if the task is not found.
        :return: list[dict]: {ExtractionId: int, Name: str, Status: str, FileId: int}
        """
        try:
            task_list = requests.get(self.extraction_data.extraction_task_list_url,
                                     headers={"Authorization": f"Client {self._access_token}"}).json()
        except Exception as e:
            print(f"Survey is not found. Please verify the survey exists before attempting again.\n"
                  f"\n"
                  f"ERROR: {e}")
            return False

        return task_list['Extractions']

    def get_target_task_data(self, extraction_id: int, task_name: str):
        file_id = requests.get(f"{os.environ['extraction_url']}/{extraction_id}",
                           headers={"Authorization": f"Client {self._access_token}"}).json()['FileId']
        print("file id", file_id)

        req = requests.get(f"{os.environ['extraction_url']}/file?extractionId={extraction_id}&fileId={file_id}",
                           headers={"Authorization": f"Client {self._access_token}"})
        # print(req.json())
        if req.ok:
            z = zipfile.ZipFile(io.BytesIO(req.content))
            z.extract(f"{task_name}.csv")
            z.close()
        print('sid', self.sid)
        return list(pd.read_csv(f"{task_name}.csv").columns[4:])


    @property
    def sid (self):
        return SharedVariables.sid

    @sid.setter
    def sid(self, sid):
        SharedVariables.sid = sid

    @property
    def extraction_id(self):
        return self.extraction_data.extraction_id





