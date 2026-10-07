import { AxiosError } from "axios";
import api from "../api/apiAxios";

export const GetPositionByAddress = async (address: string) => {
  try {
    const result = await api.get(`geocoding/search?address=${address}`);
    const { data } = result;
    if (!data.status) return;

    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(axiosError);
  }
};
