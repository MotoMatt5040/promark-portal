import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useEffect, useRef, useState} from 'react';

const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
const PASSWORD_REGEX = /(?=.{7,15}$)(?=\w{7,15})(?=.*[A-Z])(?=.*\d)/;
const LOGIN_URL = '/login';

function Register() {

  const [validated, setValidated] = useState(false);

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatch] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errorMessage, setErrorMesssage] = useState('');
  const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //   emailRef.current.focus();
  // }, []);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email)
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password)
    console.log(result);
    console.log(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

    useEffect(() => {
    setErrorMesssage('');
  }, [email, password, matchPassword]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <div className="login-div" style={stylesheet}>
      <div className="login-width" style={{"maxWidth": "50%"}}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
          />
          <Form.Control.Feedback>Good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            minLength="8"
          />
          <Form.Text id="passwordHelpBlock" muted>
            Your password must be 8 characters long, contain letters and numbers,
            and must not contain spaces, special characters(', ", &, |), or emoji.
          </Form.Text>
          <Form.Control.Feedback>Good!</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
      </div>
    </div>

  );
}

export default Register;

const stylesheet = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "center",
  height: "100vh",
  width: "100vw"
}