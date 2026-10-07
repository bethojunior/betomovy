class ReportController {
    static get() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("report", "GET", null, resolve, reject, true);
        })
    }

    static getListSelect(path) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(path, "GET", null, resolve, reject, true);
        })
    }
}