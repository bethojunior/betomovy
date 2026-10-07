class TripPaymentFormController {
    static get() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripPaymentForm", "GET", {}, resolve, reject);
        });
    }

    static getV2() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripPaymentForm", "GET", {}, resolve, reject, true);
        });
    }

    static getDriverFormOfPaymentBlocked(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/${id}/driverFormOfPaymentBlocked`, "GET", null, resolve, reject, true);
        })
    }
    static getDriverFormOfPayment(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/${id}/driverFormOfPayment`, "GET", null, resolve, reject, true);
        })
    }

    static putDriverFormOfPaymentBlocked(id,tripPaymentForms){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/${id}/driverFormOfPaymentBlocked`, "PUT", {tripPaymentForms}, resolve, reject, true)
        })
    }

    static getDriverFormOfPaymentImposition(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/${id}/driverFormOfPaymentImposition`, "GET", null, resolve, reject, true);
        });
    }


    static putDriverFormOfPaymentImposition(id,tripPaymentForms) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/${id}/driverFormOfPaymentImposition`, "PUT", {tripPaymentForms}, resolve, reject, true);
        })
    }
}