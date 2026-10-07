const order_waiting_confirmation = 1;
const order_confirmed = 2;
const order_in_preparation = 3;
const order_searching_delivery_man = 4;
const order_out_for_delivery = 5;
const order_delivered = 6;
const order_canceled = 7;

class OrderService {
  static realtime(socket, order) {
    if (
      order.callingDriver &&
      order.delivery_order_status.id === order_searching_delivery_man
    ) {
      if (order.callingDriver.length !== 0) {
        order.callingDriver.map((driverId) => {
          console.log(
            `mudança no pedido: ${order.id} , chamando para o motorista ${driverId}`
          );
          socket.emit(`searchDriverOrder_${driverId}`, order);
        });
  
        return;
      }
    }

    socket.emit(`trackOrder_${order.id}`, order);
    socket.emit(`companyOrders_${order.companyId}`, order);
    socket.emit(`clientOrders_${order.userId}`, order);
    socket.emit(`notificationNewOrder_${order.companyId}`, order);
  }
}

module.exports = OrderService;
