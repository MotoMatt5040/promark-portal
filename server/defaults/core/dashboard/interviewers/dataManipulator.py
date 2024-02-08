import pandas as pd
import numpy as np

COLUMN_NAMES = {  # Renames column headers for consistency in Data Tales
    'ACPH': 'AVG. CPH',
    'AVGCPH': 'AVG. CPH',
    'AMPH': 'AMPH',
    'AVGMPH': 'AVG. MPH',
    'AL': 'AVG. LENGTH',
    'ALENGTH': 'AVG. LEN',
    'AVGLEN': 'AVG. LEN',
    'AVGLENGTH': 'AVG. LEN',
    'INTAL': 'AVG. LEN',
    'BASECELL': 'BASECELL',
    'BRIEFING': 'BRIEFING',
    'CATI_MODULE': 'CATI MODULE',
    'CMS': 'CMS',
    'CMSDIFF': 'CMS DIFF',
    'CODEQTY': 'CODEQTY',
    'CONNECTTIME': 'CNCT TIME',
    'CORATE': 'COOP RATE',
    'CPH': 'CPH',
    'CUM': 'CUM',
    'DAILYCMS': 'CMS',
    'DIALS': 'DIALS',
    'TOTALDIALS': 'DIALS',
    'DPC': 'DPC',
    'DPH': 'DPH',
    'EID': 'EMP ID',
    'FIRSTNAME': 'FIRST NAME',
    'First Name': 'FIRST NAME',
    'GPCPH': 'GPCPH',
    'REFNAME': 'FULL NAME',
    'HRS': 'HRS',
    'TOTALHR05': 'HARD REF',
    'INC': 'INC',
    'LASTNAME': 'LAST NAME',
    'Last Name': 'LAST NAME',
    'CALLCENTER': 'LOCATION',
    'RECLOC': 'RECLOC',
    'MAX': 'MAX',
    'MEAN': 'MEAN',
    'MEDIAN': 'MEDIAN',
    'MIN': 'MIN',
    'MPH': 'MPH',
    'LONGNAME': 'NAME',
    'MYNAME': 'NAME',
    'NAAM': 'NAAM',
    'NPH': 'N-P-H',
    'N': 'NSIZE',
    'PAUSEMIN': 'P MIN',
    'PAUSETIME': 'P TIME',
    'PROJECTID': 'PROJECT ID',
    'PROJECT_ID': 'PROJECT ID',
    'PROJID': 'PROJECT ID',
    'PROJ_ID': 'PROJECT ID',
    'PROJNAME': 'PROJECT NAME',
    'PT': 'PT%',
    'RANKING': 'RANK',
    'RESRATE': 'RES RATE',
    'SC': 'SAMPLE CONS',
    'SAMPUSED': 'SAMPLE USED',
    'ACTIVE': 'STATUS',
    'SUMMARY': 'SUMMARY',
    'TARGET': 'TARGET',
    'TENURE': 'TENURE',
    'TIMEDIFF': 'T DIFF',
    'THOURS': 'TOTAL HRS',
    'TOGO': 'TO GO',
    'VOXCOID': 'VOXCO ID',
    'WAITTIME': 'WAIT TIME',
    'XCMS': 'X.CMS',
    'XCPD': 'XCPD',
    'XCPH': 'XCPH',

    '2': 'Huntsville',
    '3': 'Home1',
    '4': 'Sawdust',
    '9': 'Nacogdoches',
    '13': 'Home2',
    '14': 'Home3',
    '15': 'Home4',
    '16': 'Home5',
    '17': 'Home6',
    '18': 'Home7',
    '19': 'Home8',
    '51': 'HomeTX',
    '52': 'HomeID',
    '53': 'HomeKS',
    '54': 'HomeOK',
    '55': 'HomeKY',
    '99': 'All',
    '101': 'Vision',
    '103': 'TeamP',
    '2.0': 'Huntsville',
    '3.0': 'Home1',
    '4.0': 'Sawdust',
    '9.0': 'Nacogdoches',
    '13.0': 'Home2',
    '14.0': 'Home3',
    '15.0': 'Home4',
    '16.0': 'Home5',
    '17.0': 'Home6',
    '18.0': 'Home7',
    '51.0': 'HomeTX',
    '52.0': 'HomeID',
    '53.0': 'HomeKS',
    '54.0': 'HomeOK',
    '55.0': 'HomeKY',
    '99.0': 'All',
    '101.0': 'Vision',
    '103.0': 'TeamP',
    'Huntsville': 'Huntsville',
    'Home1': 'Home1',
    'Sawdust': 'Sawdust',
    'Nacogdoches': 'Nacogdoches',
    'Home2': 'Home2',
    'Home3': 'Home3',
    'Home4': 'Home4',
    'Home5': 'Home5',
    'Home6': 'Home6',
    'Home7': 'Home7',
    'Home8': 'Home8',
    'HomeTX': 'HomeTX',
    'HomeID': 'HomeID',
    'HomeKS': 'HomeKS',
    'HomeOK': 'HomeOK',
    'HomeKY': 'HomeKY',
    'TeamP': 'TeamP',
    'All': 'All',
    'Vision': 'Vision',

    'RESRESPONDENT': 'Respondent',
    'RESINTERVCALL': 'IntCall',
    'RESINTERVCALLNAME': 'IntCallName',
    'RESLASTCALLDATE': 'LastCallDate',
    'RESCODERESULT': 'Code',
    'CALLDURATIONINSECONDS': 'Duration',
    'RESCALLCOUNT': 'Call Count'
}

class DataManipulator:

    def __init__(self):
        self._columns = None
        self._df = None
        
    def calculate_extra_values(self):

        try:
            self._df['IntAL'] = self._df['IntAL'].round(2)
            self._df['ConnectTime'] = (self._df['ConnectTime'] / 3600).round(2)
            self._df['PauseTime'] = (self._df['PauseTime'] / 3600).round(2)

            info = []
            for data in self._df['RecLoc']:
                info.append(COLUMN_NAMES[str(data)])

            self._df['RecLoc'] = info
            self._df['DPC'] = self._df['TotalDials'] / self._df['CMS']
            self._df['DPH'] = self._df['TotalDials'] / self._df['HRS']

            self._df['DPC'] = self._df['DPC'].round()
            self._df['DPH'] = self._df['DPH'].round()

            self._df['DPC'].replace([np.inf, -np.inf], np.nan, inplace=True)

            xcms = (self._df['HRS'] * self._df['GPCPH']).round(2)
            self._df.insert(6, 'XCMS', xcms)

            cmsdiff = (self._df['CMS'] - self._df['XCMS']).round(2)
            self._df.insert(7, 'CMSDIFF', cmsdiff)

            avgdpc = self._df['TotalDials'].mean()

            xcpd = (self._df['TotalDials'] / avgdpc).round(1)
            self._df.insert(8, 'XCPD', xcpd)

            pause_min = (self._df['PauseTime'] * 60).round(2)
            self._df.insert(14, 'PauseMin', pause_min)

            pt = ((self._df['PauseTime'] / self._df['HRS']) * 100).round(1)
            self._df.insert(15, 'PT', pt)
            self._df['PT'] = self._df['PT'].astype(str) + '%'

            time_diff = ((self._df['HRS'] - self._df['ConnectTime']) * 60).round(2)
            self._df.insert(17, 'TimeDiff', time_diff)

            nph = (((self._df['TimeDiff'] + self._df['PauseMin']) / (self._df['HRS'] * 60)) * 100).round()
            self._df.insert(16, 'NPH', nph)
            self._df['NPH'] = self._df['NPH'].astype(str) + '%'

            # self._df.sort_values(by=['CMS', 'CMSDIFF'], ascending=[False, False], inplace=True)
            self._df.sort_values(by='CMSDIFF', ascending=False, inplace=True)
        except Exception as e:
            pass
        return self._df.to_dict('records')

    def columns(self):
        self._columns = [
            {
                'name': COLUMN_NAMES[i.upper()],
                'id': i,
                'type': 'text',
            } for i in self._df.columns.drop(['GPCPH'])
        ]

    @property
    def df(self):
        return self._df
    
    @df.setter
    def df(self, df):
        self._df = df

    def print_data(self):
        print(self._df.to_string())
