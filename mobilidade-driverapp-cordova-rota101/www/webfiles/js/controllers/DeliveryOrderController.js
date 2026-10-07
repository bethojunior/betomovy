class DeliveryOrderController {
    static accept(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/order/${id}/accept`, "POST", null, resolve, reject, undefined, false, true);
        });
    }

    static refuse(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/order/${id}/refuse`, "DELETE", null, resolve, reject, undefined, false, true);
        });
    }

    static active(cityId = '') {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/order/actives/driver${cityId}`, "GET", null, resolve, reject, undefined, false, true);
        })
    }

    static find(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/order/${id}`, "GET", null, resolve, reject, undefined, false, true);
        });
    }

    static changeStatusOrder(id, status, cityId = '') {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/order/${id}/${status}${cityId}`, "POST", null, resolve, reject, undefined, false, true);
        });
    }

    static cancelByDriver(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/order/${id}/cancelByDriver`, "DELETE", null, resolve, reject, undefined, false, true);
        });
    }

    static occurrence({message, latitude, longitude, deliveryOrderId}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('delivery/occurrence', "POST", {
                    message,
                    latitude,
                    longitude,
                    deliveryOrderId
                }, resolve, reject, undefined, false
                , true)
        })
    }

    static findByDriver(page){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/order/driver?page=${page}`, "GET", null, resolve,reject, undefined, undefined,true);
        });
    }
}
