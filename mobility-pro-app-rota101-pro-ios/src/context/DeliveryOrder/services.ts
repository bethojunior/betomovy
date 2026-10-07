import apiDelivery from '../../client/api/apiDelivery';

export const DeliveryOrderService = {
  acceptOrder: async id => {
    const response = await apiDelivery.post(`delivery/order/${id}/accept`);
    return response.data;
  },

  refuseOrder: async id => {
    const response = await apiDelivery.delete(`delivery/order/${id}/refuse`);
    return response.data;
  },

  getActiveOrders: async (cityId = '') => {
    const response = await apiDelivery.get(
      `delivery/order/actives/driver?cityId=${cityId}`,
    );
    return response.data;
  },

  getOrder: async id => {
    const response = await apiDelivery.get(`delivery/order/${id}`);
    return response.data;
  },

  changeOrderStatus: async (id, status, cityId = '') => {
    const response = await apiDelivery.post(
      `delivery/order/${id}/${status}${cityId}`,
    );
    return response.data;
  },

  cancelOrderByDriver: async id => {
    const response = await apiDelivery.delete(
      `delivery/order/${id}/cancelByDriver`,
    );
    return response.data;
  },

  reportOccurrence: async ({message, latitude, longitude, deliveryOrderId}) => {
    const response = await apiDelivery.post('delivery/occurrence', {
      message,
      latitude,
      longitude,
      deliveryOrderId,
    });
    return response.data;
  },

  getOrdersByDriver: async page => {
    const response = await apiDelivery.get(
      `delivery/order/driver?page=${page}`,
    );
    return response.data;
  },
};
