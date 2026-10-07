import axios from "axios";
import Session from "../utils/Session";

const v1 = Session.getLocal("monitorApiV2");

const apiv1 = axios.create({
  baseURL:
    v1 && import.meta.env.ISSPEEDMOB == "true"
      ? v1
      : import.meta.env.SEU_MILTO_V1,
  headers: {
    cityId: Session.getLocal("citySelected").cityId,
  },
});

export default apiv1;
