import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apiteste.taxireturn.com.br',
});

export default api;
