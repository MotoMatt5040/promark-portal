import os
import re
from dataclasses import dataclass
import requests
import io
import zipfile
import pandas as pd
import json


@dataclass(init=False)
class SharedVariables:
    sid: str = None
    prc_id: str = None
    survey_name = None


class ApiData:

    def __init__(self):
        self._survey_name = None
        self._url = None
        self._survey_url = None

    @property
    def sid(self):
        """
        Get or set the sid property.

        Notes
        -----
        * Setting the SID here updates the questions, variables, extraction task url, and survey url
        * Parent Class: SharedVariables
        """
        return SharedVariables.sid

    @property
    def survey_name(self):
        return SharedVariables.survey_name

    @survey_name.setter
    def survey_name(self, survey_name):
        SharedVariables.survey_name = survey_name
        SharedVariables.prc_id = survey_name[:survey_name.find(' ')]

    @property
    def prc_id(self):
        return SharedVariables.prc_id

    @prc_id.setter
    def prc_id(self, prc_id):
        SharedVariables.prc_id = prc_id

    def prc_update(self):
        SharedVariables.prc_id = self._survey_name[:self._survey_name.find(' ')]

    @property
    def questions_url(self):
        return f"{os.environ['questions_url']}{self.sid}"

    @property
    def variables_url(self):
        return f"{os.environ['variables_url']}{self.sid}"

    @property
    def survey_url(self):
        return f"{os.environ['web_survey_url']}{self.sid}"


@dataclass(init=False)
class ExtractionData:

    def __init__(self):
        self._extraction_url = None
        self._extraction_id = None

    @property
    def sid(self):
        """
        Get the current SID value.

        NOTES
        _____
        This value can only be updated by calling the API class
        Parent class: SharedVariables
        """
        return SharedVariables.sid

    @property
    def extraction_task_list_url(self):
        """
        Get or Set the extraction url.
        """
        return f"{os.environ['extraction_url']}?surveyId={self.sid}"

    @property
    def extraction_id(self):
        return self._extraction_id

    @extraction_id.setter
    def extraction_id(self, extraction_id):
        self._extraction_id = extraction_id
         # This is the url that is used to extract the file

    @property
    def target_extraction_task_url(self):
        """Get the target task data. This can only be called after setting the extraction id.
        """
        return f"{os.environ['extraction_url']}/{self.extraction_id}"


class UncleFile:

    def __init__(self):
        pass

    def organize(self, data):
        pass


class VoxcoDataGrabber:

    _access_token: str = os.environ['access_token']
    api_data = ApiData()
    extraction_data = ExtractionData()

    def __init__(self):
        self._checkboxes = None
        self._variables = None
        self._questions = None
        self._order = None
        self._raw_data = None
        self._has_fill = {}
        self._restructure = None

    def survey_name(self) -> str:
        """
        Pull survey name from the api. This request must be made after the sid is set.
        :return: str: survey name
        """
        self.api_data.survey_name = requests.get(self.api_data.survey_url, headers={"Authorization": f"Client {self._access_token}"}).json()['Name']
        # The prc id is auto set inside the API class
        return self.api_data.survey_name

    def target_task_list(self) -> list[dict]:
        """
        Get the target task data from the extraction task url. This value will return False if the task is not found.
        :return: list[dict]: {ExtractionId: int, Name: str, Status: str, FileId: int}
        """
        try:
            task_list = requests.get(self.extraction_data.extraction_task_list_url,
                                     headers={"Authorization": f"Client {self._access_token}"}).json()
        except Exception as e:
            print(f"Survey is not found. Please verify the survey exists before attempting again.\n"
                  f"\n"
                  f"ERROR: {e}")
            return False

        return task_list['Extractions']

    def get_target_task_data(self, extraction_id: int, task_name: str) -> list:
        """
        Get the target task data from the extraction task url. This value will return False if the task is not found.
        |
        Notes
        -----
        Two requests are made in this method. The file_id request is used to find the id of the file by using the
        extraction task id. The second request is used to extract the file from the server.
        :param extraction_id: ID of target extraction task
        :param task_name: Name of target extraction task
        :return: list of questions
        """
        if os.path.exists(f'{task_name}.csv'):
            os.remove(f'{task_name}.csv')
        try:
            file_id = requests.get(f"{os.environ['extraction_url']}/{extraction_id}",
                               headers={"Authorization": f"Client {self._access_token}"}).json()['FileId']

            req = requests.get(f"{os.environ['extraction_url']}/file?extractionId={extraction_id}&fileId={file_id}",
                               headers={"Authorization": f"Client {self._access_token}"})
            if req.ok:
                z = zipfile.ZipFile(io.BytesIO(req.content))
                z.extract(f"{task_name}.csv")
                z.close()
        except Exception as err:
            print(f"Error: {err}")
            return []
        self._order = pd.read_csv(f"{task_name}.csv")
        self._checkboxes = [item for item in list(self._order.columns[4:]) if "_M" not in item]
        self._order = self.order.columns
        os.remove(f'{task_name}.csv')
        return self._checkboxes

    @property
    def raw_data(self) -> dict:
        """
        Get the raw data from the api. This is the base organization that is put together from the variables and
        questions api links. This method restructures the two json files into the dictionary used to organize the data.
        :return: dict containing the tables data
        """
        return self._raw_data

    def fetch_preload(self) -> dict:
        """
        Fetch the preload data from the api. This data is used to fill in the blanks for the questions.
        :return: Dictionary of preload data
        """
        data = {}
        for block in self._questions['blocks']:
            for item in block['questions']:
                data[item['name']] = {}

                if 'displayLogic' in item:
                    data.setdefault(item['name'], {})['display_logic'] = item['displayLogic'].replace('logic:adv;', '')

                if 'preLoadActions' in item:
                    for val in item['preLoadActions']:
                        condition = val.get('condition')

                        if condition:
                            condition = condition.replace('logic:adv;', '')
                            data.setdefault(item['name'], {})['condition'] = condition

                        selection_variable = val.get("selectionVariables")
                        if selection_variable:
                            name = selection_variable[0]['name']
                            data.setdefault(name, {})['selection_variable'] = name

                            selections = val.get('selections')
                            if selections:
                                data.setdefault(name, {})['selections'] = selections[0]['value']

                        display_logic = val.get('displayLogic')
                        if display_logic:
                            data.setdefault(item['name'], {})['display_logic'] = display_logic.replace('logic:adv;', '')

        return data

    def fetch_raw_data(self):
        data = self.add_default_fields()
        preload = self.fetch_preload()
        question = None

        for block in self.variables:
            to_append = {}

            # Check if preload value exists and has selections
            if block['QuestionText']:
                text = block['QuestionText']
                if "[" in text:
                    fill_location = text.find("["), text.find("]")
                    fill_name = text[fill_location[0] + 1:fill_location[1]]
                    fill = text[fill_location[0]:fill_location[1] + 1]
                    if preload.get(fill_name):
                        if preload[fill_name].get('selections'):
                            question = text.replace(fill, preload[fill_name]['selections'])
                        else:
                            question = self.has_fill(block['Name'], block['QuestionText'])

            # do this for only selected block variables. Otherwise, column may have to be calculated later.
            if question:
                to_append['question'] = question

            if block['Text']:
                to_append['text'] = block['Text']

            if block['Choices']:
                to_append['choices'] = {label['Code']: label['Text'] for label in block['Choices']}

            if block['MaxLength']:
                to_append['code_width'] = block['MaxLength']

            if block['MaxAnswers']:
                to_append['max_choice'] = block['MaxAnswers']

            if preload.get(block['Name']):
                to_append['preload'] = preload.get(block['Name'])

            data[block['Name']] = to_append

        self._raw_data = data
        self.replace_fill()

    def has_fill(self, question, text):
        """
        Store fill data
        :param question: Question name
        :param text: Question text
        :return: Unmodified question text
        """
        # This shouldn't include SEX2, this will only happen if it is included in the dat file
        if text is None \
                or question not in self._order \
                or question.lower() == 'sex2':
            return
        if "[" not in text:  # this is a redundant check for safety
            return

        fill_location = text.find("["), text.find("]")
        fill_name = text[fill_location[0] + 1:fill_location[1]]
        fill = text[fill_location[0]:fill_location[1] + 1]

        self._has_fill[question] = {"text": text, "fill": fill, 'fill_name': fill_name}
        return text

    def replace_fill(self):
        """
        Replace all fills with the actual text from the fill choices
        :return: None
        """
        # print(json.dumps(self._has_fill, indent=4))
        print("\033[93mWarning: apidata.VoxcoDataGrabber.replace_fill() may be deprecated in the future!\033[0m")
        for question in self._has_fill:
            try:
                self._raw_data[question]['question'] = self._raw_data[question]['question'].\
                    replace(
                        self._has_fill[question]['fill'],
                        self._raw_data[self._has_fill[question]['fill_name']]['choices']["1"]
                    )
            except:
                print("Error on: ", question, self._has_fill[question]['fill'], self._raw_data[self._has_fill[question]['fill_name']]['choices'])

    def restructure(self):
        restructure = {}
        start_column = 1
        # used to reorganize the data in the proper order and add column info
        prev = None
        for i, question in enumerate(self._order):

            if question in self._raw_data:

                end_column = start_column + self._raw_data[question]['code_width'] - 1
                restructure[question] = self._raw_data[question]
                restructure[question]['start_column'] = start_column
                if self._raw_data[question]['code_width'] > 1:
                    restructure[question]['end_column'] = end_column
                q = question

            else:
                temp = question[:question.find('_M')]
                end_column = start_column + self._raw_data[temp]['code_width'] - 1
                restructure[temp] = self._raw_data[temp]

                if 'multi_mentions' not in restructure[temp]:
                    restructure[temp]['multi_mentions'] = {}

                columns = {
                    'start_column': start_column,
                }

                if self._raw_data[temp]['code_width'] > 1:
                    columns['end_column'] = end_column

                restructure[temp]['multi_mentions'][question] = columns
                q = temp

            start_column += self._raw_data[q]['code_width']
            self._raw_data[q] = restructure[q]

            if "_M" not in question or i == len(self._order) - 1:
                create_rows_called = False
                if prev is not None and "_M" in prev:
                    self.create_rows(prev, multi_mention=True)
                    create_rows_called = True

                if not create_rows_called:
                    self.create_rows(q)

            prev = q

        self._restructure = restructure
        return restructure

    def has_table(self, tables):
        for name, table in tables.items():
            if table:
                self._raw_data[name]['table'] = True

    def identify_qualifiers(self):
        for question in self._raw_data:

            preload = self._raw_data[question].get('preload')
            if not preload:
                continue

            logic = preload.get('display_logic')
            if not logic:
                continue

            logic = logic.strip()

            # Regular expression to find key-value pairs
            pattern = r'(\w+)\s*=\s*([^ ]+)'

            # Find all matches in the input string
            matches = re.findall(pattern, logic)

            result = {}
            start_column = False
            label = 'R BASE=='
            prev = None
            qual = "Q "
            for key, value in matches:
                # Split the value by comma and convert to integers
                values = [int(v) for v in value.split(',')]
                start_column = self._raw_data[key].get('start_column')
                if not start_column:
                    continue
                columns = [start_column]
                end_column = self._raw_data[key].get('end_column')

                if end_column:
                    columns.append(end_column)
                    qual += f"R({start_column}:{end_column},"
                    values_str = ",".join(map(str, values))
                    qual += values_str + ")"
                else:
                    qual += f"{start_column}-{','.join(map(str, values))}"

                qual += " "
                if prev is not None and prev != key:
                    label += " AND "

                label += f"{key}="
                if len(values) > 1:
                    choice_labels = [f"{choice}" for choice in values]
                else:
                    choice_labels = [f"{self._raw_data[key]['choices'][str(choice)]}" for choice in values]
                label += " OR ".join(choice_labels)

                if start_column:
                    result[key] = {
                        'column': columns,
                        'choice': values,
                        'label': label,
                        'qual': qual
                    }

                prev = key

            if start_column:
                self._raw_data[question]['qualifiers'] = result

    def create_rows(self, question, multi_mention=False):
        if self._raw_data[question]['max_choice'] == 1:
            choices = self._raw_data[question].get('choices')
            if not choices:
                return

            start_column = self._raw_data[question]['start_column']
            end_column = self._raw_data[question].get('end_column')
            keys = list(choices)
            rows = []

            def append_special_cases(to_append):
                special_cases = ["unsure", "refused", "don't know", "no opinion", "other"]
                if any(case in to_append.lower() for case in special_cases):
                    to_append += " ;NOR SZR"
                return to_append

            for choice in choices:
                if self._raw_data[question]['code_width'] == 1:
                    to_append = f"R {choices[choice]} ;{start_column}-{choice}"
                    to_append = append_special_cases(to_append)
                else:
                    to_append = f"R {choices[choice]} ;R({start_column}:{end_column},{choice})"
                    to_append = append_special_cases(to_append)
                rows.append(to_append)

            if self._raw_data[question]['code_width'] == 1:
                rows.append(f"R NO ANSWER ;{start_column}N{keys[0]}:{keys[-1]} ;NOR SZR")
            else:
                rows.append(f"R NO ANSWER ;NOTR({start_column}:{end_column},{keys[0]}:{keys[-1]}) ;NOR SZR")

            self._raw_data[question]['rows'] = rows

    @property
    def variables(self):
        """
        Get the variables from the api.
        |
        Notes
        -----
        This property contains the following data:
        [
          {
            "Id": 0,
            "Name": "string",
            "Type": "Discrete",
            "Text": "string",
            "HasOpenEnd": true,
            "DataType": "Text",
            "MaxAnswers": 0,
            "MaxLength": 0,
            "QuestionId": 0,
            "QuestionName": "string",
            "QuestionText": "string",
            "Choices": [
              {
                "Code": "string",
                "Text": "string",
                "Image": "string",
                "HasOpenEnd": true,
                "Visible": true,
                "Default": true
              }
            ]
          }
        ]
        :return: variables
        """
        return self._variables

    def fetch_variables(self):
        """
        Get the variables from the api.
        |
        Notes
        -----
        This property contains the following data:
        [
          {
            "Id": 0,
            "Name": "string",
            "Type": "Discrete",
            "Text": "string",
            "HasOpenEnd": true,
            "DataType": "Text",
            "MaxAnswers": 0,
            "MaxLength": 0,
            "QuestionId": 0,
            "QuestionName": "string",
            "QuestionText": "string",
            "Choices": [
              {
                "Code": "string",
                "Text": "string",
                "Image": "string",
                "HasOpenEnd": true,
                "Visible": true,
                "Default": true
              }
            ]
          }
        ]
        :return: variables
        """
        response = requests.get(self.api_data.variables_url, headers={"Authorization": f"Client {self._access_token}"}).json()
        self._variables = response

    def fetch_questions(self):
        response = requests.get(self.api_data.questions_url, headers={"Authorization": f"Client {self._access_token}"}).json()
        self._questions = response

    @property
    def questions(self):
        return self._questions

    @property
    def question_names(self):
        return [item["Name"] for item in self.variables]

    @property
    def sid(self):
        return SharedVariables.sid

    @sid.setter
    def sid(self, sid):
        SharedVariables.sid = sid

    @property
    def extraction_id(self):
        return self.extraction_data.extraction_id

    @property
    def order(self):
        return self._order

    @property
    def final_data(self):
        return self._replace_chars_recursive(self._raw_data)

    @property
    def layout(self):
        """
        Used to print the layout of the data structure. Some data is omitted based on specific question needs. Use JSON
        to print in an easier to read format. Example: print(json.dumps(data, indent=4))
        :return: dictionary of data
        """
        return {
            "question name": {
                'question': 'question text',
                'text': 'series text',
                'choices': {
                    'choice number': 'choice text'
                },
                'code_width': 'number of columns',
                'max_choice': 'number of choices',
                'start_column': 'starting column',
                'end_column': 'ending column',
                'preload': {
                    'display_logic': 'display logic',
                    'condition': 'condition',
                    'selection_variable': 'selection variable',
                    'selections': 'selections'
                },
                'qualifiers': {
                    'qualifier name': {
                        'column': ['start column', 'end column'],
                        'choice': ['choice number'],
                        'label': 'qualifier label',
                        'qual': 'qualifier'
                    }
                },
                'table': 'boolean',
                'rows': ['rows']
            }
        }

    def add_default_fields(self):
        defaults = {
            "CaseID": 10,
            "LastConnectionDate": 8,
            "Starttimeoflastconnection": 8,
            "TotalDuration(sec.)": 5
        }
        d = {}
        for value in defaults:
            d[value] = {
                'code_width': defaults[value],
                'max_choice': 1,
            }
        return d

    def _replace_chars_recursive(self, data):
        character_replacement = {
            "/": "//",
            "\u2019": "'",
            "&nbsp;": " ",
            "&NBSP;": " ",
            "\u2026": "...",
            "\u200b": "",
            "\u2013": "-",
            "  ": " ",
            "\n": " ",
            "\u201c": '"',
            "\u201d": '"'
        }
        if isinstance(data, str):
            # If data is a string, replace characters
            for char, replacement in character_replacement.items():
                data = data.replace(char, replacement)
            return data
        elif isinstance(data, dict):
            # If data is a dictionary, recursively call this function on each value
            return {key: self._replace_chars_recursive(value) for key, value in data.items()}
        elif isinstance(data, list):
            # If data is a list, recursively call this function on each element
            return [self._replace_chars_recursive(item) for item in data]
        else:
            # If data is neither a string, dictionary, nor list, return it unchanged
            return data

    def reset_data(self):
        self._checkboxes = None
        self._variables = None
        self._questions = None
        self._order = None
        self._raw_data = None
        self._has_fill = {}
        self._restructure = None



