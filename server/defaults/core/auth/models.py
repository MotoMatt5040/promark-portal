from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "tblPortalUsers"
    empid = db.Column(db.Text, unique=True, nullable=True)

    email = db.Column(db.String(345), primary_key=True, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    salt = db.Column(db.Text, nullable=False)
    temp_password = db.Column(db.Text, nullable=True)

    twofactor_enabled = db.Column(db.Text, nullable=True)  # 0 disabled, 1 phone, 2 email, 3 both
    phone = db.Column(db.Text, nullable=True)

    secret_question_one = db.Column(db.Text, nullable=True)
    secret_question_one_salt = db.Column(db.Text, nullable=True)
    secret_answer_one = db.Column(db.Text, nullable=True)
    secret_answer_one_salt = db.Column(db.Text, nullable=True)

    secret_question_two = db.Column(db.Text, nullable=True)
    secret_question_two_salt = db.Column(db.Text, nullable=True)
    secret_answer_two = db.Column(db.Text, nullable=True)
    secret_answer_two_salt = db.Column(db.Text, nullable=True)
