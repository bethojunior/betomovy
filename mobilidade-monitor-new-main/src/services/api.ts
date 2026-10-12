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

api.interceptors.request.use((config) => {
  try {
    const userStorage = localStorage.getItem("@App:user");
    if (userStorage && userStorage !== "undefined" && userStorage !== "null") {
      const u = JSON.parse(userStorage);
      if (u?.api_token) {
        config.headers["token"] = u.api_token;
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${u.api_token}`;
        }
      }
      if (u?.idUser) {
        config.headers["userid"] = String(u.idUser);
        config.headers["userId"] = String(u.idUser);
      }
    }
    const citySelected = Session.getLocal("citySelected");
    if (citySelected?.cityId && !config.headers["cityId"]) {
      config.headers["cityId"] = citySelected.cityId;
    }
  } catch (err) {
    console.error("Erro no interceptor de autenticacao:", err);
  }
  return config;
});

export default api;
