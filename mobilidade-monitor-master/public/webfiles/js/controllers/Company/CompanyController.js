class CompanyController extends ConnectionServer {
    /**
     *
     * @param data
     * @returns {Promise<resolve>}
     */
    static insert(data) {
        return new Promise(resolve => {
            this.sendRequest('company', data.method, data, resolve, '', true);
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<resolve>}
     */
    static getAll(data = '') {
        let params = data.params;
        return new Promise(resolve => {
            this.sendRequest('company?cityId=' + Session.getValueInSessionLocal("citySelected", "cityId") +
                '&' + params,
                data.method,
                data,
                resolve,
                '',
                true
            );
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static getUsersByPj(id) {
        return new Promise(resolve => {
            this.sendRequest(`company/${id}/workers`, 'GET', '', resolve, false, true);
        })
    }

    static delete(id) {
        return new Promise(resolve => {
            this.sendRequest(`company/${id}`, 'DELETE', null, resolve, '', true)
        })
    }

    /**
     *
     * @param id
     * @param status
     * @returns {Promise<unknown>}
     */
    static release(id, status) {
        return new Promise(resolve => {
            this.sendRequest(`company/${id}/${status}`, 'PUT', '', resolve, '', true)
        })
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static update(data) {
        return new Promise(resolve => {
            this.sendRequest('company', 'PUT', data, resolve, '', true);
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static get(id) {
        return new Promise(resolve => {
            this.sendRequest('company/' + id, 'GET', '', resolve, false, true);
        })
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertVoucher(data) {
        return new Promise(resolve => {
            this.sendRequest('company/' + data.id + '/voucher/increment', 'POST', data, resolve, false, true);
        })
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static getWorkers(id) {
        return new Promise(resolve => {
            this.sendRequest(`company/${id}/workers`, 'GET', '', resolve, false, true);
        })
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deleteWorker(id) {
        return new Promise(resolve => {
            this.sendRequest('companyWorker/' + id, 'DELETE', '', resolve, false, true);
        })
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertWorker(data) {
        return new Promise(resolve => {
            this.sendRequest('companyWorker', 'POST', data, resolve, false, true);
        })
    }

    static insertCompanyDeliveryConfig(data) {
        return ConnectionServer.sendRequestWithFiles("companyDeliveryConfig", "POST", data, true)
    }

    static getAllCompanyDeliveryConfig() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("companyDeliveryConfig/company", "GET", null, resolve, reject, true)
        });
    }

    static updateCompanyDeliveryConfig(id, data) {
        return ConnectionServer.sendRequestWithFiles(`companyDeliveryConfig/company/${id}`, "POST", data, true);
    }

    static companyAddress(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`companyAddress`, "POST", data, resolve, reject, true);
        })
    }

    static getCompanyAddress(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`companyAddress?companyId=${id}`, "GET", null, resolve, reject, true);
        })
    }

    static getCompanyAddress(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`companyAddress?companyId=${id}`, "GET", null, resolve, reject, true);
        })
    }

    static removeCompanyAddress(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`companyAddress/${id}`, "DELETE", null, resolve, reject, true);
        })
    }

    static setDefaultPlace(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`companyAddress/${id}`, "PUT", null, resolve, reject, true);
        })
    }

    static getAllEstablishmentCharge() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('establishmentCollectionManagement',"GET", null, resolve, reject, true);
        })
    }

    static updateStoreBillingManagement(companyId, establishmentCollectionManagementId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`company/${companyId}/setEstablishmentCollectionManagement`, "PUT", establishmentCollectionManagementId, resolve, reject, true);
        })
    }
}
