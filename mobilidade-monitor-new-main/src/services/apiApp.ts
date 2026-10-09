import axios from "axios";
import Session from "../utils/Session";

let baseUrlApp = import.meta.env.API_APP;
if (baseUrlApp && (baseUrlApp === "https://movymob.com/" || baseUrlApp === "https://movymob.com")) {
  baseUrlApp = "https://api.movymob.com/";
}

const apiApp = axios.create({
  baseURL: baseUrlApp || "https://api.movymob.com/",
  headers: {
    cityId: Session.getLocal("citySelected")?.cityId,
  },
});

export default apiApp;
