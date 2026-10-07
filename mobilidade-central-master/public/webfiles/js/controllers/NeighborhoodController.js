class NeighborhoodController {
    static listNeighborhood(lat, lng) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`neighborhood?lat=${lat}&lng=${lng}`, "GET", null, resolve, reject, true);
        })
    }
    static listTypeTrip() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`tripType`, 'GET', null, resolve, reject, true);
        })
    }
    static listFeeByNeighborhood(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`centralNeighborhood/${id}`, 'GET', null, resolve, reject, true);
        })
    }
    static sendAmountByNeighborhood(valueByNeighborhood) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`centralNeighborhood`, 'POST', valueByNeighborhood, resolve, reject, true);
        })
    }
    static deleteNeighborhood(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`centralNeighborhood/${id}`, 'DELETE', null, resolve, reject, true);
        })
    }

    static listAllNeighborhood(idCentral) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`NeighborhoodRides/central/${idCentral}`, "GET", null, resolve, reject, true);
        })
    }

    static insertNeighborhood(payload) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`NeighborhoodRides/insert`, "POST", payload, resolve, reject, true);
        })
    }

    static deleteNeighborhood(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`NeighborhoodRides/${id}`, "DELETE", null, resolve, reject, true);
        })
    }

    static updateNeighborhood(id, payload) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`NeighborhoodRides/${id}`, "PUT", payload, resolve, reject, true);
        })
    }
}