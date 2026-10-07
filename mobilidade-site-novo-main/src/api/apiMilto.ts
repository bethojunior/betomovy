import axios from "axios";

const apiMilto = axios.create({
  baseURL: window.env.REACT_APP_API_MILTO_SERVICE_URL,
  headers: {
    tokenname: window.env.REACT_APP_API_MILTO_SERVICE_TOKEN_NAME,
    token: window.env.REACT_APP_API_MILTO_SERVICE_TOKEN,
  },
});

export default apiMilto;
