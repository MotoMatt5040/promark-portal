import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRef, useState, useEffect } from 'react';

const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
const PASSWORD_REGEX = /(?=.{7,15}$)(?=\w{7,15})(?=.*[A-Z])(?=.*\d)/

function Login() {

  const [validated, setValidated] = useState(false);
  const [login, setLogin] = useState([]);

  const emailRef = useRef();
  const errorRef = useRef();

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [errorMessage, setErrorMesssage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

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
  }, [password]);

  useEffect(() => {
    setErrorMesssage('');
  }, [email, password]);

  const handleValidation = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(true)
  };

  useEffect( ()=> {
    if(validated) {
      fetch("/login")
        .then(res => res.json()
          .then(data => {
            setLogin(data);
          })
        );
    }
  }, []);

  return (
    <>
      {success ? (
        <section>
          <h1>Success</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
      <section className="login-div" style={stylesheet}>
        <div className="login-width" style={{"maxWidth": "50%"}}>
          <p ref={errorRef} className={errorMessage ? "error message": "offscreen"} aria-live="assertive">{errorMessage}</p>
          <h1>Login</h1>
          <Form noValidate validated={validated} onChange={handleValidation} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              aria-invalid={validEmail ? "false": "true"}
              aria-describedby="uidnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <Form.Text id="uidnote" className={emailFocus && email && !validEmail ? "instructions": "offscreen"} muted>
              Must not contain special characters or symbols.
            </Form.Text>
            <Form.Control.Feedback>Good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength="8"
              aria-invalid={validPassword ? "false": "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <Form.Text id="pwdnote"  className={passwordFocus && password && !validPassword ? "instructions": "offscreen"} muted>
              Your password must be at least 8 characters long, contain letters and numbers,
              and must not contain spaces, special characters(', ", &, |), or emoji.
            </Form.Text>
            <Form.Control.Feedback>Good!</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Login</Button>
        </Form>
        </div>
      </section> ) }
    </>
  );
}

export default Login;

const stylesheet = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "center",
  height: "100vh",
  idth: "100vw"
}