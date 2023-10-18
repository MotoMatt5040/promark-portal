import axios from 'axios';

export default axios.create({
  withCredentials: true,
  baseURL: 'https://127.0.0.1:5000/'
})