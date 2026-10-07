import apiDelivery from '../../../../client/api/apiDelivery';

export const DeliveryServiceList = {
  getDeliveries: async (page: number) => {
    try {
      // Substitua pela lógica da sua chamada de API
      const response = await apiDelivery(`delivery/order/driver?page=${page}`);
      return response?.data;
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
      throw error;
    }
  },
};
