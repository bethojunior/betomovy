class TripPaymentFormController {
    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('TripPaymentForm/GetAll?paymentInVehicle=1', 'POST', {}, resolve, reject);
        });
    }

    static getList() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('TripPaymentForm/GetAll', 'POST', {}, resolve, reject);
        });
    }
}
