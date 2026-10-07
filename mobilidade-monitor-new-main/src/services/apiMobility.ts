import axios from "axios";

const apiMobility = axios.create({
  baseURL: import.meta.env.HOST_SOCKET,
});

export default apiMobility;
