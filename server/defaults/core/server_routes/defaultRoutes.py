import shutil

from flask import Flask, request, jsonify, session, make_response, send_file
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session

from .config import ApplicationConfig
from ..auth.models import db, User
from ..data_processing.reader import Reader

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:3000'], expose_headers=["Content-Disposition"])
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

reader = Reader()


@app.route('/data_processing', methods=['POST', 'GET', 'OPTIONS'])
# @cross_origin()
def data_processing():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    survey_id = request.json['surveyID']
    project_id = request.json['projectID']

    Reader.project_id = project_id
    reader.setUrl(survey_id)

    return ''


@app.route('/data_processing/questions', methods=['POST', 'OPTIONS'])
# @cross_origin(support_credentials=True)
def data_processing_questions():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    survey_id = request.json['surveyID']
    project_id = request.json['projectID']

    Reader.project_id = project_id
    reader.setUrl(survey_id)
    questions = reader.get_order()

    return questions


@app.route('/data_processing/questions/process_data', methods=['POST', 'OPTIONS'])
# @cross_origin()
def process_data():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    reader.set_skips(request.json)
    reader.run()

    shutil.make_archive("./defaults/core/server_routes/EXTRACTION", "zip", "EXTRACTION")

    return "Zip created"


@app.route("/data_processing/download", methods=["GET", 'OPTIONS'])
# @cross_origin()
def download():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    sendfile = send_file(r"EXTRACTION.zip", as_attachment=True)
    return sendfile


@app.route('/', methods=['GET', 'OPTIONS'])
# @cross_origin()
def index():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    return {"Working": "Code"}


@app.route('/home', methods=['GET', 'POST', 'OPTIONS'])
# @cross_origin()
def home():
    """App home page"""
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    return {"test Data": "1"}


@app.route("/@me", methods=['GET', 'OPTIONS'])
def get_current_user():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    user_id = session.get("user_id")
    print('\nsession ')
    print(session)
    print('\nuser id ')
    print(user_id)

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route("/register", methods=["POST", 'OPTIONS'])
# @cross_origin()
def register():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    email = request.form['email']
    password = request.form['password']

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })


@app.route('/login', methods=['POST', 'OPTIONS'])
# @cross_origin()
def login():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    print('\n')
    print(session)
    print('\n')


    return jsonify({
        "id": user.id,
        "email": user.email
    })


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


