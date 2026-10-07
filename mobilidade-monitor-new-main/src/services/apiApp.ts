import axios from "axios";
import Session from "../utils/Session";

const apiApp = axios.create({
  baseURL: import.meta.env.API_APP,
  headers: {
    cityId: Session.getLocal("citySelected").cityId,
  },
});

export default apiApp;
