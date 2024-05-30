import os

import requests

from .apidata import ApiData, ExtractionData

api_data = ApiData()
extraction_data = ExtractionData()


class VoxcoDataGrabber:
    _access_token: str = os.environ['access_token']

    def __init__(self):
        api_data.sid = 10
        print(api_data.sid)
        print(extraction_data.sid)
        api_data.sid = 20
        print(api_data.sid)
        print(extraction_data.sid)
        api_data.survey_name = "12555 Arizona Statewide"
        print(api_data.survey_name)
        print(api_data.prc_id)


    def url(self):
        print(api_data.questions_url)

    def survey_name(self) -> str:
        """
        Pull survey name from the api. This request must be made after the sid is set.
        :return: str: survey name
        """
        api_data.survey_name = requests.get(api_data.survey_url, headers={"Authorization": f"Client {self._access_token}"}).json()['Name']
        # The prc id is auto set inside the API class
        return api_data.survey_name

    def target_task_data(self, task_name: str):
        """
        Get the target task data from the extraction task url. This value will return False if the task is not found.
        :return:
        """
        task_list = requests.get(self.extraction_task_url,
                                   headers={"Authorization": f"Client {self._access_token}"}).json()
        try:
            # for items in task_list['Extractions']:
            #     if items['Name'] == task_name:
            #         return items
            print(task_list['Extractions'])
        except Exception as e:
            print(f"Target task is not found. Please verify the task exists before attempting again.\n"
                  f"\n"
                  f"ERROR: {e}")
            return False

    def get_data(self, task_name: str):
        pass





