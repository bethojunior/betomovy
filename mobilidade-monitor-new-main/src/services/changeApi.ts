import { AxiosInstance } from "axios"

export const transFormApi = (api: AxiosInstance,  url: string, ) => {
	api.defaults.baseURL = url
}