import os

import requests


class ExtractionTaskBuilder:
    def dat_file(self, prc_number, survey_id, variables: []):
        dat = {
            "Name": f"{prc_number}dat",
            "SurveyId": survey_id,
            "Language": "en",
            "Description": "Used by automation program to create ",
            "DestinationFileName": f"{prc_number}dat",
            "ExtractFormat": "CSV",
            "Filter": {
                "Id": 0,
                "DispositionResults": [
                  "Completed"
                ],
                "EmailStatus": "All",
                "SMSStatus": "All",
                "LastActivity": {
                  "UseCurrentDate": True
                },
                "Languages": [
                  "string"
                ],
                "Devices": [
                  "Unknown"
                ],
                "Samples": [
                  0
                ],
                "UserId": 0,
                "Expression": "string"
            },
            "IncludeOpenEnds": False,
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
            "Variables": variables
        }
        info = requests.post(
            f"{os.environ['extraction_url']}",
            headers={
                "Authorization": os.environ['access_token']},
            data=dat
        )

    def test(self, url: str, variables: [], source: str = None):

        if not source:
            token = os.environ['access_token']

        elif source == "voxco":
            authenticated = False

            while not authenticated:
                username = input("Enter your username: ")
                password = input("Enter your password: ")
                context = input("Enter your context: ")

                url = f"https://prcmmweb.promarkresearch.com/Voxco.API/authentication/user?userInfo.username={username}&userInfo.password={password}&userInfo.context={context}"

                response = requests.get(url)

                if response.status_code == 200:
                    token = response.json()['Token']
                    authenticated = True

                else:
                    continue
        else:
            raise ValueError("Source not supported")

        order = {
            "Name": "order",
            "SurveyId": 91721,
            "Language": "en",
            "Description": "Used by automation program to create ",
            "DestinationFileName": "order",
            "ExtractFormat": "CSV",
            "Filter": {
                "Id": 0,
                "DispositionResults": [
                    "Completed"
                ],
                "EmailStatus": "All",
                "SMSStatus": "All",
                "LastActivity": {
                    "UseCurrentDate": True
                },
                "Languages": [
                  "string"
                ],
                "Devices": [
                  "Unknown"
                ],
                "Samples": [
                  0
                ],
                "UserId": 0,
                "Expression": "string"
            },
            "IncludeOpenEnds": False,
            "IncludeConnectionHistory": False,
            "IncludeLabels": False,
            "StripHtmlFromLabels": True,
            "FieldDelimiter": "Comma",
            "Encoding": "Windows1252",
            "EncloseValuesInDoubleQuotes": False,
            "IncludeHeader": True,
            "UseChoiceLabels": False,
            "MergeOpenEnds": True,
            "DichotomizedMultiple": False,
            "DichotomizedEmptyWhenNoAnswer": False,
            "UseNegativeIntegersForEmptyAnswers": False,
            "DapresyDataFormat": False,
            "LoopsInQuestionnaireOrder": False,
            "RemoveBracesOfSystemVariables": True,
            "Variables": [
                "QA"
            ]
        }
        print(type(order))
        info = requests.post(
          f"{os.environ['extraction_url']}",
          headers={f"Authorization": f"Client {token}"},
          data=order
        )
        print(info)


e = ExtractionTaskBuilder()

e.test(
    url='',
    variables=[
        "$P,"
        "$Q"
    ],
    source="voxco"
)

task ={
  "Id": "00000000-0000-0000-0000-000000000000",
  "Title": "string",
  "ProjectId": 0,
  "ProjectName": "string",
  "UserId": 0,
  "UserName": "string",
  "TaskClassName": "string",
  "CreatedOn": "2024-12-10T20:54:26.535Z",
  "LastRunDate": "2024-12-10T20:54:26.535Z",
  "AdaptorName": "string",
  "DtsType": "None",
  "SourceFileName": "string",
  "ScheduleCount": 0,
  "ScheduleNextRun": "string",
  "ScheduleTitle": "string",
  "ExtractTaskConfiguration": {
    "TaskId": "00000000-0000-0000-0000-000000000000",  # This is the task id
    "TaskName": "string",  # This is the name of the task
    "UserId": 0,
    "ProjectId": 0,  # This is the project id
    "ProjectName": "string",  # This is the project name
    "Adaptor": "None",
    "Language": "string",
    "IncludeOpenEnds": true,  # false
    "IncludeCallHistory": true,
    "IncludeLabelAccess": true,  # false
    "ExtractAllFields": true,  # false
    "StripHtml": true,
    "IncludeTimeSlots": true,  # false
    "IncludeTimeQuotas": true,  # false
    "IncludeCallBackSettings": true,  # false
    "IncludeFieldOptions": true,  # false
    "IncludeRolesInfo": true,  # false
    "UseStartNumberingRespondent": true,  # false
    "StartNumberingRespondentAt": 0,  # false
    "UseSEQSequentialNumbering": true,  # false
    "FieldDelimitor": "string",  # comma
    "AlwaysEncloseFields": true,  # false
    "IncludeHeader": true,
    "MergeMultipleOpenEnd": true,  # false
    "Encoding": "string",  # utf-8
    "AllowRenumbering": true,  # false
    "DapresyDataFormat": true,  # false
    "DichotomizedMultiple": true,  # false
    "DichotomizedMultipleWithMissing": true,  # false
    "DichotomizedHeaderChoice": "string",  # false
    "SpssVersion": "string",  # false
    "SpssOpenEndFieldSize": 0,  # idk
    "ReplaceEmptyWithMinus9999And9998": true,  # false
    "OpenEndDisposition": "string",  # false
    "OpenEndLenght": 0,  # false
    "TripleS": true,  # false
    "TripleSXML": true,  # false
    "SPSS": true,  # false
    "SAS": true,  # false
    "COSI": true,  # false
    "QuantumAxix": true,  # false
    "StatXP": true,  # false
    "ADL": true,  # false
    "MaxRecordWidth": 0,
    "SourceFilterDefinition": {
      "FilterId": 0,
      "FilterTitle": "string",
      "ProjectId": 0,
      "QuestionList": {
        "additionalProp1": {},
        "additionalProp2": {},
        "additionalProp3": {}
      },
      "Location": "string",
      "DialingMode": "All",
      "TimeSlotMode": "All",
      "TimeSlotId": "string",
      "TimeSlotOperator": "string",
      "TimeSlotHitCount": "string",
      "LastDialingMode": "All",
      "RespondentCase": "CallBack",
      "RespondentState": "All",
      "LastCallDateTime": {
        "startdate": "2024-12-10T20:54:26.535Z",
        "enddate": "2024-12-10T20:54:26.535Z",
        "starttime": "2024-12-10T20:54:26.535Z",
        "endtime": "2024-12-10T20:54:26.535Z"
      },
      "CallBackDateTime": {
        "startdate": "2024-12-10T20:54:26.535Z",
        "enddate": "2024-12-10T20:54:26.535Z",
        "starttime": "2024-12-10T20:54:26.535Z",
        "endtime": "2024-12-10T20:54:26.535Z"
      },
      "IsLastCallDateTimeTreadtedSeperatly": true,
      "IsCallbackDateTimeTreatedSeperatly": true,
      "IsCallBack": true,
      "IsNotRecoded": true,
      "ViewAdditionalColumns": "string",
      "QuestionHasOpenEnd": "string",
      "IsNotInClosedStrata": true,
      "InterviewerIds": "string",
      "ResultCodes": "string",
      "LastCallResultCodes": "string",
      "Languages": "string",
      "UserTimeZone": 0,
      "LinkedToA4S": "All",
      "IsMissingRecords": true,
      "IsMissingRecordsPronto": true,
      "ExcludeRecordsInInterview": true,
      "SqlStatementWithOrWithoutEquation": "string",
      "Equation": "string",
      "UseCurrentDateForStartCallBack": true,
      "CallBackDateTimeFromDate": "2024-12-10T20:54:26.535Z",
      "CallBackDateTimeFromTime": "2024-12-10T20:54:26.535Z",
      "UseCurrentDateForEndCallBack": true,
      "CallBackDateTimeToDate": "2024-12-10T20:54:26.535Z",
      "CallBackDateTimeToTime": "2024-12-10T20:54:26.535Z",
      "UseCurrentDateForStartLastCall": true,
      "LastCallDateTimeStartDate": "2024-12-10T20:54:26.535Z",
      "LastCallDateTimeStartTime": "2024-12-10T20:54:26.535Z",
      "UseCurrentDateForEndLastCall": true,
      "LastCallDateTimeEndDate": "2024-12-10T20:54:26.535Z",
      "LastCallDateTimeEndTime": "2024-12-10T20:54:26.535Z",
      "IsValid": true,
      "Summary": "string",
      "Count": 0,
      "CyclePhoneNumber": "All",
      "KeywordFilter": [
        "string"
      ],
      "Selection": "All",
      "State": "Inactive",
      "NumberOfCases": 0,
      "AgentId": 0,
      "IsAnonymized": true,
      "MaxRecords": 0,
      "CaseFilterType": "Browse",
      "LastModificationDateTimeStartDate": "2024-12-10T20:54:26.535Z",
      "IsLastModificationDateTimeTreatedSeperatly": true,
      "CompletedDateTime": {
        "startdate": "2024-12-10T20:54:26.535Z",
        "enddate": "2024-12-10T20:54:26.535Z",
        "starttime": "2024-12-10T20:54:26.535Z",
        "endtime": "2024-12-10T20:54:26.535Z"
      },
      "IsCompletedDateTimeTreatedSeperatly": true,
      "CompletedDateTimeStartDate": "2024-12-10T20:54:26.535Z",
      "CompletedDateTimeEndDate": "2024-12-10T20:54:26.535Z"
    },
    "SelectedQuestions": [
      {
        "Id": 0,
        "Alias": "string",
        "Name": "string",
        "DisplayName": "string",
        "IsSystemVariable": true,
        "Rank": 0,
        "RecordPosition": 0,
        "ColumnPosition": 0,
        "IsOpenEnd": true,
        "Label": "string",
        "FieldLength": 0
      }
    ],
    "DestinationFile": "string",
    "DestinationFileFormat": "string",
    "FileServerPath": "string",
    "ExportedFileNames": "string"
  },
  "TaskStatus": "Stopped",
  "ExecutionProgress": 0,
  "TaskResultMessage": "string"
}