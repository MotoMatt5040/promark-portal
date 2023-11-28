from flask import Flask, request, jsonify, session, make_response, send_file
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_session import Session

from .config import ApplicationConfig
from ..auth.models import db, User
from ..data_processing.reader import Reader
import shutil
import json

# from defaults.utils.database.datapuller import DataPuller

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['*'])
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

# with app.app_context():
#     db.create_all()

# data_puller = DataPuller()
reader = Reader()



@app.route('/', methods=['GET'])
def index():
    return {"Working": "Code"}


@app.route('/home', methods=['GET', 'POST'])
def home():
    """App home page"""
    print("test")
    return {"test Data": "1"}


@app.route("/@me", methods=['GET'])
def get_current_user():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    user_id = session.get("user_id")
    print('\n')
    print(session)
    print('\n')

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()

    print(jsonify({
        "id": user.id,
        "email": user.email
    }))

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/register", methods=["POST"])
def register():
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


@app.route('/login', methods=['POST'])
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


@app.route('/data_processing', methods=['POST', 'GET'])
def data_processing():
    # if request.method == "OPTIONS":  # CORS preflight
    response = _build_cors_preflight_response()
    # response.headers.add("Content-Disposition", "attachment;filename=file.txt")

    survey_id = request.json['surveyID']
    project_id = request.json['projectID']

    Reader.project_id = project_id
    reader.setUrl(survey_id)

    # reader.run()

    # origin_path = Path(rf"i:\PROJ\{project_id}")
    # database_path = Path(rf"\DATABASE\{project_id}")

    return response
    # return Path(rf"{origin_path}\UNCLE\{project_id} tables"), \
    #     Path(f"{origin_path}{database_path} layout.xlsx"), \
    #     Path(f"{origin_path}{database_path} xfile.xlsx")


@app.route('/data_processing/questions', methods=['POST'])
@cross_origin()
def data_processing_questions():
    response = _build_cors_preflight_response()
    survey_id = request.json['surveyID']
    project_id = request.json['projectID']

    # questions = jsonify(reader.get_questions())
    Reader.project_id = project_id
    reader.setUrl(survey_id)
    questions = reader.get_order()

    # print(questions.json)

    return questions

@app.route('/data_processing/questions/process_data', methods=['POST'])
@cross_origin()
def process_data():
    response = _build_cors_preflight_response()
    reader.set_skips(request.json)
    reader.run()

    shutil.make_archive("./defaults/core/server_routes/EXTRACTION", "zip", "EXTRACTION")

    return "Zip created"

@app.route("/data_processing/download", methods=["GET"])
@cross_origin()
def download():
    response = _build_cors_preflight_response()
    return send_file(r"EXTRACTION.zip", as_attachment=True)


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


