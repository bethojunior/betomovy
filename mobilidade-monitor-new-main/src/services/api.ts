import axios from "axios";
import Session from "../utils/Session";

const v2 = Session.getLocal("monitorApiV2");


let baseUrl =
  v2 && import.meta.env.ISSPEEDMOB == "true"
    ? v2
    : import.meta.env.SEU_MILTO_V2;

if (baseUrl && (baseUrl === "https://movymob.com/" || baseUrl === "https://movymob.com")) {
  baseUrl = "https://api.movymob.com/";
}

const api = axios.create({
  baseURL: baseUrl || "https://api.movymob.com/",
  headers: {
    cityId: Session.getLocal("citySelected")?.cityId
  },
});
export default api;
