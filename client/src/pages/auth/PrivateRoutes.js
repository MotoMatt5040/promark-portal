import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "../../api/axios";

const PrivateRoutes = () => {
  const [sessionValidated, setSessionValidated] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        let url = window.location.pathname
        await axios.post('/user',
          { role: url },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Csrftoken': localStorage.getItem('csrftoken')
            }
          });
        setSessionValidated(1);
      } catch (error) {
        console.error('Error: ', error);
        if (!error?.response) {
          console.log("No Server Response")
        } else if (error.response.status === 401) {
          setSessionValidated(0);
        } else if (error.response.status === 403) {
          setSessionValidated(2);
        }

      } finally {
        setLoading(false); // Mark loading as false regardless of session validation result
      }
    };

    validateSession();
  }, []);

  if (loading) {
    // Render loading indicator here
    return <div>Loading...</div>;
  }

  // If session is not validated, redirect to login screen
  if (sessionValidated === 0) {
    return <Navigate to="/login" />;
  } else if (sessionValidated === 2) {
    return <h1>Not Authorized</h1>;
  }

  // If session is validated, render the outlet
  return (<Outlet />);
};

export default PrivateRoutes;