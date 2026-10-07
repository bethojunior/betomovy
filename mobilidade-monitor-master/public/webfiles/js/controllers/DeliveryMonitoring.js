class DeliveryMonitoring extends ConnectionServer {

    static getOrderActive(cityId) {
        return new Promise( resolve=> {
            ConnectionServer.sendRequest(`deliveryOrder/${cityId}/actives`, 'GET', null, resolve, undefined, true);
        });
    }

    static  getDrivers() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`driver/delivery`, 'GET', null, resolve, undefined, true);
        })
    }
}