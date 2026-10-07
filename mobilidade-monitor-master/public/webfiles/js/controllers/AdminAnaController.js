class AdminAnaController {
    static getConfigsGeneralAdmin(keyConfig) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`configs_general_admin/${keyConfig}`, "GET", null, resolve, undefined, true);
        });
    }

    static loginAdmin() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('auth/admin', 'POST', '', resolve, undefined, true)
        })
    }

    static getStatusBills(project_name) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`admin/bills/${project_name}`, 'GET', null, resolve, undefined, true)
        })
    }
}