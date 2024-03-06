import traceback

import pandas as pd

from .Writer import Writer
from .api import AcuityData


class Reader:
    project_id = None

    def __init__(self):
        self.style = None
        self.api = AcuityData.AcuityData()

    # def extract(self):
    #     self.api.build_extraction_task(prc_id=prc_id)

    def setUrl(self, survey_id: str):
        self.api.set_sid(survey_id)

    def request_data(self):
        match self.api.request_data():
            case 'order dne':
                return 'order.csv could not be found or does not exist'
            case _:
                return 1

    def get_survey_name(self):
        return self.api.get_survey_name()

    def get_questions(self):
        return self.api.question_names()

    def get_order(self):
        return self.api.order()

    def set_data_layout(self, data):
        skip = []
        for question in data['selectedValues']:
            if not data['selectedValues'][question]:
                skip.append(question)
        self.api.set_skips(skip)
        self.style = data['totalStyleChecked']

    def run(self):

        data = self.api.data()
        self.api.build_extraction_task()

        """
        LAYOUT OF CURRENT dictionaries
        data {
            <'qname'>: {
                'question': <'qtext'>,
                'text': <'text'>
                'choices': {
                    <'code'>: <'label'>
                },
                'qual': {
                    'label': <'label'>,
                    'logic': <'logic'>
                },
                'codewidth': <code width>,
                'maxchoice': <maxchoice>,
                'rank': <bool>,
                'startcolumn': <start column>,
                'endcolumn': <end column>,
                'rows': [
                    <row text with column and choice code>
                ],
                'total': <bool>,
                'totals': {
                    total 1: [
                        int,
                        int 
                    ]
                    total 2: [            IN SOME CASES THERE ARE 3 TOTALS
                        int,
                        int
                    ],
                }
            }
        }

        Standards:
        _________VARIABLE_____________WIDTH__
        |_CASEID____________________|__10___|
        |_PIN_______________________|__10___|
        |_LASTCONNECTIONDATE________|___8___|
        |_STARTTIMEOFLASTCONNECTION_|___8___|
        |_TOTAL_DURATION_(SEC)______|___5___|
        |_VEND______________________|___1___|

R *D//S (REPUBLICAN - DEMOCRAT)       ;NONE   ;EX (R3-R5)
R &UT- TOTAL REPUBLICAN               ;61-1:2
R &UT- TOTAL INDEPENDENT              ;61-3:5
R &UT- TOTAL DEMOCRAT                 ;61-6:7

T QIDEOLOGY:
T Would you consider your political views to be conservative, liberal, or moderate?
T
T /
R BASE==TOTAL SAMPLE             ;ALL     ;HP NOVP
R *D//S (CONSERVATIVE - LIBERAL) ;NONE    ;EX (R3-R4)
R &UT- TOTAL CONSERVATIVE        ;112-1:2
R &UT- TOTAL LIBERAL             ;112-4:5
R &AI2 STRONGLY CONSERVATIVE     ;112-1
R &AI2 SOMEWHAT CONSERVATIVE     ;112-2
R MODERATE                       ;112-3
R &AI2 SOMEWHAT LIBERAL          ;112-4
R &AI2 STRONGLY LIBERAL          ;112-5
R UNSURE // REFUSED              ;112-6
R NO ANSWER                      ;112N1:6 ;NOR SZR

        """

        writer = Writer()
        writer.style = self.style
        tnum = 1
        builder = pd.read_excel('builder.xlsx')
        order = builder.dropna()
        with open(rf'EXTRACTION/UNCLE/tables.txt', 'w') as f:
            for qname in order['Field']:
                try:
                    writer.code_width =data[qname]['codewidth']
                    writer.tnum = \
                        builder['Table'].where(builder['Field'] == qname
                                               ).dropna().reset_index(drop=True).astype(int)[0]

                    writer.qname = qname
                    writer.title_text = data[qname]['text']
                    writer.qtext = data[qname]['question']
                    writer.qual = data[qname]['qual']['logic']
                    writer.rank = data[qname]['rank']
                    writer.base = data[qname]['qual']['label']
                    writer.totals = data[qname]['totals']
                    writer.rows = data[qname]['rows']
                    writer.max_choice = data[qname]['maxchoice']
                    writer.start_column = data[qname]['startcolumn']
                    writer.end_column = data[qname]['endcolumn']
                    writer.column_text()
                    writer.choice_codes = list(data[qname]['choices'].keys())
                    writer.choice_labels = list(data[qname]['choices'].values())
                    f.write(writer.create_table())
                    tnum += 1
                except Exception as err:
                    print(traceback.format_exc())
                    if qname == "QIDEOLOGY":
                        try:
                            f.write(
                                "*\n"
                                f"TABLE {writer.tnum}\n"
                                "T QIDEOLOGY:\n"
                                f"T {writer.qtext}\n"
                                "T\n"
                                "T /\n"
                                "R BASE==TOTAL SAMPLE             ;ALL     ;HP NOVP\n"
                                f"R *D//S ({writer.totals[0]} - {writer.totals[1]}) ;NONE    ;EX (R3-R4)\n"
                                f"R &UT- TOTAL {writer.totals[0]}        ;{writer.start_column}-1:2\n"
                                f"R &UT- TOTAL {writer.totals[1]}            ;{writer.start_column}-4:5\n"
                                f"R &AI2 STRONGLY {writer.totals[0]}     ;{writer.start_column}-1\n"
                                f"R &AI2 SOMEWHAT {writer.totals[0]}     ;{writer.start_column}-2\n"
                                f"R MODERATE                       ;{writer.start_column}-3\n"
                                f"R &AI2 SOMEWHAT {writer.totals[1]}          ;{writer.start_column}-4\n"
                                f"R &AI2 STRONGLY {writer.totals[1]}          ;{writer.start_column}-5\n"
                                f"R UNSURE // REFUSED              ;{writer.start_column}-6\n"
                                f"R NO ANSWER                      ;{writer.start_column}N1:6 ;NOR SZR\n"
                            )
                        except Exception:
                            f.write(
                                "*\n"
                                f"TABLE {writer.tnum}\n"
                                "T QIDEOLOGY:\n"
                                f"T {writer.qtext}\n"
                                "T\n"
                                "T /\n"
                                "R BASE==TOTAL SAMPLE             ;ALL     ;HP NOVP\n"
                            )
                    print("Main loop:", writer.qname, err)
