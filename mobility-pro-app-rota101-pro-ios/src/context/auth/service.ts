import {useCallback} from 'react';
import apiMain from '../../client/api/apiMain';
import apiMainDriver from '../../driver/src/api/apiMain';
import {CategoryDriver, UserDriver} from './types';

export const AuthService = () => {
  const loginDriver = useCallback(
    async (
      email: string,
      password: string,
      deviceToken: string,
    ): Promise<UserDriver | string> => {
      const response = await apiMainDriver.post('Driver/Authenticate', {
        stdObject: [
          {
            email,
            password,
            deviceToken,
          },
        ],
      });

      if (response.data.data !== null) {
        return response.data.data;
      }
      return response.data.message;
    },
    [apiMain],
  );

  const listCategories = useCallback(async (): Promise<
    CategoryDriver[] | []
  > => {
    const response = await apiMain.get('usertype/drivers');

    return response.data.data;
  }, [apiMain]);

  return {
    loginDriver,
    listCategories,
  };
};
