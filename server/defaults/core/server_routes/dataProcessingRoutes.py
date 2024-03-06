import shutil

from flask import Blueprint, request, make_response, send_file

from server.defaults.utils.database.datapuller import DataPuller
from .config import allowed_domain
from ..data_processing.reader import Reader

data_processor = Blueprint('data_process', __name__)
dp = DataPuller()

reader = Reader()


@data_processor.route('/data_processing', methods=['POST', 'GET', 'OPTIONS'])
def data_processing():
    return ''


@data_processor.route('/data_processing/checkboxes', methods=['POST', 'OPTIONS'])
def data_processing_questions():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    reader.request_data()
    questions = reader.get_order()
    return questions


@data_processor.route('/data_processing/questions/process_data', methods=['POST', 'OPTIONS'])
def process_data():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    reader.set_data_layout(request.json)
    reader.run()

    shutil.make_archive("./defaults/core/server_routes/EXTRACTION", "zip", "EXTRACTION")

    return ''


@data_processor.route("/data_processing/download", methods=["GET", 'OPTIONS'])
def download():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    sendfile = send_file(r"EXTRACTION.zip", as_attachment=True)
    return sendfile


@data_processor.route("/data_processing/survey_name", methods=['POST', 'OPTIONS'])
def survey_name():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    survey_id = request.json['surveyID']
    reader.setUrl(survey_id)

    return reader.get_survey_name()


@data_processor.route('/', methods=['GET', 'OPTIONS'])
def index():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    return {"Working": "Code"}


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', allowed_domain)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
