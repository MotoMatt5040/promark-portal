from flask import Flask
from ....defaults.utils.database.datapuller import DataPuller
from .config import ApplicationConfig
from ..auth.models import db

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

db.init_app(app)
with app.app_context():
    db.create_all()

data_puller = DataPuller()


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

@app.route('/login', methods=['POST'])
def login():
    token = None
    return {"token": token}