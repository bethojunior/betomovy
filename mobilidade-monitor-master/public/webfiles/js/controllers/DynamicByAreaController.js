class DynamicByAreaController {
    static insert(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("dynamicArea", "POST", data, resolve, reject, true);
        })
    }

    static list() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dynamicArea`, "GET", null, resolve, reject, true);
        })
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dynamicArea/${id}`, "DELETE", null, resolve, reject, true);
        })
    }

    static changeStatus(id, status) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dynamicArea/${id}/${status}`, "PUT", null, resolve, reject, true);
        })
    }
}