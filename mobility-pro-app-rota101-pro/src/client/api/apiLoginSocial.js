import axios from "axios";
import { applyPulseInterceptors } from "../../../lib/middleware/AxiosInterceptor";

const apiLoginSocial = axios.create({
  baseURL: "https://login-social-api.prod.704apps.com.br/",
})


applyPulseInterceptors(apiLoginSocial, 'api-login-social');

export default apiLoginSocial;