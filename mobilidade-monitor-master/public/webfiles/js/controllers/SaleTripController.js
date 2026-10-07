class SaleTripController {
    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("sale", "GET", null, resolve, reject, true);
        });
    }

    static newSale(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("sale", "POST", data, resolve, reject, true);
        });
    }

    static deleteSaleTrip(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`sale/${id}`, "DELETE", null, resolve, reject, true);
        })
    }

    static update(id, data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`sale/${id}`, "PUT", data, resolve, reject, true);
        })
    }
}