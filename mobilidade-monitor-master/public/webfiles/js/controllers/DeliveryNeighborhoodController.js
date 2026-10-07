class DeliveryNeighborhoodController {
    static insert(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("deliveryNeighborhood", "POST", data, resolve, reject, true);
        })
    }

    static list(cityId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryNeighborhood?cityId=${cityId}`, "GET", null, resolve, reject, true);
        })
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryNeighborhood/${id}`, "DELETE", null, resolve, reject, true);
        })
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryNeighborhood/${id}`, 'PUT', data, resolve, reject, true);
        })
    }
}