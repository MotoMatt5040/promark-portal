import os
import random
import string
from datetime import date

from flask import Flask, request, jsonify, session, make_response, url_for, flash
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required
from flask_session import Session
from flask_wtf.csrf import CSRFProtect, generate_csrf
from itsdangerous import TimedSerializer

from .config import ApplicationConfig
from .config import allowed_domain
from .dataProcessingRoutes import data_processor
from .periodicUpdateRoutes import periodic_update
from .quotaManagementModuleRoutes import quotas
from ..auth.models import db, User

login_manager = LoginManager()

app = Flask(__name__)

app.config.from_object(ApplicationConfig)
CORS(app, supports_credentials=True, origins=[allowed_domain], expose_headers=["Content-Disposition", "X-CSRFToken"])


csrf = CSRFProtect(app)
bcrypt = Bcrypt(app)
login_manager.init_app(app)
server_session = Session(app)
db.init_app(app)
csrf.init_app(app)
login_manager.init_app(app)

app.register_blueprint(periodic_update)  # This is used to allow the routes to be in other files
app.register_blueprint(data_processor, url_prefix="/data_processing")
app.register_blueprint(quotas, url_prefix="/quotas")

#  uncomment this to create needed tables from models.py
with app.app_context():
    # db.create_all()

    admins = ['matt', 'jj', 'wayne', 'test']
    for admin in admins:
        user_exists = User.query.filter_by(email=os.environ[f'{admin}_email']).first() is not None
        if not user_exists:
            new_user = User(
                email=os.environ[f'{admin}_email'],
                password=bcrypt.generate_password_hash(os.environ[f'{admin}_password']),
                production_dashboard=1,
                data_processing=1,
                global_quota_module=1,
                add_user=1,
                created_by='system',
                date_created=str(date.today()),
                active_employee=True
            )
            db.session.add(new_user)
            db.session.commit()


@app.route('/')
def index():
    if 'email' in session:
        return f'Logged in as {session["email"]}'
    return 'You are not logged in'


@app.route('/home', methods=['GET', 'POST', 'OPTIONS'])
@login_required
def home():
    """App home page"""
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    return {'home': 'test'}


@app.route("/register", methods=["POST", 'OPTIONS'])
def register():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    if request.method == 'POST':
        email = request.json['email']
        password = request.json['password']

        user_exists = User.query.filter_by(email=email).first() is not None

        if user_exists:
            return jsonify({
                "report": "User already exists"
            }), 409

        hashed_password = bcrypt.generate_password_hash(password)
        new_user = User(
            email=email,
            password=hashed_password,
            created_by=session['email'],
            date_created=date.today()
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "email": new_user.email,
            'report': 'Registered.'
        })
    return []


@app.route('/user', methods=['POST', 'OPTIONS'])
def user():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    if "email" not in session:
        return jsonify({
            'report': 'Invalid credentials.'
        }), 401

    user = User.query.filter_by(email=session['email']).first()
    dispatcher = {
        '/periodic_update': user.production_dashboard,
        '/data_processing': user.data_processing,
        '/global_quotas': user.global_quota_module,
        '/add_user': user.add_user
    }

    role = request.json['role']

    if not dispatcher[role]:
        return jsonify({
            'report': 'User does not have the required authorization to perform this request'
        }), 403

    return jsonify({
        'report': 'Validated.'
    }), 200


@app.route('/login', methods=['POST', 'OPTIONS'])
@csrf.exempt
def login():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    session['email'] = request.json['email']

    email = request.json['email']
    password = request.json['password']
    remember = request.json['remember']

    user = User.query.filter_by(email=email).first()

    if user is None:
        flash("Login failed.")
        return jsonify({
            "report": "Invalid credentials."
        }), 401

    if request.method == 'POST':
        session.pop('_flashes', None)

        # if user password is incorrect, we return
        if not bcrypt.check_password_hash(user.password, password):
            flash('Login failed.')
            return jsonify({
                'report': 'Invalid credentials.',
            }), 401
        user.authenticated = True
        db.session.commit()

        login_user(user, remember=remember)
        flash('Login successful.')

    csrf_token = generate_csrf()  # Generate CSRF token
    if session.get("csrf_token") is None:
        session['csrf_token'] = csrf_token
    response = make_response(
        jsonify({
            'user': session['email'],
            'report': 'Logged in.'
        }), 200
    )
    response.headers['X-Csrftoken'] = csrf_token

    return response


@app.route("/verify", methods=["GET", 'POST', 'OPTIONS'])
@login_required
def verify():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    return "working"


@app.route('/add_user', methods=['POST'])
def add_user():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    current_user = User.query.filter_by(email=session['email'])

    if current_user is None:
        return jsonify({
            'report': 'User not found'
        }), 401

    if current_user.session_id != request.json['session']:
        return jsonify({
            'report': 'Invalid credentials.'
        }), 401

    if current_user.add_user != 1:
        return jsonify({
            'report': 'User does not have the required authorization to perform this request'
        }), 401

    user_exists = User.query.filter_by(email=request.json['email']).first() is not None

    if user_exists:
        return jsonify({
            'email': request.json['email'],
            'report': 'User already exists in the database.'
        }), 409

    new_user = User(
        email=request.json['email'],
        password=''.join(
            random.SystemRandom().choice(
                string.ascii_uppercase +
                string.ascii_lowercase +
                string.digits
            ) for _ in range(20)
        ),
        temp_password=''.join(
            random.SystemRandom().choice(
                string.ascii_uppercase +
                string.ascii_lowercase +
                string.digits
            ) for _ in range(10)
        ),
        production_dashboard=request.json['production_dashboard'],
        data_processing=request.json['data_processing'],
        global_quota_module=request.json['global_quota_module'],
        add_user=request.json['add_user'],
        created_by=session['email'],
        date_created=str(date.today())
    )

    db.session.add(new_user)
    db.session.commit()

    s = TimedSerializer(os.environ['secret_key'], 60 * 30)
    token = s.dumps({'email': session['email']}).decode('utf-8')
    inv_url = url_for('invite', token=token)

    return jsonify({
        'email': request.json['email'],
        'report': 'User has been added to the database.'
    })


@app.route('/logout', methods=["GET"])
@login_required
def logout():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    user.authenticated = False
    db.session.commit()
    logout_user()

    try:
        session.pop('email', None)
        session.pop('csrf_token', None)
        flash("Successfully logged out.")
    except:
        pass
    return jsonify({
        'status': 'ok',
        'report': 'User has successfully been logged out.'
    })


@login_manager.user_loader
def user_loader(user_id):
    """Given *user_id*, return the associated User object.

    :param unicode user_id: user_id (email) user to retrieve

    """
    return User.query.get(user_id)


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', allowed_domain)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRFToken")
    response.headers.add('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
