import axios from "axios";

const api = axios.create({
  baseURL: window.env.REACT_APP_API_APP_HOST,
});

export default api;
