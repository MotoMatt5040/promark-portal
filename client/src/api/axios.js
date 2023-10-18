import axios from 'axios';

export default axios.create({
  withCredentials: true,
  baseURL: 'https://flask_server:5000/'
})