import axios from 'axios';

export default axios.create({
  withCredentials: true,
  crossorigin: true,
  baseURL: process.env.REACT_APP_TEST_API_URL
})

