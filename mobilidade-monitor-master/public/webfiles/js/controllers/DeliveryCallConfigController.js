class DeliveryCallConfigController {
    static deliveryCallConfig() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryCallConfig`, "GET", null, resolve, reject, true);
        });
    }

    static updateDeliveryCallConfig(config, value) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryCallConfig/${config}`, "PUT", {value}, resolve, reject, true);
        });
    }
}