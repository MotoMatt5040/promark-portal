import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../../api/axios'
import Login from './Login';

import {useEffect} from 'react';

export default function Logout(){

  useEffect( () => {
    handleLogout();
  })

  const handleLogout = async () => {
    console.log('removing session')
    localStorage.removeItem("logged_in")

    await axios.get(
      "/logout",
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': localStorage.getItem('csrftoken')
        }
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
    localStorage.removeItem("csrftoken")
    // delete api.defaults.headers.common['X-CSRFToken'];
  }

  return (
    <Login />
  )
}