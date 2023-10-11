# from config import Config
from flask import Flask
# from flask_login import LoginManager
# from flask_migrate import Migrate
# from flask_sqlalchemy import SQLAlchemy

from server.defaults.utils.database.datapuller import DataPuller

app = Flask(__name__)

# TODO This was added to test login and permissions (user authentication)
# app.config.from_object(Config)
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)
# login = LoginManager(app)
# TODO This was added to test login and permissions (user authentication)

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