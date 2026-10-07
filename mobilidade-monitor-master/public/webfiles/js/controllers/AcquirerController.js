class AcquirerController {
    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`acquirer`, "GET", null, resolve, reject, true);
        });
    }

    static update(id,metadata){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`acquirer/${id}`, "PUT", {metadata}, resolve, reject, true);
        })
    }
}