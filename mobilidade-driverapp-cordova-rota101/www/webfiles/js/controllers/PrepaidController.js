class PrepaidController {
    static getAll(cityId = null) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`CreditPrepaid/List?cityId=${cityId}`, "GET", null, resolve, reject);
        });
    }

    static purchase(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("CreditPrepaid/Purchase", "POST", data, resolve, reject, undefined, false);
        })
    }
}