from flask import Flask, request, abort, jsonify
from flask_bcrypt import Bcrypt

from .config import ApplicationConfig
from ..auth.models import db, User
# from defaults.utils.database.datapuller import DataPuller

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
db.init_app(app)

with app.app_context():
    db.create_all()

# data_puller = DataPuller()


@app.route('/', methods=['GET'])
def index():
    return {"Working": "Code"}

@app.route('/home', methods=['GET', 'POST'])
def home():
    """App home page"""
    # return render_template('')
    # return render_template('home.html')
    # print("connection found")
    print("test")
    return {"test Data": "1"}

@app.route('/texting_platform/sample_upload', methods=['GET', 'POST'])
def testthingy():
    """App home page"""
    # return render_template('')
    # return render_template('home.html')
    # print("connection found")
    print("IM WORKING")
    return {"test Data": "1"}

@app.route("/register", methods=["POST"])
def register():
    email = request.json['email']
    password = request.json['password']

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        abort(409)

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
    token = None
    return {"token": token}