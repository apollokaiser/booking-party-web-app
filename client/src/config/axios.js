import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 2000,
    headers: {'X-Custom-Header': 'client'}
  });
export default instance;