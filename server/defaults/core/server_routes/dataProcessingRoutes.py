import json
import shutil
from datetime import datetime

from flask import Blueprint, request, make_response, send_file
from flask_login import login_required, current_user

from server.defaults.utils.database.datapuller import DataPuller
from .config import allowed_domain
from ..auth.models import db, User, DataProcessingChecklist
# from ..data_processing.reader import Reader
from ..data_processing_test.apidata import VoxcoDataGrabber, Toplines

data_processor = Blueprint('data_process', __name__)
dp = DataPuller()

# reader = Reader()
dg = VoxcoDataGrabber()
toplines = Toplines()
# print("DATA LAYOUT", json.dumps(dg.json_layout, indent=4))

# DPApi.sid = 450
# print(ExtractionTask.sid, 'ext')
# DPApi.sid = 419
# print(ExtractionTask.sid, 'ext2')
# ExtractionTask.sid = 12
# DPApi.sid = 100
# print(ExtractionTask.sid, 'ext3')


# @data_processor.before_request
# @login_required
# def permissions():
#     user = User.query.filter_by(email=current_user.get_id()).first()
#     if user is not None:
#         if not user.data_processing:
#             return "Not Authorized"
#     pass


@data_processor.route("/task_list", methods=["POST", "OPTIONS"])
def task_list():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    if request.method == "POST":
        # sid = request.json['surveyID']
        # dg.sid = sid

        tasks = dg.target_task_list()
        return make_response(
            tasks
        )


@data_processor.route("/survey_name", methods=['POST', 'OPTIONS'])
def survey_name():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    dg = VoxcoDataGrabber()

    sid = request.json['surveyID']
    dg.sid = sid
    dg.reset_data()
    # survey_name = dg.survey_name()
    # if request.json['source'] == 'web':
    #     sid = request.json['surveyID']
    #     dg.sid = sid
    #     dg.reset_data()
    #     survey_name = dg.survey_name()
    # else:
    #     survey_name = "toplines"

    survey_name = dg.survey_name()
    print(survey_name)

    return survey_name


@data_processor.route('/checkboxes', methods=['POST', 'OPTIONS'])
def data_processing_questions():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    questions = dg.get_target_task_data(
        extraction_id=request.json['extractionId'],
        task_name=request.json['taskName']
    )
    dg.fetch_variables()
    dg.fetch_questions()

    # Used to write data to files for error checking
    with open("variables.txt", 'w', encoding='utf-8') as f:
        json.dump(dg.variables, f, ensure_ascii=False, indent=4)
    with open("questions.txt", 'w', encoding='utf-8') as f:
        json.dump(dg.questions, f, ensure_ascii=False, indent=4)

    return questions


@data_processor.route('/has_table', methods=['POST', 'OPTIONS'])
def has_table():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    case = request.json.get('case')

    dg.lower_case = False

    if case:
        dg.lower_case = True

    dg.fetch_raw_data()
    dg.has_table(request.json['selectedValues'])
    dg.restructure()

    dg.identify_qualifiers()
    dg.clean_data()
    dg.partyid()
    dg.ideology()
    res = make_response({}, 200)
    style = request.json.get('style')
    if not style:
        dg.temp_write()
    else:
        dg.temp_write(style)
    return res


@data_processor.route('/questions/process_data', methods=['POST', 'OPTIONS'])
def process_data():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    dg.has_table(request.json['selectedValues'])
    # print(json.dumps(dg.final_data, indent=4))
    # print(json.dumps(dg.raw_data, indent=4))

    # reader.set_data_layout(request.json)
    # reader.run()

    shutil.make_archive("./defaults/core/server_routes/EXTRACTION", "zip", "EXTRACTION")

    data = []
    with open("EXTRACTION/UNCLE/tables.txt", 'r') as f:
        for line in f.readlines():
            data.append(line.replace('\n', ''))

    res = make_response(
        {
            'tables': data
        }
    )
    return res


@data_processor.route('/', methods=['POST', 'GET', 'OPTIONS'])
def data_processing():
    return ''


@data_processor.route('/uncle_tables', methods=['GET', 'OPTIONS'])
def uncle_tables():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()


@data_processor.route("/download", methods=["GET", 'OPTIONS'])
def download():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    sendfile = send_file(r"EXTRACTION.zip", as_attachment=True)
    return sendfile


# @data_processor.route("/checklist/status", methods=['GET', 'POST', 'OPTIONS'])
# def checklist():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
#
#     if request.json['surveyID'] is None:
#         return make_response(
#             {"report": "Project ID is required"},
#             401
#         )
#
#     if request.method == "POST":
#         checklist_exists = DataProcessingChecklist.query.filter_by(project_id=request.json['surveyID']).first() is not None
#         if not checklist_exists:
#             new_checklist = DataProcessingChecklist(
#                 project_id=request.json['surveyID'],
#                 date_created=datetime.now(),
#                 created_by=current_user.get_id(),
#                 last_updated=None,
#                 updated_by=None,
#
#                 order_created=False,
#                 order_date_created=None,
#                 order_created_by=None,
#                 order_last_date_updated=None,
#                 order_last_updated_by=None,
#
#                 directories_created=False,
#                 directories_date_created=None,
#                 directories_created_by=None,
#                 directories_last_date_updated=None,
#                 directories_last_updated_by=None,
#
#                 files_created=False,
#                 files_date_created=None,
#                 files_created_by=None,
#                 files_last_date_updated=None,
#                 files_last_updated_by=None,
#
#                 project_created=False,
#                 project_date_created=None,
#                 project_created_by=None,
#                 project_last_date_updated=None,
#                 project_last_updated_by=None,
#
#                 usort_created=False,
#                 usort_date_created=None,
#                 usort_created_by=None,
#                 usort_last_date_updated=None,
#                 usort_last_updated_by=None,
#
#                 uncle_created=False,
#                 uncle_date_created=None,
#                 uncle_created_by=None,
#                 uncle_last_date_updated=None,
#                 uncle_last_updated_by=None,
#
#                 table_cleanup_created=False,
#                 table_cleanup_date_created=None,
#                 table_cleanup_created_by=None,
#                 table_cleanup_last_date_updated=None,
#                 table_cleanup_last_updated_by=None,
#
#                 stubs_checked_created=False,
#                 stubs_checked_date_created=None,
#                 stubs_checked_created_by=None,
#                 stubs_checked_last_date_updated=None,
#                 stubs_checked_last_updated_by=None,
#
#                 banners_created=False,
#                 banners_date_created=None,
#                 banners_created_by=None,
#                 banners_last_date_updated=None,
#                 banners_last_updated_by=None
#             )
#
#             db.session.add(new_checklist)
#             db.session.commit()
#
#             response = make_response(
#                 {"report": "Checklist created successfully"},
#                 200
#             )
#             return response
#         data = DataProcessingChecklist.query.filter_by(project_id=request.json['surveyID']).first()
#         response = make_response(
#             {
#                 "order": data.order_created,
#                 "directories": data.directories_created,
#                 "files": data.files_created,
#                 "project": data.project_created,
#                 "usort": data.usort_created,
#                 "uncle": data.uncle_created,
#                 "table_cleanup": data.table_cleanup_created,
#                 "stubs_checked": data.stubs_checked_created,
#                 "banners": data.banners_created
#             },
#             200
#         )
#         return response
#
#     return make_response(
#         {"report": "Checklist already exists"},
#         200
#     )
#
#
# @data_processor.route("/checklist/complete", methods=['POST', 'OPTIONS'])
# def checklist_item_complete():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
#
#     if request.method == "POST":
#         checklist_item = DataProcessingChecklist.query.filter_by(project_id=request.json['surveyID']).first()
#         match request.json['item']:
#             case 'order':
#                 if not checklist_item.order_created:
#                     checklist_item.order_date_created = datetime.now()
#                     checklist_item.order_created_by = current_user.get_id()
#                 else:
#                     checklist_item.order_last_updated = datetime.now()
#                     checklist_item.order_last_updated_by = current_user.get_id()
#                 checklist_item.order_created = True
#             case 'directories':
#                 if not checklist_item.directories_created:
#                     checklist_item.directories_date_created = datetime.now()
#                     checklist_item.directories_created_by = current_user.get_id()
#                 else:
#                     checklist_item.directories_last_updated = datetime.now()
#                     checklist_item.directories_last_updated_by = current_user.get_id()
#                 checklist_item.directories_created = True
#             case 'files':
#                 if not checklist_item.files_created:
#                     checklist_item.files_date_created = datetime.now()
#                     checklist_item.files_created_by = current_user.get_id()
#                 else:
#                     checklist_item.files_last_updated = datetime.now()
#                     checklist_item.files_last_updated_by = current_user.get_id()
#                 checklist_item.files_created = True
#             case 'project':
#                 if not checklist_item.project_created:
#                     checklist_item.project_date_created = datetime.now()
#                     checklist_item.project_created_by = current_user.get_id()
#                 else:
#                     checklist_item.project_last_updated = datetime.now()
#                     checklist_item.project_last_updated_by = current_user.get_id()
#                 checklist_item.project_created = True
#             case 'usort':
#                 if not checklist_item.usort_created:
#                     checklist_item.usort_date_created = datetime.now()
#                     checklist_item.usort_created_by = current_user.get_id()
#                 else:
#                     checklist_item.usort_last_updated = datetime.now()
#                     checklist_item.usort_last_updated_by = current_user.get_id()
#                 checklist_item.usort_created = True
#             case 'uncle':
#                 if not checklist_item.uncle_created:
#                     checklist_item.uncle_date_created = datetime.now()
#                     checklist_item.uncle_created_by = current_user.get_id()
#                 else:
#                     checklist_item.uncle_last_updated = datetime.now()
#                     checklist_item.uncle_last_updated_by = current_user.get_id()
#                 checklist_item.uncle_created = True
#             case 'table_cleanup':
#                 if not checklist_item.table_cleanup_created:
#                     checklist_item.table_cleanup_date_created = datetime.now()
#                     checklist_item.table_cleanup_created_by = current_user.get_id()
#                 else:
#                     checklist_item.table_cleanup_last_updated = datetime.now()
#                     checklist_item.table_cleanup_last_updated_by = current_user.get_id()
#                 checklist_item.table_cleanup_created = True
#             case 'stubs_checked':
#                 if not checklist_item.stubs_checked_created:
#                     checklist_item.stubs_checked_date_created = datetime.now()
#                     checklist_item.stubs_checked_created_by = current_user.get_id()
#                 else:
#                     checklist_item.stubs_checked_last_updated = datetime.now()
#                     checklist_item.stubs_checked_last_updated_by = current_user.get_id()
#                 checklist_item.stubs_checked_created = True
#             case 'banners':
#                 if not checklist_item.banners_created:
#                     checklist_item.banners_date_created = datetime.now()
#                     checklist_item.banners_created_by = current_user.get_id()
#                 else:
#                     checklist_item.banners_last_updated = datetime.now()
#                     checklist_item.banners_last_updated_by = current_user.get_id()
#                 checklist_item.banners_created = True
#
#             case _:
#                 return make_response({
#                     'report': 'Invalid checklist item'
#                 }), 401
#
#         db.session.commit()
#         return make_response(
#             {'report': 'Checklist item updated to complete successfully'},
#             200
#         )
#
#
# @data_processor.route("/checklist/incomplete", methods=['POST', 'OPTIONS'])
# def checklist_item_incomplete():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
#
#     if request.method == "POST":
#         checklist_item = DataProcessingChecklist.query.filter_by(project_id=request.json['surveyID']).first()
#         match request.json['item']:
#             case 'order':
#                 checklist_item.order_created = False
#                 checklist_item.order_last_updated = datetime.now()
#                 checklist_item.order_last_updated_by = current_user.get_id()
#             case 'directories':
#                 checklist_item.directories_created = False
#                 checklist_item.directories_last_updated = datetime.now()
#                 checklist_item.directories_last_updated_by = current_user.get_id()
#             case 'files':
#                 checklist_item.files_created = False
#                 checklist_item.files_last_updated = datetime.now()
#                 checklist_item.files_last_updated_by = current_user.get_id()
#             case 'project':
#                 checklist_item.project_created = False
#                 checklist_item.project_last_updated = datetime.now()
#                 checklist_item.project_last_updated_by = current_user.get_id()
#             case 'usort':
#                 checklist_item.usort_created = False
#                 checklist_item.usort_last_updated = datetime.now()
#                 checklist_item.usort_last_updated_by = current_user.get_id()
#             case 'uncle':
#                 checklist_item.uncle_created = False
#                 checklist_item.uncle_last_updated = datetime.now()
#                 checklist_item.uncle_last_updated_by = current_user.get_id()
#             case 'table_cleanup':
#                 checklist_item.table_cleanup_created = False
#                 checklist_item.table_cleanup_last_updated = datetime.now()
#                 checklist_item.table_cleanup_last_updated_by = current_user.get_id()
#             case 'stubs_checked':
#                 checklist_item.stubs_checked_created = False
#                 checklist_item.stubs_checked_last_updated = datetime.now()
#                 checklist_item.stubs_checked_last_updated_by = current_user.get_id()
#             case 'banners':
#                 checklist_item.banners_created = False
#                 checklist_item.banners_last_updated = datetime.now()
#                 checklist_item.banners_last_updated_by = current_user.get_id()
#             case _:
#                 return make_response({
#                     'report': 'Invalid checklist item'
#                 }), 401
#         db.session.commit()
#         return make_response(
#             {'report': 'Checklist item updated to incomplete successfully'},
#             200
#         )


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', allowed_domain)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRFToken")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
