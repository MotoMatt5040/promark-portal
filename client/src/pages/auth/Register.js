import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
//
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import {useEffect, useRef, useState} from 'react';
//
// const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
// const PASSWORD_REGEX = /(?=.{7,15}$)(?=\w{7,15})(?=.*[A-Z])(?=.*\d)/;
// const LOGIN_URL = '/login';
//
// function Register() {
//
//   const [validated, setValidated] = useState(false);
//
//   const emailRef = useRef();
//   const errRef = useRef();
//
//   const [email, setEmail] = useState('');
//   const [validEmail, setValidEmail] = useState(false);
//   const [emailFocus, setEmailFocus] = useState(false);
//
//   const [password, setPassword] = useState('');
//   const [validPassword, setValidPassword] = useState(false);
//   const [passwordFocus, setPasswordFocus] = useState(false);
//
//   const [matchPassword, setMatch] = useState('');
//   const [validMatch, setValidMatch] = useState(false);
//   const [matchFocus, setMatchFocus] = useState(false);
//
//   const [errorMessage, setErrorMesssage] = useState('');
//   const [success, setSuccess] = useState(false);
//
//   // useEffect(() => {
//   //   emailRef.current.focus();
//   // }, []);
//
//   useEffect(() => {
//     const result = EMAIL_REGEX.test(email)
//     console.log(result);
//     console.log(email);
//     setValidEmail(result);
//   }, [email]);
//
//   useEffect(() => {
//     const result = PASSWORD_REGEX.test(password)
//     console.log(result);
//     console.log(password);
//     setValidPassword(result);
//     const match = password === matchPassword;
//     setValidMatch(match);
//   }, [password, matchPassword]);
//
//     useEffect(() => {
//     setErrorMesssage('');
//   }, [email, password, matchPassword]);
//
//   const handleSubmit = (event) => {
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//     }
//
//     setValidated(true);
//   };
//
//   return (
//     <div className="login-div" style={stylesheet}>
//       <div className="login-width" style={{"maxWidth": "50%"}}>
//         <Form noValidate validated={validated} onSubmit={handleSubmit}>
//         <Form.Group className="mb-3" controlId="formGroupEmail">
//           <Form.Label>Email address</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Enter email"
//             required
//           />
//           <Form.Control.Feedback>Good!</Form.Control.Feedback>
//         </Form.Group>
//         <Form.Group className="mb-3" controlId="formGroupPassword">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Password"
//             required
//             minLength="8"
//           />
//           <Form.Text id="passwordHelpBlock" muted>
//             Your password must be 8 characters long, contain letters and numbers,
//             and must not contain spaces, special characters(', ", &, |), or emoji.
//           </Form.Text>
//           <Form.Control.Feedback>Good!</Form.Control.Feedback>
//         </Form.Group>
//         <Button type="submit">Login</Button>
//       </Form>
//       </div>
//     </div>
//
//   );
// }
//
// export default Register;
//
// const stylesheet = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   alignContent: "center",
//   height: "100vh",
//   width: "100vw"
// }