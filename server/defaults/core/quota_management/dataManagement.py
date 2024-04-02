import os
import time
import traceback

from .api import API
import pandas as pd
import numpy as np
import requests
import json

class DataManagement(API):

    def __init__(self):
        super().__init__()
        self._com_data = pd.DataFrame()
        self._web_data = pd.DataFrame()
        self._landline_data = pd.DataFrame()
        self._cell_data = pd.DataFrame()
        self._source = None


    def set_data(self):
        df = pd.DataFrame(self.create_layout())
        match self.source:
            case "com":
                self._com_data = df
            case "web":
                self._web_data = df
            case "landline":
                self._landline_data = df
            case "cell":
                self._cell_data = df
            case _:
                self._com_data = pd.DataFrame()
                self._web_data = pd.DataFrame()
                self._landline_data = pd.DataFrame()
                self._cell_data = pd.DataFrame()
        return df

    def create_layout(self):
        data = self.get_data()

        match self.source:  # sift through the data to pull the data we want into a dict
            case "com":
                output = {
                    'COM StratumId': [],
                    'COM Status': [],
                    'Criterion': [],
                    'COM Objective': [],
                    'COM Frequency': [],
                    'COM To Do': []
                }
                for item in data:
                    output['COM StratumId'].append(item['Position'])
                    output['COM Status'].append('Open' if item['Status'] == 0 else 'Closed')
                    output['Criterion'].append(item['Criterion'].replace(" AND STYPE=2", ''))  # STYPE is explicit, not needed in our text
                    output['COM Objective'].append(item['Quota'])
                    output['COM Frequency'].append(item['Frequence'])
                    output['COM To Do'].append((item['Quota'] - item['Frequence']) if item['Quota'] > 0 else 0)  # i dont know why i did this in this way
            case 'web':
                output = {
                    'Web StratumId': [],
                    'Web Status': [],
                    'Criterion': [],
                    'Web Objective': [],
                    'Web Frequency': [],
                    'Web To Do': []
                }
                for item in data:
                    output['Web StratumId'].append(item['StratumId'])
                    output['Web Status'].append(item['Status'])
                    output['Criterion'].append(item['Criterion']
                                               .replace(" AND STYPE>2", '')
                                               .replace(" AND STYPE=3", '')
                                               .replace(" AND STYPE=4", '')
                                               )  # STYPE is explicit, not needed in our text
                    output['Web Objective'].append(item['Objective'])
                    output['Web Frequency'].append(item['Frequency'])
                    output['Web To Do'].append((item['Objective'] - item['Frequency']) if item['Objective'] > 0 else 0)  # i dont know why i did this in this way
            case 'landline':
                output = {
                    'LL StratumId': [],
                    'LL Status': [],
                    'Criterion': [],
                    'LL Objective': [],
                    'LL Frequency': [],
                    'LL To Do': []
                }
                for item in data:
                    output['LL StratumId'].append(item['Position'])
                    output['LL Status'].append('Open' if item['Status'] == 0 else 'Closed')
                    output['Criterion'].append(item['Criterion'])
                    output['LL Objective'].append(item['Quota'])
                    output['LL Frequency'].append(item['Frequence'])
                    output['LL To Do'].append((item['Quota'] - item['Frequence']) if item['Quota'] > 0 else 0)  # i dont know why i did this in this way
            case 'cell':
                output = {
                    'Cell StratumId': [],
                    'Cell Status': [],
                    'Criterion': [],
                    'Cell Objective': [],
                    'Cell Frequency': [],
                    'Cell To Do': []
                }
                for item in data:
                    output['Cell StratumId'].append(item['Position'])
                    output['Cell Status'].append('Open' if item['Status'] == 0 else 'Closed')
                    output['Criterion'].append(item['Criterion'].replace(" AND STYPE=2", ''))  # STYPE is explicit, not needed in our text
                    output['Cell Objective'].append(item['Quota'])
                    output['Cell Frequency'].append(item['Frequence'])
                    output['Cell To Do'].append((item['Quota'] - item['Frequence']) if item['Quota'] > 0 else 0)  # i dont know why i did this in this way
            case _:
                return pd.DataFrame()
        return output

    def get_data(self):
        match self.source:
            case "com":
                return requests.get(
                    self.com_quotas_url,
                    headers={"Authorization": f"Client {self.voxco_access_token}"}
                ).json()
            case "web":
                return requests.get(
                    self.web_quotas_url,
                    headers={"Authorization": f"Client {self._acuity_access_token}"}
                ).json()
            case "landline":
                return requests.get(
                    self.landline_quotas_url,
                    headers={"Authorization": f"Client {self.voxco_access_token}"}
                ).json()
            case "cell":
                return requests.get(
                    self.cell_quotas_url,
                    headers={"Authorization": f"Client {self.voxco_access_token}"}
                ).json()
            case _:
                return self.set_data()

    def survey_name(self):
        match self.source:
            case 'com':
                r = requests.get(self.com_survey_url, headers={"Authorization": f"Client {self.voxco_access_token}"}).json()
                return f"{r['Name']} {r['Description']}"
            case 'web':
                return requests.get(self.web_survey_url, headers={"Authorization": f"Client {self._acuity_access_token}"}).json()['Name']
            case 'landline':
                r = requests.get(self.landline_survey_url, headers={"Authorization": f"Client {self.voxco_access_token}"}).json()
                return f"{r['Name']} {r['Description']}"
            case 'cell':
                r = requests.get(self.cell_survey_url, headers={"Authorization": f"Client {self.voxco_access_token}"}).json()
                return f"{r['Name']} {r['Description']}"
            case _:
                return

    def clean_names(self):
        df = self.set_data()
        return df

    def merge_data(self):
        df_com = self._com_data
        df_web = self._web_data
        df_ll = self._landline_data
        df_cell = self._cell_data

        try:
            df_comweb = pd.merge(df_com, df_web, on=["Criterion"], how='left')
            df_cwll = pd.merge(df_comweb, df_ll, on=["Criterion"], how='left')
            df_cwlc = pd.merge(df_cwll, df_cell, on="Criterion", how='left')
        except Exception as err:
            print(traceback.format_exc())
            print(err)

        df_cwlc['W%'] = np.round(df_cwlc['Web Frequency'] * 100 / df_cwlc['COM Frequency'], 2)
        df_cwlc['L%'] = np.round(df_cwlc['LL Frequency'] * 100 / df_cwlc['COM Frequency'], 2)
        df_cwlc['C%'] = np.round(df_cwlc['Cell Frequency'] * 100 / df_cwlc['COM Frequency'], 2)

        self.reset()

        return df_cwlc

    @property
    def source(self):
        return self._source

    @source.setter
    def source(self, source):
        self._source = source

    def reset(self):
        self._com_data = pd.DataFrame()
        self._web_data = pd.DataFrame()
        self._landline_data = pd.DataFrame()
        self._cell_data = pd.DataFrame()
        self._source = None


