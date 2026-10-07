import {AxiosResponse} from 'axios';
import {apiIfood} from '../../api/apiIfood';

export const IfoodService = () => {
  const verify = async (
    tripReference: string,
  ): Promise<
    AxiosResponse<{
      status: boolean;
      response: string;
      message: string | null;
    }>
  > => {
    try {
      const {data} = await apiIfood.get(`code-is-necessary/${tripReference}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const validateCode = async (
    tripReference: string,
    code: string,
  ): Promise<
    AxiosResponse<{
      status: boolean;
      response: string;
      message: string | null;
    }>
  > => {
    return await apiIfood.post(`validate-code/${code}/${tripReference}`);
  };

  return {
    verify,
    validateCode,
  };
};
