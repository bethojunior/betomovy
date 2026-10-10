import axios from "axios";

const getBaseUrl = (): string => {
  const envHost = (window as any)?.env?.REACT_APP_API_APP_HOST;
  if (!envHost || envHost.includes("movymob.com//") || envHost === "https://movymob.com" || envHost === "https://movymob.com/") {
    return "https://api.movymob.com/";
  }
  return envHost.endsWith("/") ? envHost : `${envHost}/`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

export default api;

