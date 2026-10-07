class CentralNeigthborhoodsController {
    static insert(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("central/neighborhood", "POST", data, resolve, reject, true);
        })
    }

    static list() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/neighborhood`, "GET", null, resolve, reject, true);
        })
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/neighborhood/${id}`, "DELETE", null, resolve, reject, true);
        })
    }
}