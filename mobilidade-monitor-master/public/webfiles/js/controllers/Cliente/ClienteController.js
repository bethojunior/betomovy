class ClientController extends ConnectionServer {

    static criminalRecord(id) {
        return new Promise(resolve => {
            return ConnectionServer.sendRequest(`customer/criminal-record/${id}`, 'GET', null, resolve, undefined, true );
        });
    }

    static getCustomerList(page = 1, filters = {}) {
        return new Promise((resolve, reject) => {

            const filter = Object.keys(filters).map(key => {
                return `${key}=${filters[key]}`;
            }).join("&")

            return ConnectionServer
                .sendRequest(
                    `customer?page=${page}&${filter}`,
                    'GET',
                    null,
                    resolve, reject, true);
        });
    }

    static getCustomer(page = 1, name = '', email = '', document = '', phone = '', military = false, status = 2) {
        return new Promise((resolve, reject) => {
            let filter = "";

            if (name !== "" || name !== " ")
                filter += '&name=' + name;

            if (email !== "" || email !== " ")
                filter += '&email=' + email;

            if (document !== "" || document !== " ")
                filter += '&document=' + document;

            if (phone !== "" || phone !== " ")
                filter += '&phone=' + phone;

            if (status !== false)
                filter += '&customerRegisterStatusId=' + status;


            if (!military) {
                return ConnectionServer
                    .sendRequest(
                        `customer?page=${page}${filter}`,
                        'GET',
                        {},
                        resolve, reject, true);
            }

            ConnectionServer
                .sendRequest(
                    'customer?page=' + page + '&militaryForceId=' + military.militaryForceId + '&militaryGraduationId=' + military.militaryGraduationId,
                    'GET',
                    {},
                    resolve, reject, true);
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static blockCustomer(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('customer/' + id + '/block', 'POST', {}, resolve, null, true);
        })
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static unlockCustomer(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`customer/${id}/unlock`, 'PUT', {}, resolve, null, true);
        })
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static update(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('customer/' + data.idCostumer, 'PUT', data, resolve, reject, true);
        })
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertVoucherClient(data) {
        return new Promise(resolve => {
            resolve(VoucherController.insertVoucherByClient(data));
        })
    }

    /**
     *
     * @param customerUserId
     * @returns {Promise<unknown>}
     */
    static getTripByUser(customerUserId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip&customerUserId=' + customerUserId, 'GET', {}, resolve)
        })
    }

    static deleteUser(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('user/' + id, 'DELETE', {}, resolve, '', true)
        })
    }

    /**
     *
     * @param user
     * @returns {Promise<unknown>}
     */
    static getUserPendencies(user) {
        return new Promise(resolve => {
            this.sendRequest(`pendencyField/user/${user}`, 'GET', '', resolve, false, true);
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getPendency() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('pendencyFieldType', 'GET', '', resolve, '', true);
        })
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getStatusPendency() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('pendencyFieldType', 'GET', '', resolve, '', true);
        })
    }

    static getPendencyFieldStatus() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('pendencyFieldStatus', 'GET', null, resolve, reject, true)
        })
    }

    static updateStatusPendency(idPendency, pendencyFieldStatusId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`pendencyField/${idPendency}/updateStatus`, 'PUT', {pendencyFieldStatusId}, resolve, reject, true)
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertPendency(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('pendencyField', 'POST', data, resolve, null, true);
        })
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getTypeMilitary() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('militaryForce', 'GET', '', resolve, null, true);
        })
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static getGraduationMilitary(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('militaryForceGraduation?militaryForceId=' + id, 'GET', '', resolve, null, true);
        });
    }

    static getCustomerRegisterStatus() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('customerRegisterStatus', 'GET', '', resolve, reject, true);
        });
    }

    static getObservation(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`customer/${id}`, 'GET', id, resolve, null, true);
        })
    }

    static createObservation(id, data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`user/${id}/observation`, 'PUT', data, resolve, undefined, true)
        })
    }

    static messageWhatsapp() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('config/whatsapp_message_client', 'GET', {}, resolve, undefined, true);
        });
    }

    static getDependents(id, cityId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`customer/${id}`, 'GET', {cityId, id}, resolve, undefined, true);
        });
    }

    static getDocumentsCustomer(userId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`docUser/user/${userId}`, 'GET', null, resolve, undefined, true);
        });
    }

    static getAllRemoveAccountRequest(page) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`user/removeAccountsRequest?page=${page}`, 'GET', {}, resolve, undefined, true);
        });
    }

    static removeAccountUser(userId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`user/${userId}/removeAccountUser`, 'PUT', {}, resolve, undefined, true);
        });
    }
}
