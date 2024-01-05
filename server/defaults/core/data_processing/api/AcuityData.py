import io
import json
import time
import zipfile
from pathlib import Path
from sys import platform

import numpy as np
import pandas as pd
import requests
from configparser import ConfigParser


class AcuityData:
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
        return list(pd.read_csv("order.csv").columns[4:])

    def __init__(self):
        self.__variables = None
        self.__questions = None
        self.__extraction_task = None
        self.__extraction_id = None
        self.__extraction_file_id = None
        self.sid = None

    def set_sid(self, sid):
        self.sid = sid
        return sid

    def set_skips(self, skips):
        self.SKIP_TABLE = skips
        print(self.SKIP_TABLE)

    def request_data(self):
        # print("\n")
        # print(os.getcwd())
        time.sleep(3)

        if platform == "linux" or platform == "linux2":
            __config_path = Path(r'./config.ini')
        else:

            __config_path = Path(r'defaults\core\data_processing\api\config.ini')
        __config_object = ConfigParser()
        __config_object.read(__config_path)
        __access_token = __config_object['ACCESS TOKEN']['access token']

        __questions_url = f"https://prcmmweb.promarkresearch.com/api/survey/export/json/{self.sid}?deployed=true"
        __variables_url = f"https://prcmmweb.promarkresearch.com/api/survey/variables/{self.sid}"
        __extraction_task_url = f"https://prcmmweb.promarkresearch.com/api/results/extract?surveyId={self.sid}"

        __variables_req = json.dumps(
            requests.get(__variables_url, headers={"Authorization": f"Client {__access_token}"}).json(), indent=4)
        __questions_req = json.dumps(
            requests.get(__questions_url, headers={"Authorization": f"Client {__access_token}"}).json(), indent=4)
        __extraction_req = json.dumps(
            requests.get(__extraction_task_url, headers={"Authorization": f"Client {__access_token}"}).json(), indent=4)

        self.__variables = json.loads(__variables_req)
        self.__questions = json.loads(__questions_req)
        self.__extraction_task = json.loads(__extraction_req)

        for items in self.__extraction_task['Extractions']:
            # print(json.dumps(items, indent=4))
            if items["Name"] == "order":
                self.__extraction_id = items["ExtractionId"]

        __extraction_res_url = f"https://prcmmweb.promarkresearch.com/api/results/extract/{self.__extraction_id}"
        __extraction_file_id_req = json.dumps(
            requests.get(__extraction_res_url, headers={"Authorization": f"Client {__access_token}"}).json(), indent=4)
        self.__extraction_file_id = json.loads(__extraction_file_id_req)["FileId"]

        __order_url = f"https://prcmmweb.promarkresearch.com/api/results/extract/file" \
                      f"?extractionId={self.__extraction_id}&fileId={self.__extraction_file_id}"

        __order_req = requests.get(__order_url, headers={"Authorization": f"Client {__access_token}"})

        if __order_req.ok:
            z = zipfile.ZipFile(io.BytesIO(__order_req.content))
            z.extract("order.csv")
            z.close()

        # stuff = __order_req.content.decode("ISO-8859-16")
        # print(stuff)

        # decoded = __order_req.content.decode("Windows-1252")
        # cr = csv.reader(decoded.splitlines())
        #
        # my_data = list(cr)
        # for row in my_data:
        #     print(row)

        # print("first task")
        # print(json.dumps(self.__extraction_id, indent=4))
        # print("second task")
        # print(json.dumps(self.__extraction_task, indent=4))
        # print("third task")
        # print(json.dumps(self.__extraction_file_id, indent=4))

        # print(json.dumps(self.__variables, indent=4))
        # print('\n\n\n')
        # print('control f')
        # print(json.dumps(self.__questions, indent=4))
        self.question_names()

    def question_names(self):
        __name = []
        for item in self.__variables:
            __name.append(item["Name"])
        #     print(item["Name"])
        #
        # print(__name)
        return __name

    def blocks(self):
        __blocks = []
        for __item in self.__variables:
            __blocks.append(__item)
        return __blocks

    def data(self):
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
        for __block in self.__questions['blocks']:
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

        for __qname in __data:
            # print(__qname, __column)
            maxchoice = __data[__qname]['maxchoice']
            codewidth = __data[__qname]['codewidth']
        order = self.order()
        self.xfile_layout(__data, order)
        layout = pd.read_excel('EXTRACTION/DATABASE/layout.xlsx')
        for __qname in order:
            # print(__qname, __column)
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
            # TODO Add NO ANSWER row
            # if maxchoice < 2:
            #     match codewidth:
            #         case 1:
            #             __data[__qname]['rows'].append(f"{__column}N{column_code}")
            __column += codewidth * maxchoice

            for __label in __data[__qname]['choices']:
                if __data[__qname]['choices'][__label] in self.__TOTALS.keys():
                    __data[__qname]['totals'] = self.__TOTALS[__data[__qname]['choices'][__label]]
                    break

        return __data

    def xfile_layout(self, data, order):
        __data = data
        __xfile = [
            ['CASEID', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)'],
            ['xxxxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', 'xxxxx']
        ]
        __builder = {
            'Table': [np.nan, np.nan, np.nan, np.nan],
            'Field': ['CASEID', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)']
        }
        __layout = {
            'Table': [np.nan, np.nan, np.nan, np.nan],
            'Field': ['CASEID', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)'],
            'Start': [1, 11, 19, 27],
            'End': [10, 18, 26, 31],
            'Width': [
                len(__xfile[1][0]),
                len(__xfile[1][1]),
                len(__xfile[1][2]),
                len(__xfile[1][3])],
            'Description': ['', '', '', '']
        }

        __table = 1
        __column = 32
        __codes = ""
        # print(json.dumps(__data, indent=4))
        for __qname in order:
            # if __qname != 'ACTAG':
            __maxchoice = __data[__qname]['maxchoice']
            __codewidth = __data[__qname]['codewidth']
            # else:
            #     __maxchoice = 1
            #     __codewidth = 4
            tableNumber = True

            if __qname in self.SKIP_TABLE:
                __builder['Table'].append(np.nan)
            else:
                __builder['Table'].append(__table)
            __builder['Field'].append(__qname)

            for i in range(__maxchoice):
                if __maxchoice > 1:
                    __name = f"{__qname}_M{i + 1}"
                else:
                    __name = __qname
                __xfile[0].append(__name)

                x = ''
                for j in range(__codewidth):
                    x += 'x'
                __xfile[1].append(x)

                if __qname in self.SKIP_TABLE or not tableNumber:
                    __layout['Table'].append(np.nan)
                else:
                    __layout['Table'].append(__table)
                    __table += 1
                __layout['Field'].append(__name)
                __layout['Start'].append(__column)
                __layout['End'].append(__column + __codewidth - 1)
                __layout['Width'].append(__codewidth)
                __layout['Description'].append('')

                tableNumber = False
                # if __qname != 'ACTAG':
                __column += __data[__qname]['codewidth']
                # else:
                #     __column += 4

        xfile = pd.DataFrame(__xfile, columns=__xfile[0]).drop(0)
        layout = pd.DataFrame(__layout)
        builder = pd.DataFrame(__builder)

        xfile.to_excel('EXTRACTION/DATABASE/xfile.xlsx', index=False)
        layout.to_excel('EXTRACTION/DATABASE/layout.xlsx', index=False)
        builder.to_excel('builder.xlsx', index=False)

        # print(layout.to_string())

