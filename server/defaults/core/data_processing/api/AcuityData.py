import json
from configparser import ConfigParser
from pathlib import Path

import numpy as np
import pandas as pd
import requests


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

    __REMOVE = [
        # 'ACTAG',
        '1PARTYP2',
        'AID',
        'ANIMAL',
        'ARTS',
        'BATCH',
        'BCK',
        'BDATE',
        'CALLID',
        'CALLID2',
        'CB',
        'CDESC',
        'CELL',
        # 'CFIPS',
        'CFLN',
        'CHARITY',
        'CHILD',
        'CHK',
        'CLUST',
        'CONSERVATIVE',
        'CREL',
        'CVID',
        'D1',
        'D1_1',
        'D3P1',
        'D3P2',
        'D3P3',
        'D8_1',
        'D8_2',
        'D8_3',
        'D9X',
        'DEL',
        'DEMOS',
        'DISCL',
        'DISCX',
        'DMASHOW',
        'DONT',
        'DUM01',
        'DUM02',
        'DUM03',
        'DUM04',
        'EMAIL',
        'ENV',
        'ESCAN',
        'ETHNIC',
        'FNAME',
        'GEND',
        'GOP1OS',
        'HEALTH',
        'IN44',
        'INCENT',
        'INCENTO',
        'INGEN',
        'INT',
        'INT02',
        'INT03',
        'INT12',
        'INT20',
        'INT21',
        'INT40',
        'INT41',
        'INT42',
        'INT43',
        'INT45',
        'INT99',
        'INTRO',
        'INTRO2',
        'INTRO3',
        'INTRO4',
        'LAND',
        'LIBERAL',
        'LNAME',
        'LOCAL',
        'LREL',
        'LVID',
        'MNAME',
        'NAME',
        # 'OFLAG',
        'OTYPE',
        'PARTY',
        'PARTYSHOW',
        'PHONE',
        'PID',
        'PIN',
        'PRACE',
        'PREL',
        'PREL12',
        'PRTY',
        'PSID',
        'Q17II',
        'Q17R',
        'Q18R',
        'Q19_1',
        'Q19_2',
        'Q19OE',
        'Q1DUM',
        'Q1II',
        # 'Q1OS',
        'Q20CODE',
        'Q22II',
        'Q27FX',
        'Q27III',
        'Q6INTRO',
        'Q9FX',
        'Q9III',
        'QA',
        'QAGE_1',
        'QAGESH',
        'QB',
        'QPARTYP1',
        'QUAL',
        'QUAL01',
        'QUAL02',
        'QUAL03',
        'QUAL13',
        'QUAL19',
        'QUAL2',
        'QUAL8',
        'QUALB',
        'QUALP',
        'STR8Q19',
        'STR8Q5',
        'QX',
        'QYOE',
        'RDATE',
        'RID2',
        'ROTAT',
        'RSHOW',
        'SENT',
        'SEQ',
        'SHOW',
        'SPEEDER',
        'STR8',
        'STUDY',
        'SUFFIX',
        'SURLEN',
        'SVID',
        'T1',
        'T2',
        'T3',
        'T4',
        'T6',
        'TARGETCOMM',
        'TARGETSH',
        'TFLAG',
        'THANK',
        'THNKD',
        'TIMER_CLICKCOUNT',
        'TIMER_FIRSTCLICK',
        'TIMER_LASTCLICK',
        'TIMER_TOTALTIME',
        'TZONE',
        'VACTIVE',
        'VAGE',
        'VEND',
        'VETERAN',
        'VGEND',
        'VTYPE',
        'WILDLIFE',
        'WKDAY',

    ]

    __SKIP_TABLE = [
        'GEN22',
        'GEN20',
        'GEN18',
        'GEN16',
        'RPRIM22',
        'RPRIM20',
        'RPRIM18',
        'RPRIM16',
        'PR22',
        'PR20',
        'PR19',
        'PR09',
        'PR15',
        'PR11',
        'PR18',
        'PR16',
        'PPR20',
        'CFIPS',
        'CD',
        'QAGE',
        'ACTAG',
        'QZIP',
        'Q32X',
        'Q33X',
        'Q34X',
        'Q35X',
        'Q36X',
        'Q36BX',
        'Q36CX',
        'Q37X',
        'Q38X',
        'Q39X',
        'Q40X',
        'Q41X',
        'Q42X',
        'Q43X',
        'Q44X',
        'Q45X',
        'Q46X',
        'Q47X',
        'Q48X',
        'Q49X',
        'Q50X',
        'Q51X',
        'Q52X',
        'Q53X',
        'Q54X',
        'Q55X',
        'Q55BX',
        'Q55CX',
        'Q55DX',
        'Q55EX',
        'Q55FX',
        'Q55GX',
        'Q55HX',
        'Q55JX',
        'Q55KX',
        'Q55NX',

        'QEDU_REC',
        'QINCOME_CODE',
        'Q24X',
        'Q25X',
        'Q26X',
        'Q27X',
        'Q31BX',
        'Q36NX',
        'Q23X',

        'QRACE_ETHN',
        "SAMP",
        "DMAN",
        "PR22",
        "PR20",
        "PR18",
        "PR16",
        "Q1OS",
        "Q3OS",
        "Q4OS",
        "Q11OS",
        "Q19C",
        "CD",
        "DMAN",
        "COUNTY"

    ]

    def __init__(self):
        self.__variables = None
        self.__questions_json = None

    def requestData(self, sid):

        __config_path = Path(r'config.ini')
        __config_object = ConfigParser()
        __config_object.read(__config_path)
        __access_token = __config_object['ACCESS TOKEN']['access token']

        __questions_json_url = f"https://prcmmweb.promarkresearch.com/api/survey/export/json/{sid}?deployed=true"
        __variables_url = f"https://prcmmweb.promarkresearch.com/api/survey/variables/{sid}"
        # print(__questions_json_url, "\n", __variables_url)

        __variables_req = json.dumps(
            requests.get(__variables_url, headers={"Authorization": f"Client {__access_token}"}).json(), indent=4)
        __questions_json_req = json.dumps(
            requests.get(__questions_json_url, headers={"Authorization": f"Client {__access_token}"}).json(), indent=4)

        self.__variables = json.loads(__variables_req)
        self.__questions_json = json.loads(__questions_json_req)

        print(json.dumps(self.__variables, indent=4))
        print(json.dumps(self.__questions_json, indent=4))

        for items in self.__questions_json:
            print(items, self.__questions_json[items])

        print("\n")

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
                    if f"[{q}F1]" in __data[qname]['question'] or f"[{q}F2]" in __data[qname]['question']:
                        __data[qname]['question'] = __data[qname]['question'].replace(f"[{q}F1]", __fills[q])
                        __data[qname]['question'] = __data[qname]['question'].replace(f"[{q}F2]", __fills[q])
                except:
                    try:
                        if f"[{q}F1]" in __data[qname]['question'] or f"[{q}F2]" in __data[qname]['question']:
                            __data[qname]['text'] = __data[qname]['text'].replace(f"[{q}F1]", __fills[q])
                            __data[qname]['text'] = __data[qname]['text'].replace(f"[{q}F2]", __fills[q])
                    except:
                        pass
            if __data[qname]['text'] != "":
                text = __data[qname]['question']
                __data[qname]['question'] = __data[qname]['text']
                __data[qname]['text'] = text

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
        for __block in self.__questions_json['blocks']:
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
        __column = 43
        __data = data

        for __key in list(__data):
            if __key[-2:] == 'F1' or __key[-2:] == 'F2' or 'SKP' in __key:
                del __data[__key]
            if __key in self.__REMOVE:
                del __data[__key]

        for __qname in __data:
            # print(__qname, __column)
            maxchoice = __data[__qname]['maxchoice']
            codewidth = __data[__qname]['codewidth']
        order = pd.read_csv("order.csv").columns[6:]
        self.xfile_layout(__data, order)
        layout = pd.read_excel('DATABASE/layout.xlsx')
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
            ['CASEID', 'PIN', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)', 'VEND'],
            ['xxxxxxxxxx', 'xxxxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', 'xxxxx', 'x']
        ]
        __layout = {
            'Table': [np.nan, np.nan, np.nan, np.nan, np.nan, np.nan],
            'Field': ['CASEID', 'PIN', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)',
                      'VEND'],
            'Start': [1, 11, 21, 29, 37, 42],
            'End': [10, 20, 28, 36, 41, 42],
            'Width': [
                len(__xfile[1][0]),
                len(__xfile[1][1]),
                len(__xfile[1][2]),
                len(__xfile[1][3]),
                len(__xfile[1][4]),
                len(__xfile[1][5])],
            'Description': ['', '', '', '', '', '']
        }
        __builder = {
            'Table': [np.nan, np.nan, np.nan, np.nan, np.nan, np.nan],
            'Field': ['CASEID', 'PIN', 'LASTCONNECTIONDATE', 'STARTTIMEOFLASTCONNECTION', 'TOTAL DURATION (SEC)',
                      'VEND'],
        }

        __table = 1
        __column = 43
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

            if __qname in self.__SKIP_TABLE:
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

                if __qname in self.__SKIP_TABLE or not tableNumber:
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

        xfile.to_excel('DATABASE/xfile.xlsx', index=False)
        layout.to_excel('DATABASE/layout.xlsx', index=False)
        builder.to_excel('builder.xlsx', index=False)

