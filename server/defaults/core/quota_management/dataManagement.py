import os
import time
import traceback

from .api import API
import pandas as pd
import numpy as np
import requests
import json
from server.defaults.utils.logger_config import logger


class DataManagement(API):

    def __init__(self):
        super().__init__()
        self._com_data = pd.DataFrame()
        self._web_data = pd.DataFrame()
        self._panel_data = pd.DataFrame()
        self._t2w_data = pd.DataFrame()
        self._landline_data = pd.DataFrame()
        self._cell_data = pd.DataFrame()
        self._source = None

    def set_data(self):  # TODO panel and t2w
        if self.source != 'Web':
            df = pd.DataFrame(self.create_layout())

        match self.source:
            case "COM":
                self._com_data = df
            case "Web":
                self._panel_data, self._t2w_data = pd.DataFrame(self.create_layout()[0]), pd.DataFrame(self.create_layout()[1])
                # print(self._panel_data.to_string())
                # print(self._t2w_data.to_string())
                return self._panel_data, self._t2w_data
            case "LL":
                self._landline_data = df
            case "Cell":
                self._cell_data = df
            case _:
                self._com_data = pd.DataFrame()
                self._web_data = pd.DataFrame()
                self._panel_data = pd.DataFrame()
                self._t2w_data = pd.DataFrame()
                self._landline_data = pd.DataFrame()
                self._cell_data = pd.DataFrame()

        # print(df.to_string())
        return df

    def create_layout(self):
        data = self.get_data()
        # if self.source == "COM":
            # print(self.source)
            # print(self.com_sid)
            # # print(self.sid)
            # print(json.dumps(data, indent=4))
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
            # output['Web Label'] = []
            output = {
                'panel': {
                    f'Panel StratumId': [],
                    f'Panel Status': [],
                    f'Panel Label': [],
                    f'Criterion': [],
                    f'Panel Objective': [],
                    f'Panel Frequency': [],
                    f'Panel To Do': []
                },
                't2w': {
                    f'T2W StratumId': [],
                    f'T2W Status': [],
                    f'T2W Label': [],
                    f'Criterion': [],
                    f'T2W Objective': [],
                    f'T2W Frequency': [],
                    f'T2W To Do': []
                }
            }

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

                if "STYPE=3" in item['Criterion']:
                    output['panel']['Panel StratumId'].append(item['StratumId'])
                    output['panel']['Panel Status'].append(item['Status'])
                    output['panel']['Panel Label'].append(item['Label'])
                    output['panel']['Criterion'].append(item['Criterion']
                                               .replace(" AND STYPE>2", '')
                                               .replace(" AND STYPE=3", '')
                                               .replace(" AND STYPE=4", ''))
                    output['panel']['Panel Objective'].append(item['Objective'])
                    output['panel']['Panel Frequency'].append(item['Frequency'])
                    output['panel']['Panel To Do'].append((item['Objective'] - item['Frequency']) if item['Objective'] > 0 else 0)

                elif "STYPE=4" in item['Criterion']:
                    output['t2w']['T2W StratumId'].append(item['StratumId'])
                    output['t2w']['T2W Status'].append(item['Status'])
                    output['t2w']['T2W Label'].append(item['Label'])
                    output['t2w']['Criterion'].append(item['Criterion']
                                               .replace(" AND STYPE>2", '')
                                               .replace(" AND STYPE=3", '')
                                               .replace(" AND STYPE=4", ''))
                    output['t2w']['T2W Objective'].append(item['Objective'])
                    output['t2w']['T2W Frequency'].append(item['Frequency'])
                    output['t2w']['T2W To Do'].append((item['Objective'] - item['Frequency']) if item['Objective'] > 0 else 0)

            else:
                return pd.DataFrame()
        if self.source == 'Web':
            # print(json.dumps(output, indent=4))
            return output['panel'], output['t2w']
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
        df = self._com_data
        df_com = self._com_data
        df_panel = self._panel_data
        df_t2w = self._t2w_data
        df_ll = self._landline_data
        df_cell = self._cell_data


        # print("\033[93m\ncom\033[0m")
        # print(df_com.to_string())
        #
        # print("\033[93m\npanel\033[0m")
        # print(df_panel.to_string())
        #
        # print("\033[93m\nt2w\033[0m")
        # print(df_t2w.to_string())
        #
        # print("\033[93m\nlandline\033[0m")
        # print(df_ll.to_string())
        #
        # print("\033[93m\ncell\033[0m")
        # print(df_cell.to_string())
        #
        # print(df_com.to_string())
        
        df = pd.merge(df, df_panel, on=["Criterion"], how='left')
        df = pd.merge(df, df_t2w, on=["Criterion"], how='left')
        df = pd.merge(df, df_ll, on=["Criterion"], how='left')
        df = pd.merge(df, df_cell, on=["Criterion"], how='left')
        df = df[df["COM Objective"] != 0].reset_index(drop=True)
            

        # try:
        #     df_com_panel_merge = pd.merge(df_com, df_panel, on=["Criterion"], how='left')
        #     df_com_panel_tw2_merge = pd.merge(df_com_panel_merge, df_t2w, on=["Criterion"], how='left')
        #     df_cptll_merge = pd.merge(df_com_panel_tw2_merge, df_ll, on=["Criterion"], how='left')
        #     df = pd.merge(df_cptll_merge, df_cell, on=["Criterion"], how='left')
        #     df_comweb = pd.merge(df_com, df_web, on=["Criterion"], how='left')
        #     df_cwll = pd.merge(df_comweb, df_ll, on=["Criterion"], how='left')
        #     df = pd.merge(df_cwll, df_cell, on="Criterion", how='left')
        # except Exception as err:
        #     print(traceback.format_exc())
        #     print(err)

        df.fillna(0, inplace=True)

        # Web Percent
        df['Web Frequency'] = df['Panel Frequency'] + df['T2W Frequency']
        df['Phone Frequency'] = df['LL Frequency'] + df['Cell Frequency']

        # COM Calculated Frequency
        df['COM Frequency'] = df['Web Frequency'] + df['Phone Frequency']
        df['COM To Do'] = df['COM Objective'] - df['COM Frequency']

        df['W%'] = np.round(df['Web Frequency'] * 100 / df['COM Frequency'], 2)
        df['P%'] = np.round(df['Panel Frequency'] * 100 / df['COM Frequency'], 2)
        df['T%'] = np.round(df['T2W Frequency'] * 100 / df['COM Frequency'], 2)
        df['Phone%'] = np.round((df['LL Frequency'] + df['Cell Frequency']) * 100 / df['COM Frequency'], 2)

        #Phone %
        df['L%'] = np.round(df['LL Frequency'] * 100 / df['COM Frequency'], 2)
        df['C%'] = np.round(df['Cell Frequency'] * 100 / df['COM Frequency'], 2)
        df['Phone%'] = np.round((df['LL Frequency'] + df['Cell Frequency']) * 100 / df['COM Frequency'], 2)



        self.reset()

        print(df.to_string())
        print()
        print()
        print(df.shape[0])

        return df

    @property
    def source(self):
        return self._source

    @source.setter
    def source(self, source):
        self._source = source

    def reset(self):
        self._com_data = pd.DataFrame()
        self._web_data = pd.DataFrame()
        self._panel_data = pd.DataFrame()
        self._t2w_data = pd.DataFrame()
        self._landline_data = pd.DataFrame()
        self._cell_data = pd.DataFrame()
        self._source = None


