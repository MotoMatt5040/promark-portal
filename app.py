from config import Config
from flask import Flask, render_template
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from utils.database.datapuller import DataPuller


app = Flask(__name__)
# TODO This was added to test login and permissions (user authentication)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = loginManager(app)
# TODO This was added to test login and permissions (user authentication)

data_puller = DataPuller()


@app.route('/home', methods=['GET', 'POST'])
def home():
    """App home page"""
    # return render_template('')
    # return render_template('home.html')
    # print("connection found")
    return {"test Data": "1"}


if __name__ == '__main__':
    # app.run(debug=True)
    app.run(ssl_context=('c38827a1bd357111.pem', 'promarkresearch.com.key'))  # this is required to run the proxy
