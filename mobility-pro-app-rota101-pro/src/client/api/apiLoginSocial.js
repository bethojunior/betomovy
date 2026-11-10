import axios from "axios";
import { applyPulseInterceptors } from "../../../lib/middleware/AxiosInterceptor";

const apiLoginSocial = axios.create({
  baseURL: "https://api.movymob.com/login-social/",
})


applyPulseInterceptors(apiLoginSocial, 'api-login-social');

export default apiLoginSocial;