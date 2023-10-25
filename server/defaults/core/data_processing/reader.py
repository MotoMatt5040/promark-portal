import pandas as pd

from .Writer import Writer
from .api import AcuityData


class Reader:
    '''
      Selector
      Things needed in each function
      layout
          frame sizing (dynamic) or perhaps just an input for id#
          ----------------------------------------------------------------
          | project id# []                                              |
          |                                                              |
          |                                                              |
          |                                                              |
          |                                                              |
          |                                                              |
          |                                                              |
          |                                                              |
          |                                                              |
          |                                                              |
          ----------------------------------------------------------------
      '''

    def __init__(self, project_id):
        self.api = AcuityData.AcuityData()
        self.project_id = project_id


    def setUrl(self, survey_id: str):
        self.api.requestData(survey_id)
        self.run()

    def run(self):
        data = self.api.data()
        # order = pd.read_csv("order.csv").columns[6:]
        # self.api.xfile_layout(data, order)

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

        print("----------------------------------------------------------------")
        # print(json.dumps(data, indent=4))
        writer = Writer()
        tnum = 1
        builder = pd.read_excel('builder.xlsx')
        # layout = pd.read_excel('DATABASE/layout.xlsx')
        order = builder.dropna()
        with open(rf'i:\PROJ\{self.project_id}\UNCLE\{self.project_id} tables.txt', 'w') as f:
            for qname in order['Field']:
                print(qname)
                try:
                    # print()
                    writer.set_code_width(data[qname]['codewidth'])
                    writer.set_tnum(
                        builder['Table'].where(builder['Field'] == qname)
                        .dropna().reset_index(drop=True).astype(int)[0]
                    )
                    writer.set_qname(qname)
                    writer.set_title_text(data[qname]['text'])
                    writer.set_qtext(data[qname]['question'])
                    writer.set_qual(data[qname]['qual']['logic'])
                    writer.set_rank(data[qname]['rank'])
                    writer.set_base(data[qname]['qual']['label'])
                    writer.set_totals(data[qname]['totals'])
                    writer.set_rows(data[qname]['rows'])
                    writer.set_max_choice(data[qname]['maxchoice'])
                    writer.set_start_column(data[qname]['startcolumn'])
                    writer.set_end_column(data[qname]['endcolumn'])
                    writer.set_column_text()
                    writer.set_choice_codes(list(data[qname]['choices'].keys()))
                    writer.set_choice_labels(list(data[qname]['choices'].values()))
                    f.write(writer.create_table())
                    tnum += 1
                    # print(qname, writer.get_start_column())
                except Exception as err:

                    print("Main loop:", writer.get_qname(), err)


if __name__ == "__main__":
    r = Reader()
