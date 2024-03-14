import axios from '../../api/axios';

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
      {'Promark Research © '}
      <Link color="inherit" href="https://www.promarkresearch.com/">
        promarkresearch.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

function Login() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      var config = {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      const response = await axios.post(
        "/login",
        {
          email: data.get('email'),
          password: data.get('password')
        },
        config
      );

      if (response.status === 200) {
        window.location.href="/home";
        console.log('logged in successfully');
      }

      console.log(JSON.stringify(response));
    } catch (error) {
      if (!error?.response) {
        console.log('No Server Response');
      } else if (error.response.status === 401) {
        console.log('Invalid Credentials');
      } else {
        console.log('Login Failed');
      }
    }

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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

// import Form from 'react-bootstrap/Form';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import React, { useState, useEffect } from 'react';
// import axios from '../../api/axios';

// const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
// const PASSWORD_REGEX = /(?=.{7,15}$)(?=\w{7,15})(?=.*[A-Z])(?=.*\d)/;
// const LOGIN_URL = '/login';

// function Login() {
//   const [validated, setValidated] = useState(false);
//
//   const [email, setEmail] = useState('');
//   const [validEmail, setValidEmail] = useState(false);
//
//   const [password, setPassword] = useState('');
//   const [validPassword, setValidPassword] = useState(false);
//
//   const [errorMessage, setErrorMesssage] = useState('');
//   const [success, setSuccess] = useState(false);
//
//   useEffect(() => {
//     const result = EMAIL_REGEX.test(email)
//     setValidEmail(result);
//   }, [email]);
//
//   useEffect(() => {
//     const result = PASSWORD_REGEX.test(password)
//     setValidPassword(result);
//   }, [password]);
//
//   useEffect(() => {
//     setErrorMesssage('');
//   }, [email, password]);
//
//   const handleValidation = (event) => {
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//     }
//     setValidated(true);
//   };
//
//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//
//   }
//
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       var config = {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       const response = await axios.post(
//         LOGIN_URL,
//         { email, password },
//         config
//       );
//
//       if (response.status === 200) {
//         window.location.href="/home";
//         console.log('logged in successfully');
//       }
//
//       console.log(JSON.stringify(response));
//       setSuccess(true)
//     } catch (error) {
//       if (!error?.response) {
//         setErrorMesssage('No Server Response')
//       } else if (error.response.status === 401) {
//         setErrorMesssage('Invalid Credentials')
//       } else {
//         setErrorMesssage('Login Failed')
//       }
//     }
//   };
//
//   return (
//     <>
//       {success ? (
//         <section>
//           <h1>Success</h1>
//           <p>
//             <a href="#">Sign In</a>
//           </p>
//         </section>
//       ) : (
//       <section className="login-div" style={stylesheet}>
//         <div className="login-width" style={{"maxWidth": "50%"}}>
//           <p className={errorMessage ? "error message": "offscreen"} aria-live="assertive">{errorMessage}</p>
//           <h1>Login</h1>
//           <Box
//             component="form"
//             sx={{
//               '& > :not(style)': { m: 1, width: '25ch' },
//             }}
//             noValidate
//             autoComplete="on"
//           >
//             <TextField
//               type="email"
//               id="email"
//               error={!validEmail}
//               autoComplete="on"
//               onChange={(e) => setEmail(e.target.value)}
//               label="Email"
//               value={email}
//               required
//               variant="standard"
//               autoFocus
//             />
//           </Box>
//           <Form noValidate validated={validated} onChange={handleValidation} onSubmit={handleSubmit}>
//             <Form.Group className="mb-3" controlId="formGroupEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 autoComplete="off"
//                 onChange={(e) => setEmail(e.target.value)}
//                 value={email}
//                 placeholder="Enter email"
//                 required
//                 autoFocus
//               />
//               <Form.Text id="uidnote" className={email && !validEmail ? "instructions": "offscreen"} muted>
//                 Must not contain special characters or symbols.
//               </Form.Text>
//               <Form.Control.Feedback>Good!</Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="formGroupPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 required
//                 minLength="8"
//               />
//               <Form.Text id="pwdnote"  className={password && !validPassword ? "instructions": "offscreen"} muted>
//                 Your password must be at least 8 characters long, contain letters and numbers,
//                 and must not contain spaces, special characters(', ", &, |), or emoji.
//               </Form.Text>
//               <Form.Control.Feedback>Good!</Form.Control.Feedback>
//             </Form.Group>
//             <div style={dropdownStyle}>
//               <Button type="submit">Login</Button>
//               <Button>Register</Button>
//             </div>
//
//           </Form>
//
//         </div>
//       </section> ) }
//     </>
//   );
// }

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