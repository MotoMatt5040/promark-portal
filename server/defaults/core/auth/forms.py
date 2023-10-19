# from flask_wtf import FlaskForm
# from wtforms import StringField, PasswordField, BooleanField, SubmitField, V
# from wtforms.validators import DataRequired, Length, Email, EqualTo
# from .models import User
#
# class LoginForm(FlaskForm):
#     email = StringField('Email', validators=[DataRequired(), Length(1, 64), Email()])
#     password = PasswordField('Password', validators=[DataRequired()])
#     remember_me = BooleanField('Remember Me')
#     submit = SubmitField('Sign in')
#
# class RegistrationForm(FlaskForm):
#     username = StringField('Username', validators=[DataRequired])
#     email = StringField('Email', validators=[DataRequired(), Email()])
#     password = PasswordField('Password', validators=[DataRequired])
#     password2 = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
#     submit = SubmitField('Register')
#
#     def validate_username(self, username):
#         user = User.query.filter_by(username = username.data).first()
#         if user is not None:
#             raise ValidationError('That username is taken. Please choose a different one.')
#
#         def validate_email(self, email):
#             user = User.query.filter_by(email = email.data).first()
#             if user is not None:
#                 raise ValidationError('That email is taken. Please choose a different one.')
#
