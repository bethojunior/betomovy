import api from './api';
import { ConfigResponse, UpdateConfigRequest } from '../pages/Delivery/GeneralConfig/types';

export const deliveryConfigService = {
  getTypeOfDeliveryArea: (): Promise<ConfigResponse> => {
    return api.get('/config/type_of_delivery_area').then(response => response.data);
  },

  getNameEstablishmentDelivery: (): Promise<ConfigResponse> => {
    return api.get('/config/name_establishment_delivery').then(response => response.data);
  },

  getCustomerRegisterSmsConfirmationCode: (): Promise<ConfigResponse> => {
    return api.get('/config/customer_register_sms_confirmation_code').then(response => response.data);
  },

  getBannerDeliverySignUp: (): Promise<ConfigResponse> => {
    return api.get('/config/banner_delivery_signup').then(response => response.data);
  },

  updateConfig: (data: UpdateConfigRequest): Promise<{ status: boolean }> => {
    return api.put('/config', data).then(response => response.data);
  },

  uploadBanner: (file: File): Promise<{ status: boolean; url?: string }> => {
    const formData = new FormData();
    formData.append('imageBannerSignUp', file);
    
    return api.post('/upload/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  }
};

export { api };