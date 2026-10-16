import { AxiosInstance } from "axios";

export function detachAuthInterceptor(api: AxiosInstance, interceptorId: number) {
  if (api && interceptorId !== undefined) {
    api.interceptors.response.eject(interceptorId);
  }
}
