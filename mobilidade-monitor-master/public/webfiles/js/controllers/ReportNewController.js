class ReportNewController {
    static get(type = 1) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`report?withType=${type}`, "GET", null, resolve, reject, true);
        });
    }

    static getListSelect(path) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(path, "GET", null, resolve, reject, true);
        })
    }

    static solicitationReport(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('reportRecord', 'POST', data, resolve, undefined, true);
        })
    }

    static getReports(page = 1, status, type, dateStart, dateEnd) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`reportRecord?page=${page}&status=${status}&reportId=${type}&dateStart=${dateStart}&dateEnd=${dateEnd}`, 'GET', null, resolve, undefined, true);
        })
    }
}