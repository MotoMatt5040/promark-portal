import io
import json
import os
import zipfile

import numpy as np
import pandas as pd
import requests

from .AcuityAPI import AcuityAPI


class AcuityData(AcuityAPI):
    __TOTALS = {
        "STRONG REPUBLICAN": {"REPUBLICAN": [1, 2], "INDEPENDENT": [3, 5], "DEMOCRAT": [6, 7]},
        "NOT SO STRONG REPUBLICAN": {"REPUBLICAN": [1, 2], "INDEPENDENT": [3, 5], "DEMOCRAT": [6, 7]},
        "INDEPENDENT LEANING REPUBLICAN": {"REPUBLICAN": [1, 2], "INDEPENDENT": [3, 5], "DEMOCRAT": [6, 7]},
        "INDEPENDENT": {"REPUBLICAN": [1, 2], "INDEPENDENT": [3, 5], "DEMOCRAT": [6, 7]},
        "INDEPENDENT LEANING DEMOCRAT": {"REPUBLICAN": [1, 2], "INDEPENDENT": [3, 5], "DEMOCRAT": [6, 7]},
        "NOT SO STRONG DEMOCRAT": {"REPUBLICAN": [1, 2], "INDEPENDENT": [3, 5], "DEMOCRAT": [6, 7]},
        "STRONG DEMOCRAT": {"REPUBLICAN": [1, 2], "INDEPENDENT": [3, 5], "DEMOCRAT": [6, 7]},

        "STRONGLY CONSERVATIVE": {"CONSERVATIVE": [1, 2], "LIBERAL": [4, 5]},
        "SOMEWHAT CONSERVATIVE": {"CONSERVATIVE": [1, 2], "LIBERAL": [4, 5]},
        "MODERATE": {"CONSERVATIVE": [1, 2], "LIBERAL": [4, 5]},
        "SOMEWHAT LIBERAL": {"CONSERVATIVE": [1, 2], "LIBERAL": [4, 5]},
        "STRONGLY LIBERAL": {"CONSERVATIVE": [1, 2], "LIBERAL": [4, 5]},

        "STRONGLY SUPPORT": {"SUPPORT": [1, 2], "OPPOSE": [3, 4]},
        "SOMEWHAT SUPPORT": {"SUPPORT": [1, 2], "OPPOSE": [3, 4]},
        "SOMEWHAT OPPOSE": {"SUPPORT": [1, 2], "OPPOSE": [3, 4]},
        "STRONGLY OPPOSE": {"SUPPORT": [1, 2], "OPPOSE": [3, 4]},

        "STRONGLY APPROVE": {"APPROVE": [1, 2], "DISAPPROVE": [3, 4]},
        "SOMEWHAT APPROVE": {"APPROVE": [1, 2], "DISAPPROVE": [3, 4]},
        "SOMEWHAT DISAPPROVE": {"APPROVE": [1, 2], "DISAPPROVE": [3, 4]},
        "STRONGLY DISAPPROVE": {"APPROVE": [1, 2], "DISAPPROVE": [3, 4]},

        "STRONGLY RIGHT DIRECTION": {"RIGHT DIRECTION": [1, 2], "WRONG TRACK": [3, 4]},
        "SOMEWHAT RIGHT DIRECTION": {"RIGHT DIRECTION": [1, 2], "WRONG TRACK": [3, 4]},
        "SOMEWHAT WRONG TRACK": {"RIGHT DIRECTION": [1, 2], "WRONG TRACK": [3, 4]},
        "STRONGLY WRONG TRACK": {"RIGHT DIRECTION": [1, 2], "WRONG TRACK": [3, 4]},

        'STRONGLY AGREE': {"AGREE": [1, 2], "DISAGREE": [3, 4]},
        'SOMEWHAT AGREE': {"AGREE": [1, 2], "DISAGREE": [3, 4]},
        'SOMEWHAT DISAGREE': {"AGREE": [1, 2], "DISAGREE": [3, 4]},
        'STRONGLY DISAGREE': {"AGREE": [1, 2], "DISAGREE": [3, 4]},

        'MUCH MORE LIKELY': {"MORE LIKELY": [1, 2], "LESS LIKELY": [3, 4]},
        'SOMEWHAT MORE LIKELY': {"MORE LIKELY": [1, 2], "LESS LIKELY": [3, 4]},
        'SOMEWHAT LESS LIKELY': {"MORE LIKELY": [1, 2], "LESS LIKELY": [3, 4]},
        'MUCH LESS LIKELY': {"MORE LIKELY": [1, 2], "LESS LIKELY": [3, 4]},

        'MUCH BETTER': {"BETTER": [1, 2], "WORSE": [3, 4]},
        'SOMEWHAT BETTER': {"BETTER": [1, 2], "WORSE": [3, 4]},
        'SOMEWHAT WORSE': {"BETTER": [1, 2], "WORSE": [3, 4]},
        'MUCH WORSE': {"BETTER": [1, 2], "WORSE": [3, 4]},

        'MUCH MORE CONFIDENT': {"MORE CONFIDENT": [1, 2], "LESS CONFIDENT": [3, 4]},
        'SOMEWHAT MORE CONFIDENT': {"MORE CONFIDENT": [1, 2], "LESS CONFIDENT": [3, 4]},
        'SOMEWHAT LESS CONFIDENT': {"MORE CONFIDENT": [1, 2], "LESS CONFIDENT": [3, 4]},
        'MUCH LESS CONFIDENT': {"MORE CONFIDENT": [1, 2], "LESS CONFIDENT": [3, 4]},

        # TODO: make the code to wear it is uploaded to a webpage where we can check off how we want to see totals.
        # TODO: The reason for this is that sometimes we may want the same totals worded differently.
        'VERY LIKELY': {"LIKELY": [1, 2], "UNLIKELY": [3, 4]},
        'SOMEWHAT LIKELY': {"LIKELY": [1, 2], "UNLIKELY": [3, 4]},
        'SOMEWHAT UNLIKELY': {"LIKELY": [1, 2], "UNLIKELY": [3, 4]},
        'VERY UNLIKELY': {"LIKELY": [1, 2], "UNLIKELY": [3, 4]},

        'EXTREMELY IMPORTANT': {"EXTREMELY IMPORTANT": [1, 2], "NOT IMPORTANT": [3, 4]},
        'VERY IMPORTANT': {"EXTREMELY IMPORTANT": [1, 2], "NOT IMPORTANT": [3, 4]},
        'SOMEWHAT IMPORTANT': {"EXTREMELY IMPORTANT": [1, 2], "NOT IMPORTANT": [3, 4]},
        'NOT AT ALL IMPORTANT': {"EXTREMELY IMPORTANT": [1, 2], "NOT IMPORTANT": [3, 4]},

        'VERY FAMILIAR': {"FAMILIAR": [1, 2], "UNFAMILIAR": [3, 4]},
        'SOMEWHAT FAMILIAR': {"FAMILIAR": [1, 2], "UNFAMILIAR": [3, 4]},
        'ONLY HEARD THEIR NAME': {"FAMILIAR": [1, 2], "UNFAMILIAR": [3, 4]},
        'HAVE NEVER HEARD OF': {"FAMILIAR": [1, 2], "UNFAMILIAR": [3, 4]},

        'VERY CLOSELY': {'CLOSELY': [1, 2], 'NOT CLOSELY': [3, 4]},
        'SOMEWHAT CLOSELY': {'CLOSELY': [1, 2], 'NOT CLOSELY': [3, 4]},

        'VERY FAVORABLE': {'FAVORABLE': [1, 2], 'UNFAVORABLE': [3, 4]},
        'SOMEWHAT FAVORABLE': {'FAVORABLE': [1, 2], 'UNFAVORABLE': [3, 4]},
        'SOMEWHAT UNFAVORABLE': {'FAVORABLE': [1, 2], 'UNFAVORABLE': [3, 4]},
        'VERY UNFAVORABLE': {'FAVORABLE': [1, 2], 'UNFAVORABLE': [3, 4]},

        'APPLIES A GREAT DEAL': {'APPLIES': [1, 2], 'DOES NOT APPLY': [3, 4]},
        'SOMEWHAT APPLIES': {'APPLIES': [1, 2], 'DOES NOT APPLY': [3, 4]},
        'DOES NOT REALLY APPLY': {'APPLIES': [1, 2], 'DOES NOT APPLY': [3, 4]},
        'DOES NOT APPLY AT ALL': {'APPLIES': [1, 2], 'DOES NOT APPLY': [3, 4]},

        'VERY POSITIVE': {'POSITIVE': [1, 2], 'NEGATIVE': [3, 4]},
        'SOMEWHAT POSITIVE': {'POSITIVE': [1, 2], 'NEGATIVE': [3, 4]},
        'SOMEWHAT NEGATIVE': {'POSITIVE': [1, 2], 'NEGATIVE': [3, 4]},
        'VERY NEGATIVE': {'POSITIVE': [1, 2], 'NEGATIVE': [3, 4]},

        'VERY REASONABLE': {'REASONABLE': [1, 2], 'UNREASONABLE': [3, 4]},
        'SOMEWHAT REASONABLE': {'REASONABLE': [1, 2], 'UNREASONABLE': [3, 4]},
        'SOMEWHAT UNREASONABLE': {'REASONABLE': [1, 2], 'UNREASONABLE': [3, 4]},
        'VERY UNREASONABLE': {'REASONABLE': [1, 2], 'UNREASONABLE': [3, 4]},

        'VERY UNIQUE': {'UNIQUE': [1, 2], 'NOT UNIQUE': [3, 4]},
        'SOMEWHAT UNIQUE': {'UNIQUE': [1, 2], 'NOT UNIQUE': [3, 4]},
        'NOT VERY UNIQUE': {'UNIQUE': [1, 2], 'NOT UNIQUE': [3, 4]},
        'NOT AT ALL UNIQUE': {'UNIQUE': [1, 2], 'NOT UNIQUE': [3, 4]},

        'VERY CONVINCING': {'CONVINCING': [1, 2], 'NOT CONVINCING': [3, 4]},
        'SOMEWHAT CONVINCING': {'CONVINCING': [1, 2], 'NOT CONVINCING': [3, 4]},
        'NOT VERY CONVINCING': {'CONVINCING': [1, 2], 'NOT CONVINCING': [3, 4]},
        'NOT AT ALL CONVINCING': {'CONVINCING': [1, 2], 'NOT CONVINCING': [3, 4]},

        'VERY CONCERNED': {'CONCERNED': [1, 2], 'NOT CONCERNED': [3, 4]},
        'SOMEWHAT CONCERNED': {'CONCERNED': [1, 2], 'NOT CONCERNED': [3, 4]},
        'NOT VERY CONCERNED': {'CONCERNED': [1, 2], 'NOT CONCERNED': [3, 4]},
        'NOT AT ALL CONCERNED': {'CONCERNED': [1, 2], 'NOT CONCERNED': [3, 4]},

        'VERY AWARE': {'AWARE': [1, 2], 'NOT AWARE': [3, 4]},
        'SOMEWHAT AWARE': {'AWARE': [1, 2], 'NOT AWARE': [3, 4]},
        'NOT VERY AWARE': {'AWARE': [1, 2], 'NOT AWARE': [3, 4]},
        'NOT AT ALL AWARE': {'AWARE': [1, 2], 'NOT AWARE': [3, 4]},

        'VERY WILLING': {'WILLING': [1, 2], 'NOT WILLING': [3, 4]},
        'WILLING': {'WILLING': [1, 2], 'NOT WILLING': [3, 4]},
        'SLIGHTLY WILLING': {'WILLING': [1, 2], 'NOT WILLING': [3, 4]},
        'NOT AT ALL WILLING': {'WILLING': [1, 2], 'NOT WILLING': [3, 4]},

        'GREAT DEAL': {'GREAT DEAL': [1, 2], 'NOT GREAT DEAL': [3, 4]},
        'SOMEWHAT': {'GREAT DEAL': [1, 2], 'NOT GREAT DEAL': [3, 4]},

        'MUCH MORE LIKELY TO PURCHASE': {'MORE LIKELY': [1, 2], 'LESS LIKELY': [4, 5]},
        'SLIGHTLY MORE LIKELY TO PURCHASE': {'MORE LIKELY': [1, 2], 'LESS LIKELY': [4, 5]},
        'SLIGHTLY LESS LIKELY TO PURCHASE': {'MORE LIKELY': [1, 2], 'LESS LIKELY': [4, 5]},
        'MUCH LESS LIKELY TO PURCHASE': {'MORE LIKELY': [1, 2], 'LESS LIKELY': [4, 5]},

        "STRONGLY DETERMINED": {'DETERMINED BY PEOPLE': [1, 2], 'CREATED IN CONSTITUTION': [3, 4]},
        "SOMEWHAT DETERMINED": {'DETERMINED BY PEOPLE': [1, 2], 'CREATED IN CONSTITUTION': [3, 4]},
        "SOMEWHAT CREATED": {'DETERMINED BY PEOPLE': [1, 2], 'CREATED IN CONSTITUTION': [3, 4]},
        "STRONGLY CREATED": {'DETERMINED BY PEOPLE': [1, 2], 'CREATED IN CONSTITUTION': [3, 4]},
    }

    SKIP_TABLE = []

    @staticmethod
    def order():
        try:
            return list(pd.read_csv("order.csv").columns[4:])
        except:
            return []

    def __init__(self):
        super().__init__()
        self._variables = None
        self._questions = None
        self._extraction_task = None
        self._order_extraction_id = None
        self._dat_extraction_id = None
        self._prc_id = None
        self._dat_extraction_id = None
        self.sid = None
        self._dat_id = None

    def get_survey_name(self):
        survey_name = requests.get(self.survey_url, headers={"Authorization": f"Client {self._access_token}"}).json()['Name']
        self._prc_id = survey_name[:survey_name.find(' ')]
        return survey_name

    def set_sid(self, sid):
        self.sid = sid
        return sid

    def set_skips(self, skips):
        self.SKIP_TABLE = skips

    def order_data(self):
        if os.path.exists('order.csv'):
            os.remove('order.csv')

        if self.order_extraction_id is None:
            return False

        order_extraction_file_id_req = requests.get(self.order_extraction_res_url, headers={"Authorization": f"Client {self._access_token}"}).json()

        self.order_url = order_extraction_file_id_req["FileId"]
        self._order_extraction_id = None

        # this returns a .zip file
        order_req = requests.get(self.order_url, headers={"Authorization": f"Client {self._access_token}"})

        if order_req.ok:
            z = zipfile.ZipFile(io.BytesIO(order_req.content))
            z.extract("order.csv")
            z.close()

    def request_data(self):

        self._dat_id = f"{self._prc_id}dat"
        self._extraction_task = requests.get(self.extraction_task_url,
                                             headers={"Authorization": f"Client {self._access_token}"}).json()
        for items in self._extraction_task['Extractions']:
            match items["Name"].lower():
                case "order":
                    self.order_extraction_id = items["ExtractionId"]
                case 'testdat':
                    self.dat_extraction_id = items["ExtractionId"]
                    requests.delete(self.dat_extraction_res_url,
                                    headers={"Authorization": f"Client {self._access_token}"})
                case _:
                    continue
        self.order_data()

    def question_names(self):
        self._variables = requests.get(
            self.variables_url,  headers={"Authorization": f"Client {self._access_token}"}).json()
        __name = []
        skips = ["RID2", "VEND", "T1", "BATCH", "PRACE", "LRACE", "PARTIAL", "LAGE", "QAGE_1", "ACTAG", "INT99", "QUAL", "T2", "SPEEDER", "SURLEN"]
        for item in self._variables:
            if item['Name'] in skips or "FIL1" in item["Name"] or "FIL2" in item["Name"]:
                continue
            __name.append(item["Name"])
        return __name

    def blocks(self):
        __blocks = []
        for __item in self._variables:
            __blocks.append(__item)
        return __blocks

    def data(self):
        self.question_names()
        self._questions = requests.get(
            self.questions_url, headers={"Authorization": f"Client {self._access_token}"}).json()
        __data = {}
        for __block in self.blocks():
            __name = __block['Name']
            __data[__name] = {
                'question': __block['QuestionText'],
                'text': __block['Text'],
                'choices': {},
                'qual': {
                    'label': None,
                    'logic': None
                },
                'codewidth': 1,
                'maxchoice': 1,
                'rank': False,
                'startcolumn': None,
                'endcolumn': None,
                'rows': [],
                'totals': None
            }

            if __block['MaxLength'] == 255:
                __block['MaxLength'] = 2
            __data[__name]['codewidth'] = __block['MaxLength']
            __data[__name]['maxchoice'] = __block['MaxAnswers']
            if __block['MaxAnswers'] > 1:
                __data[__name]['rank'] = True
            for __label in __block['Choices']:
                __data[__name]['choices'][__label['Code']] = __label['Text'].upper().replace("/", "//")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("\u2019", "'")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("&nbsp;", " ")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("&NBSP;", " ")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("\u2026", "...")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("  ", " ")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("MORELIKELY", "MORE LIKELY")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("LESSLIKELY", "LESS LIKELY")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("STRONGLYAGREE", "STRONGLY AGREE")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("SOMEWHATAGREE", "SOMEWHAT AGREE")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("SOMEWHATDISAGREE", "SOMEWHAT DISAGREE")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("STRONGLYDISAGREE", "STRONGLY DISAGREE")
                __data[__name]['choices'][__label['Code']] = \
                    __data[__name]['choices'][__label['Code']].replace("\u200b", "")

        __data = self.fix_fills_skips(__data)

        return __data

    def fix_fills_skips(self, data):
        __data = data
        __fills, __skip = self.fills_skips()
        for qname in __data:
            if __data[qname]['question'] is not None:
                __data[qname]['question'] = __data[qname]['question'].replace("/", "//")
                __data[qname]['question'] = __data[qname]['question'].replace("\u2019", "'")
                __data[qname]['question'] = __data[qname]['question'].replace("&nbsp;", " ")
                __data[qname]['question'] = __data[qname]['question'].replace("&NBSP;", " ")
                __data[qname]['question'] = __data[qname]['question'].replace("\u2026", "...")
                __data[qname]['question'] = __data[qname]['question'].replace("  ", " ")
                __data[qname]['question'] = __data[qname]['question'].replace("\u200b", "")
                __data[qname]['question'] = __data[qname]['question'].replace("(Select all that apply)", "")
                __data[qname]['question'] = __data[qname]['question'].replace("None", "")
            if __data[qname]['text'] is not None:
                __data[qname]['text'] = __data[qname]['text'].replace("/", "//")
                __data[qname]['text'] = __data[qname]['text'].replace("\u2019", "'")
                __data[qname]['text'] = __data[qname]['text'].replace("&nbsp;", " ")
                __data[qname]['text'] = __data[qname]['text'].replace("&NBSP;", " ")
                __data[qname]['text'] = __data[qname]['text'].replace("\u2026", "...")
                __data[qname]['text'] = __data[qname]['text'].replace("  ", " ")
                __data[qname]['text'] = __data[qname]['text'].replace("\u200b", "")
                __data[qname]['text'] = __data[qname]['text'].replace("(Select all that apply)", "")
                __data[qname]['text'] = __data[qname]['text'].replace("None", "")

            for q in __fills:
                try:
                    if f"[{q}FIL1]" in __data[qname]['question'] or f"[{q}FIL2]" in __data[qname]['question']:
                        __data[qname]['question'] = __data[qname]['question'].replace(f"[{q}FIL1]", __fills[q])
                        __data[qname]['question'] = __data[qname]['question'].replace(f"[{q}FIL2]", __fills[q])
                except:
                    try:
                        if f"[{q}FIL1]" in __data[qname]['question'] or f"[{q}FIL2]" in __data[qname]['question']:
                            __data[qname]['text'] = __data[qname]['text'].replace(f"[{q}FIL1]", __fills[q])
                            __data[qname]['text'] = __data[qname]['text'].replace(f"[{q}FIL2]", __fills[q])
                    except:
                        pass
            if __data[qname]['text'] != "":
                text = __data[qname]['question'].replace("  ", " ")
                __data[qname]['question'] = __data[qname]['text'].replace("  ", " ")
                __data[qname]['text'] = text.replace("  ", " ")

        __data = self.columns(__data)
        for q in __skip:
            try:
                __data[q]['qual']['label'] = __skip[q]
                __qual_label = __skip[q][0:__skip[q].find('=')]
                __qual_choice = __skip[q][__skip[q].find('=') + 1:]
                if __data[__qual_label]['codewidth'] > 1:
                    __data[q]['qual']['logic'] = f"R({__data[__qual_label]['startcolumn']}:" \
                                                 f"{__data[__qual_label]['endcolumn']},{__qual_choice})"
                else:
                    __data[q]['qual']['logic'] = f"{__data[__qual_label]['startcolumn']}-{__qual_choice}"
            except:
                pass

        return __data

    def fills_skips(self):
        __fills = {}
        __skip = {}
        for __block in self._questions['blocks']:
            for __item in __block['questions']:
                try:
                    __item['name'] = __item['name'].replace("II", "")
                    __fills[__item['name']] = __item['preLoadActions'][1]['selections'][0]['value']
                except:
                    pass
                if 'displayLogic' in __item:
                    __skip[__item['name']] = __item['displayLogic'].replace("logic:adv;", "")
                    __skip[__item['name']] = __skip[__item['name']].replace("logic:basic;", "")
        return __fills, __skip

    def columns(self, data):
        __column = 32
        __data = data

        for __key in list(__data):
            if __key[-2:] == 'FIL1' or __key[-2:] == 'FIL2' or 'SKP' in __key:
                del __data[__key]
                continue
            if __key not in data:
                del __data[__key]

        self._order = self.order()
        self.xfile_layout(__data, self._order)
        for __qname in self._order:
            maxchoice = __data[__qname]['maxchoice']
            codewidth = __data[__qname]['codewidth']
            __data[__qname]['startcolumn'] = __column
            endcolumn = __column + maxchoice * codewidth - 1  # subtract 1 to keep width proper
            __data[__qname]['endcolumn'] = endcolumn
            for __label in __data[__qname]['choices']:
                match maxchoice:
                    case 1:
                        match codewidth:
                            case 1:
                                column_code = f";{__column}-{__label}"
                            case _:
                                second = __column + codewidth - 1
                                column_code = f";R({__column}:{second},{__label})"
                    case 2:
                        match codewidth:
                            case 1:
                                second = __column + codewidth - 1
                                column_code = f";{__column}-{__label} OR {second}-{__label}"
                            case _:
                                second = __column + codewidth - 1
                                third = __column + codewidth
                                fourth = __column + codewidth * 2 - 1
                                column_code = f";R({__column}:{second},{__label}) OR R({third}:{fourth},{__label})"
                    case _:
                        match codewidth:
                            case 1:
                                second = __column + codewidth
                                third = __column + codewidth * maxchoice - 1
                                column_code = f";R({__column}/{second}...{third},{__label})"
                            case _:
                                second = __column + codewidth - 1
                                third = __column + codewidth
                                fourth = __column + codewidth * 2 - 1
                                fifth = __column + codewidth * maxchoice - codewidth
                                sixth = __column + codewidth * maxchoice - 1
                                column_code = f";R({__column}:{second}/{third}:{fourth}...{fifth}:{sixth},{__label})"
                __data[__qname]['rows'].append(f"{__data[__qname]['choices'][__label]} {column_code}")
            __column += codewidth * maxchoice

            for __label in __data[__qname]['choices']:
                if __data[__qname]['choices'][__label] in self.__TOTALS.keys():
                    __data[__qname]['totals'] = self.__TOTALS[__data[__qname]['choices'][__label]]
                    break

        return __data

    def xfile_layout(self, data, order):
        self.__xfile = [
            ['CASEID', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)'],
            ['xxxxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', 'xxxxx']
        ]
        self.__builder = {
            'Table': [np.nan, np.nan, np.nan, np.nan],
            'Field': ['CASEID', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)']
        }
        self.__layout = {
            'Table': [np.nan, np.nan, np.nan, np.nan],
            'Field': ['CASEID', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)'],
            'Start': [1, 11, 19, 27],
            'End': [10, 18, 26, 31],
            'Width': [
                len(self.__xfile[1][0]),
                len(self.__xfile[1][1]),
                len(self.__xfile[1][2]),
                len(self.__xfile[1][3])],
            'Description': ['', '', '', '']
        }
        __data = data
        __table = 1
        __column = 32
        __codes = ""
        for __qname in order:
            maxchoice = __data[__qname]['maxchoice']
            codewidth = __data[__qname]['codewidth']
            tableNumber = True

            if __qname in self.SKIP_TABLE:
                self.__builder['Table'].append(np.nan)
            else:
                self.__builder['Table'].append(__table)
            self.__builder['Field'].append(__qname)

            for i in range(maxchoice):
                if maxchoice > 1:
                    __name = f"{__qname}_M{i + 1}"
                else:
                    __name = __qname
                self.__xfile[0].append(__name)

                self.__xfile[1].append('x' * codewidth)

                if __qname in self.SKIP_TABLE or not tableNumber:
                    self.__layout['Table'].append(np.nan)
                else:
                    self.__layout['Table'].append(__table)
                    __table += 1
                self.__layout['Field'].append(__name)
                self.__layout['Start'].append(__column)
                self.__layout['End'].append(__column + codewidth - 1)
                self.__layout['Width'].append(codewidth)
                self.__layout['Description'].append('')

                tableNumber = False
                __column += __data[__qname]['codewidth']

        xfile = pd.DataFrame(self.__xfile, columns=self.__xfile[0]).drop(0)
        layout = pd.DataFrame(self.__layout)
        builder = pd.DataFrame(self.__builder)

        xfile.to_excel('EXTRACTION/DATABASE/xfile.xlsx', index=False)
        layout.to_excel('EXTRACTION/DATABASE/layout.xlsx', index=False)
        builder.to_excel('builder.xlsx', index=False)

    def build_extraction_task(self):

        header = {

            "Authorization": f"Client {self.access_token}",
            "Content-Type": "application/json"
        }
        dest = f"{self._prc_id}dat"
        v = ['CASEID', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)', ]
        for item in self._order:
            v.append(item)
        dat = json.dumps({
            "Name": dest,
            "SurveyId": self.sid,
            "Language": "en",
            "Description": "Used to extract data for UNCLE",
            "DestinationFileName": dest,
            "ExtractFormat": "CSV",
            "Filter": {
                "DispositionResults": [
                    "Completed"
                ]
            },
            "IncludeOpenEnds": False,  # Stating False is redundant in all cases below this line
            "IncludeConnectionHistory": False,
            "IncludeLabels": False,
            "StripHtmlFromLabels": True,
            "FieldDelimiter": "Comma",
            "Encoding": "Windows1252",
            "EncloseValuesInDoubleQuotes": False,
            "IncludeHeader": True,
            "UseChoiceLabels": False,
            "MergeOpenEnds": False,
            "DichotomizedMultiple": False,
            "DichotomizedEmptyWhenNoAnswer": False,
            "UseNegativeIntegersForEmptyAnswers": False,
            "DapresyDataFormat": False,
            "LoopsInQuestionnaireOrder": False,
            "RemoveBracesOfSystemVariables": True,
            "Variables": v
        })
        requests.post(
            f"{os.environ['extraction_url']}",
            headers=header,
            data=dat
        )

        "419 76552 76627"

