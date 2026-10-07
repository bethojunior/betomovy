class WithdrawController {

    static getAll(page = 1, filters = '') {
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`withdraw?page=${page}&${filters}`, 'GET', {}, resolve, '', true);
        });
    }

    static get(withdrawId) {
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`withdraw/${withdrawId}`, 'GET', {}, resolve, '', true);
        })
    }

    static confirm(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('withdraw/' + id, 'PUT', {}, resolve, '', true);
        });
    }

    static PaymentPagueLogo(transferId, type) {
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`withdraw/${transferId}`, 'PUT', {type}, resolve, '', true);
        });
    }

    static getSaldsPagueLogo() {
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`withdraw/account-balance`, 'GET', {}, resolve, '', true);
        });
    }

    static reject(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`withdraw/${id}/reject `, 'PUT', {}, resolve, '', true);
        });
    }
}