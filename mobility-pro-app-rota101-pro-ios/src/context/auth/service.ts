import apiMain from '../../client/api/apiMain';
import {
  CategoryDriver,
  LoginCustomerData,
  UserDriver,
  LoginDriverData,
  User,
  DriverDeviceTokenData,
  SocialLoginProps,
} from './types';

export const AuthService = () => {
  const loginDriver = async (data: LoginDriverData) => {
    const response = await apiMain.post<ApiResponse<UserDriver>>(
      'Driver/Authenticate',
      {stdObject: [data]},
    );

    return response.data;
  };

  const listCategories = async (): Promise<CategoryDriver[]> => {
    const response = await apiMain.get('usertype/drivers');
    return response.data.data;
  };

  const loginCustomer = async (data: LoginCustomerData) => {
    const response = await apiMain.post<ApiResponse<User>>('Customer/login', {
      generateToken: false,
      ...data,
    });

    return response.data;
  };

  const updateDriverDeviceToken = async (data: DriverDeviceTokenData) => {
    const response = await apiMain.post<ApiResponse<any>>('driver/edit', {
      stdObject: [data],
    });
    return response.data;
  };

  const updateCustomerDeviceToken = async (deviceToken: string) => {
    const response = await apiMain.post<ApiResponse<any>>(
      'Customer/EditProfile',
      {deviceToken},
    );
    return response.data;
  };

  const loginSocialCustomer = async (data: SocialLoginProps) => {
    const response = await apiMain.post<ApiResponse<any>>(
      'Customer/loginSocial',
      data,
    );
    return response.data;
  };

  const getCustomerScore = async (idUser: string | number) => {
    const response = await apiMain.post<ApiResponse<any>>(`Customer/Find`, {
      idUser,
    });
    return response.data;
  };

  return {
    loginDriver,
    loginCustomer,
    loginSocialCustomer,
    listCategories,
    updateDriverDeviceToken,
    updateCustomerDeviceToken,
    getCustomerScore,
  };
};
