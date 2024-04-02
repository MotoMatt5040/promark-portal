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
import axios from "../../api/axios";

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

export default function AddUser() {

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
        "/add_user",
        {
          email: data.get('email'),
          session: localStorage.getItem('session')
        },
        config
      );

      if (response.status === 200) {
        console.log(response)
      }

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
            Add user
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
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
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox value="productionDashboard" color="primary" />}
                  label="Production Dashboard"
                />
              </Grid>
              <Grid item sx={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox value="dataProcessing" color="primary" />}
                  label="Data Processing"
                />
              </Grid>
              <Grid item sx={12} sm={6}>
                 <FormControlLabel
                  control={<Checkbox value="globalQuotaModule" color="primary" />}
                  label="Global Quota Module"
                />
              </Grid>
              <Grid item sx={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox value="addUser" color="primary" />}
                  label="Add Users"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add user
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}