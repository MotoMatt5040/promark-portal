import axios from 'axios';

export default axios.create({
  withCredentials: true,
  crossorigin: true,
  baseURL: process.env.REACT_APP_API_URL
})

// import axios from 'axios';
//
// export default axios.create({
//   withCredentials: true,
//   baseURL: "http://textingserver1.colo1.promarkresearch.com:5000"
// })

