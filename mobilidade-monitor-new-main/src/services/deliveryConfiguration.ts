import api from './api';
import { DeliveryConfigResponse, DeliveryConfigRequest } from '../pages/Delivery/DeliveryConfiguration/types';

export const deliveryConfigurationService = {
  getConfigs: (): Promise<DeliveryConfigResponse> => {
    return api.get('/deliveryConfigAdmin').then(response => response.data);
  },

  editConfigs: (data: DeliveryConfigRequest): Promise<{ status: boolean }> => {
    return api.post('/deliveryConfigAdmin', data).then(response => response.data);
  }
};