import os
import time

from .api import API
import pandas as pd
import numpy as np
import requests
import json

class DataManagement(API):

    def __init__(self):
        super().__init__()
        self._web_data = pd.DataFrame()
        self._landline_data = pd.DataFrame()
        self._cell_data = pd.DataFrame()
        self._source = None

    def set_data(self):
        data = self.create_layout()
        df = pd.DataFrame(data)
        match self.source:
            case "web":
                self._web_data = df
            case "landline":
                self._landline_data = df
            case "cell":
                self._cell_data = df
            case _:
                self._web_data = pd.DataFrame()
                self._landline_data = pd.DataFrame()
                self._cell_data = pd.DataFrame()
        df.to_csv(f"{self.source}.csv", encoding='utf-8', index=False)
        return df

    def get_data(self):
        match self.source:
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

    def create_layout(self):
        output = {
            'StratumId': [],
            'Status': [],
            'Criterion': [],
            'Objective': [],
            'Frequency': [],
            'To Do': []
        }

        data = self.get_data()

        match self.source:
            case 'web':
                for item in data:
                    output['StratumId'].append(item['StratumId'])
                    output['Status'].append(item['Status'])
                    output['Criterion'].append(item['Criterion'].replace(" AND STYPE>2", ''))
                    output['Objective'].append(item['Objective'])
                    output['Frequency'].append(item['Frequency'])
                    output['To Do'].append((item['Objective'] - item['Frequency']) if item['Objective'] > 0 else 0)
            case 'landline' | 'cell':
                for item in data:
                    output['StratumId'].append(item['Position'])
                    output['Status'].append('Open' if item['Status'] == 0 else 'Closed')
                    output['Criterion'].append(item['Criterion'].replace(" AND STYPE=2", ''))
                    output['Objective'].append(item['Quota'])
                    output['Frequency'].append(item['Frequence'])
                    output['To Do'].append((item['Quota'] - item['Frequence']) if item['Quota'] > 0 else 0)
            case _:
                return output
        return output

    def survey_name(self):
        match self.source:
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
        df1 = self._web_data
        df2 = self._landline_data
        df3 = self._cell_data

        d = pd.merge(df1, df2, on=["Criterion"])
        d['Objective'] = d['Objective_x'] + d['Objective_y']
        d['Frequency'] = d['Frequency_x'] + d['Frequency_y']
        d['To Do'] = d["To Do_x"] + d['To Do_y']
        d.rename(columns={
            'Frequency_x': 'Web Frequency',
            'Frequency_y': 'LL Frequency',
        }, inplace=True)
        d.drop(['Objective_x', 'Objective_y', 'To Do_x', 'To Do_y'], axis=1, inplace=True)

        d2 = pd.merge(d, df3, on="Criterion")
        d2['Objective'] = d2['Objective_x'] + d2['Objective_y']
        d2['Frequency'] = d2['Frequency_x'] + d2['Frequency_y']
        d2['To Do'] = d2["To Do_x"] + d2['To Do_y']
        d2.drop(['StratumId_x', 'Status_x', 'StratumId_y', 'Status_y', 'StratumId', 'Status', 'Frequency_x', 'Objective_x', 'Objective_y','To Do_x', 'To Do_y'], axis=1, inplace=True)

        # d2.rename(columns={
        #     "StratumId_x": "Web StratumId",
        #     "Status_x": "Web Status",
        #     "StratumId_y": "LL StratumId",
        #     "Status_y": "LL Status",
        #     "StratumId": "Cell StratumId",
        #     "Status": "Cell Status"
        # }, inplace=True)

        d2.rename(columns={
            'Frequency_y': 'Cell Frequency'
        }, inplace=True)

        df = d2[[
            # 'Web StratumId',
            # 'Web Status',
            # 'LL StratumId',
            # 'LL Status',
            # 'Cell StratumId',
            # 'Cell Status',
            'Criterion',
            'Objective',
            'Frequency',
            'To Do',
            'Web Frequency',
            'LL Frequency',
            'Cell Frequency'
        ]]

        return df

    @property
    def source(self):
        return self._source

    @source.setter
    def source(self, source):
        self._source = source


