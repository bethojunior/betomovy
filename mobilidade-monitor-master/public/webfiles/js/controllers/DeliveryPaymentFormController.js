class DeliveryPaymentFormController {
    static listDeliveryPaymentForm() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("deliveryPaymentForm", "GET", null, resolve, reject, true);
        });
    }

    static insert(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("deliveryPaymentForm", "POST", data, resolve, reject, true);
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryPaymentForm/${id}`, "DELETE", null, resolve, reject, true);
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryPaymentForm/${id}`, "PUT", data, resolve, reject, true);
        })
    }
}