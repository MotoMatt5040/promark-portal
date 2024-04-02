from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin


db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = "tblPortalUsers"
    email = db.Column(db.String(345), primary_key=True, unique=True, nullable=False)
    empid = db.Column(db.String(10), nullable=True)

    password = db.Column(db.Text, nullable=False)
    temp_password = db.Column(db.String(10), nullable=True)

    twofactor_enabled = db.Column(db.Integer, nullable=True)  # 0 disabled, 1 phone, 2 email, 3 both
    phone = db.Column(db.String(10), nullable=True)

    secret_question_one = db.Column(db.Text, nullable=True)
    secret_answer_one = db.Column(db.Text, nullable=True)

    secret_question_two = db.Column(db.Text, nullable=True)
    secret_answer_two = db.Column(db.Text, nullable=True)

    # permissions
    production_dashboard = db.Column(db.Boolean, nullable=False)
    data_processing = db.Column(db.Boolean, nullable=False)
    global_quota_module = db.Column(db.Boolean, nullable=False)
    add_user = db.Column(db.Boolean, nullable=False)

    # creation monitor
    created_by = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)

    # current session key if it exists
    authenticated = db.Column(db.Boolean, default=False)
    session_id = db.Column(db.String(100), nullable=True)
    session_date_created = db.Column(db.DateTime, nullable=True)
    session_expiration_date = db.Column(db.DateTime, nullable=True)

    active_employee = db.Column(db.Boolean, nullable=False)

    @property
    def is_authenticated(self) -> bool:
        return self.authenticated

    @property
    def is_active(self) -> bool:
        return True

    @property
    def is_anonymous(self) -> bool:
        return False

    def get_id(self) -> str:
        return self.email

    def get_permissions(self):
        return {
            "production_dashboard": self.production_dashboard,
            "data_processing": self.data_processing,
            "global_quota_module": self.global_quota_module,
            "add_user": self.add_user
        }