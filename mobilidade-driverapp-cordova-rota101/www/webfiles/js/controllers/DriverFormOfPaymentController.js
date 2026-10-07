class DriverFormOfPaymentController {
    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`DriverFormOfPayment/GetAll`, "GET", null, resolve, reject)
        });
    }

    static insert(tripPaymentForms) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`DriverFormOfPayment/Insert`, "POST", {tripPaymentForms}, resolve, reject, undefined, false);
        })
    }

    static getAllImposition() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`DriverFormOfPayment/GetAllImposition`, "GET", null, resolve, reject)
        });
    }
}
