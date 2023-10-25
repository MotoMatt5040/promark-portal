from flask import Flask, request, jsonify, session, make_response
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
from ..data_processing.reader import Reader
# from flask-redis import Redis
from pathlib import Path

from .config import ApplicationConfig
from ..auth.models import db, User

# from defaults.utils.database.datapuller import DataPuller

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:3001'])
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

# with app.app_context():
#     db.create_all()

# data_puller = DataPuller()


@app.route('/', methods=['GET'])
def index():
    return {"Working": "Code"}

@app.route('/home', methods=['GET', 'POST'])
def home():
    """App home page"""
    print("test")
    return {"test Data": "1"}

@app.route('/texting_platform/sample_upload', methods=['GET', 'POST'])
def testthingy():
    """App home page"""
    print("IM WORKING")
    return {"test Data": "1"}

@app.route("/@me", methods=['GET'])
def get_current_user():
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
    survey_id = request.json['survey_id']
    project_id = request.json['project_id']

    origin_path = Path(rf"i:\PROJ\{project_id}")
    database_path = Path(rf"\DATABASE\{project_id}")

    Reader(project_id).setUrl(survey_id)

    return Path(rf"{origin_path}\UNCLE\{project_id} tables"), \
        Path(f"{origin_path}{database_path} layout.xlsx"), \
        Path(f"{origin_path}{database_path} xfile.xlsx")


