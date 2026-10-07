import axios from "axios";

const apiAdmin = axios.create({
  baseURL: import.meta.env.ADMIN704APPS_API_URL || "",
  headers: {
    id: import.meta.env.ADMIN704APPS_API_ID || "",
    secret: import.meta.env.ADMIN704APPS_API_SECRET || "",
  },
});
export default apiAdmin;
