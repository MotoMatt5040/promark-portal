import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../../api/axios'
import Login from './Login';

import {useEffect} from 'react';

export default function Logout(){

  useEffect( () => {
    handleLogout();
  })

  const handleLogout = async () => {
    await axios.get(
      "/logout",
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  }

  return (
    <Login />
  )
}