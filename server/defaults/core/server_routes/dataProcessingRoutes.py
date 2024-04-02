import shutil

from flask import Blueprint, request, make_response, send_file, session
from flask_login import login_required, current_user

from server.defaults.utils.database.datapuller import DataPuller
from .config import allowed_domain
from ..data_processing.reader import Reader
from ..auth.models import db, User

data_processor = Blueprint('data_process', __name__)
dp = DataPuller()

reader = Reader()


@data_processor.before_request
@login_required
def permissions():
    user = User.query.filter_by(email=current_user.get_id()).first()
    if user is not None:
        if not user.data_processing:
            return "Not Authorized"
    pass

@data_processor.route('/', methods=['POST', 'GET', 'OPTIONS'])
def data_processing():
    return ''


@data_processor.route('/checkboxes', methods=['POST', 'OPTIONS'])
def data_processing_questions():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    reader.request_data()
    questions = reader.get_order()
    return questions


@data_processor.route('/questions/process_data', methods=['POST', 'OPTIONS'])
def process_data():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    reader.set_data_layout(request.json)
    reader.run()

    shutil.make_archive("./defaults/core/server_routes/EXTRACTION", "zip", "EXTRACTION")

    return ''


@data_processor.route("/download", methods=["GET", 'OPTIONS'])
def download():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    sendfile = send_file(r"EXTRACTION.zip", as_attachment=True)
    return sendfile


@data_processor.route("/survey_name", methods=['POST', 'OPTIONS'])
def survey_name():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    survey_id = request.json['surveyID']
    reader.setUrl(survey_id)

    return reader.get_survey_name()


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', allowed_domain)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRFToken")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
