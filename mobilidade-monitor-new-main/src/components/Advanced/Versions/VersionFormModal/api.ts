import api from "../../../../services/api";
import { VersionPayload } from "./types";

export const createVersion = (payload: VersionPayload) => api.post("appVersion", payload);

export const updateVersion = (id: number, payload: VersionPayload) =>
  api.put(`appVersion/${id}`, payload);
