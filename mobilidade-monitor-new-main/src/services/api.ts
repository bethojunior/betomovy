import axios from "axios";
import Session from "../utils/Session";

const v2 = Session.getLocal("monitorApiV2");


const api = axios.create({
  baseURL:
    v2 && import.meta.env.ISSPEEDMOB == "true"
      ? v2
      : import.meta.env.SEU_MILTO_V2,
  headers: {
    cityId: Session.getLocal("citySelected").cityId
  },
});
export default api;
