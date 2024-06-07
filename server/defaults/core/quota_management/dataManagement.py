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
            case "COM":
                self._com_data = df
            case "Web":
                self._web_data = df
            case "LL":
                self._landline_data = df
            case "Cell":
                self._cell_data = df
            case _:
                self._com_data = pd.DataFrame()
                self._web_data = pd.DataFrame()
                self._landline_data = pd.DataFrame()
                self._cell_data = pd.DataFrame()
        return df

    def create_layout(self):
        data = self.get_data()
        output = {
            f'{self.source} StratumId': [],
            f'{self.source} Status': [],
            f'Criterion': [],
            f'{self.source} Objective': [],
            f'{self.source} Frequency': [],
            f'{self.source} To Do': []
        }
        if self.source == 'COM':
            output['COM Label'] = []
        elif self.source == 'Web':
            output['Web Label'] = []

        print(json.dumps(output, indent=4))

        for item in data:
            if self.source != 'Web':
                output[f'{self.source} StratumId'].append(item['Position'])
                output[f'{self.source} Status'].append('Open' if item['Status'] == 0 else 'Closed')
                if self.source == 'COM':
                    output['COM Label'].append(item['Label'])
                if self.source == "COM" or self.source == "LL":
                    output['Criterion'].append(item['Criterion'].strip())
                if self.source == 'Cell':
                    output['Criterion'].append(item['Criterion'].replace(" AND STYPE=2", '').strip())
                output[f'{self.source} Objective'].append(item['Quota'])
                output[f'{self.source} Frequency'].append(item['Frequence'])
                output[f'{self.source} To Do'].append((item['Quota'] - item['Frequence']) if item['Quota'] > 0 else 0)
            elif self.source == 'Web':
                output['Web StratumId'].append(item['StratumId'])
                output['Web Status'].append(item['Status'])
                output['Web Label'].append(item['Label'])
                output['Criterion'].append(item['Criterion']
                                           .replace(" AND STYPE>2", '')
                                           .replace(" AND STYPE=3", '')
                                           .replace(" AND STYPE=4", ''))
                output['Web Objective'].append(item['Objective'])
                output['Web Frequency'].append(item['Frequency'])
                output['Web To Do'].append((item['Objective'] - item['Frequency']) if item['Objective'] > 0 else 0)
            else:
                return pd.DataFrame()

        return output

    def get_data(self):
        match self.source:
            case "COM":
                return requests.get(
                    self.com_quotas_url,
                    headers={"Authorization": f"Client {self.voxco_access_token}"}
                ).json()
            case "Web":
                return requests.get(
                    self.web_quotas_url,
                    headers={"Authorization": f"Client {self._acuity_access_token}"}
                ).json()
            case "LL":
                return requests.get(
                    self.landline_quotas_url,
                    headers={"Authorization": f"Client {self.voxco_access_token}"}
                ).json()
            case "Cell":
                return requests.get(
                    self.cell_quotas_url,
                    headers={"Authorization": f"Client {self.voxco_access_token}"}
                ).json()
            case _:
                return self.set_data()

    def survey_name(self):
        match self.source:
            case "COM":
                r = requests.get(self.com_survey_url, headers={"Authorization": f"Client {self.voxco_access_token}"}).json()
                return f"{r['Name']} {r['Description']}"
            case "Web":
                return requests.get(self.web_survey_url, headers={"Authorization": f"Client {self._acuity_access_token}"}).json()['Name']
            case "LL":
                r = requests.get(self.landline_survey_url, headers={"Authorization": f"Client {self.voxco_access_token}"}).json()
                return f"{r['Name']} {r['Description']}"
            case "Cell":
                r = requests.get(self.cell_survey_url, headers={"Authorization": f"Client {self.voxco_access_token}"}).json()
                return f"{r['Name']} {r['Description']}"
            case _:
                return

    def merge_data(self):
        df_com = self._com_data
        df_web = self._web_data
        df_ll = self._landline_data
        df_cell = self._cell_data

        print("\033[93m\ncom\033[0m")
        print(df_com.to_string())
        print("\033[93m\nweb\033[0m")
        print(df_web.to_string())
        print("\033[93m\nlandline\033[0m")
        print(df_ll.to_string())
        print("\033[93m\ncell\033[0m")
        print(df_cell.to_string())

        # print(df_com.to_string())
        # print(df_web.to_string())

        try:
            df_comweb = pd.merge(df_com, df_web, on=["Criterion"], how='left')
            df_cwll = pd.merge(df_comweb, df_ll, on=["Criterion"], how='left')
            df_cwlc = pd.merge(df_cwll, df_cell, on="Criterion", how='left')
        except Exception as err:
            print(traceback.format_exc())
            print(err)

        df_cwlc.fillna(0, inplace=True)

        df_cwlc['W%'] = np.round(df_cwlc['Web Frequency'] * 100 / df_cwlc['COM Frequency'], 2)
        df_cwlc['L%'] = np.round(df_cwlc['LL Frequency'] * 100 / df_cwlc['COM Frequency'], 2)
        df_cwlc['C%'] = np.round(df_cwlc['Cell Frequency'] * 100 / df_cwlc['COM Frequency'], 2)
        df_cwlc['COM Frequency'] = df_cwlc['Web Frequency'] + df_cwlc['LL Frequency'] + df_cwlc['Cell Frequency']
        df_cwlc['COM To Do'] = df_cwlc['COM Objective'] - df_cwlc['COM Frequency']

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


