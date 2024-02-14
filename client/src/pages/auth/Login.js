import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';

const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
const PASSWORD_REGEX = /(?=.{7,15}$)(?=\w{7,15})(?=.*[A-Z])(?=.*\d)/;
const LOGIN_URL = '/login';

function Login() {

  const [validated, setValidated] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);

  const [errorMessage, setErrorMesssage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email)
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password)
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
    try {
      var config = {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      const response = await axios.post(
        LOGIN_URL,
        { email, password },
        config
      );

      if (response.status === 200) {
        window.location.href="/home";
        console.log('logged in successfully');
      }


      // const response = await axios.post(LOGIN_URL,
      //      { email : email , password : password}  , config
      //   )
      //   .then(function (response) {
      //     console.log(response);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      // console.log(response.data);
      console.log(JSON.stringify(response));
      setSuccess(true)
    } catch (error) {
      if (!error?.response) {
        setErrorMesssage('No Server Response')
      } else if (error.response.status === 401) {
        setErrorMesssage('Invalid Credentials')
      } else {
        setErrorMesssage('Login Failed')
      }
    }
  };


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
          <p className={errorMessage ? "error message": "offscreen"} aria-live="assertive">{errorMessage}</p>
          <h1>Login</h1>
          <Form noValidate validated={validated} onChange={handleValidation} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
                autoFocus
              />
              <Form.Text id="uidnote" className={email && !validEmail ? "instructions": "offscreen"} muted>
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
              />
              <Form.Text id="pwdnote"  className={password && !validPassword ? "instructions": "offscreen"} muted>
                Your password must be at least 8 characters long, contain letters and numbers,
                and must not contain spaces, special characters(', ", &, |), or emoji.
              </Form.Text>
              <Form.Control.Feedback>Good!</Form.Control.Feedback>
            </Form.Group>
            <div style={dropdownStyle}>
              <Button type="submit">Login</Button>
              <Button>Register</Button>
            </div>

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
  width: "100vw"
}

const dropdownStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  alignContent: 'center',
  width: '100%'
}