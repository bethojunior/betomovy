import axios from "axios";
import Session from "../utils/Session";

const v1 = Session.getLocal("monitorApiV2");

let baseUrlV1 =
  v1 && import.meta.env.ISSPEEDMOB == "true"
    ? v1
    : import.meta.env.SEU_MILTO_V1;

if (baseUrlV1 && (baseUrlV1 === "https://movymob.com/" || baseUrlV1 === "https://movymob.com")) {
  baseUrlV1 = "https://api.movymob.com/";
}

const apiv1 = axios.create({
  baseURL: baseUrlV1 || "https://api.movymob.com/",
  headers: {
    cityId: Session.getLocal("citySelected")?.cityId,
  },
});

export default apiv1;
