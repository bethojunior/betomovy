class TripTypeController extends ConnectionServer {
    /**
     *
     * @param data
     * @returns {Promise<any>}
     */
    static create(data) {
        return this.sendRequestWithFiles('tripType', 'POST', data, true)
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            this.sendRequest("tripType/" + id, "DELETE", null, resolve, '', true);
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripType", "GET", null, resolve, reject,true);
        });
    }
/**
     *
     * @returns {Promise<unknown>}
     */
    static getAllV2() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripType", "GET", null, resolve, reject,true);
        });
    }

    /**
     *
     * @param form
     * @param id
     * @returns {Promise<any>}
     */
    static updateTypeOfCall(form, id) {
        return ConnectionServer.sendRequestWithFiles( `tripType/${id}/update`, 'POST', form, true);
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getTextTripTypes() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('config/textTripTypes', 'GET', '', resolve, reject, true)
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertTextTextTypes(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('config/textTripTypes', 'PUT', data, resolve, reject, true)
        })
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertPriceRange(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('price/range', 'POST', data, resolve, '', true);
        })
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getPriceRange(cityId, idTripType) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`price/range?cityId=${cityId}&tripTypeId=${idTripType}`, 'GET', '', resolve, '', true);
        })
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deletePriceRange(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('price/range/' + id, 'DELETE', '', resolve, '', true);
        })
    }

    static getTripType() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('tripType', "GET", null, resolve, reject, true);
        })
    }

    static insertTripTypeDriver(tripTypeDriver) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('tripTypeDriver', "POST", {tripTypeDriver}, resolve, reject, true);
        });
    }

    static deleteTripTypeDriver(tripTypeDriver) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('tripTypeDriver', "DELETE", {tripTypeDriver}, resolve, reject, true);
        });
    }

    static getAllByCity(cityId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`price?cityId=${cityId}`, "GET", null, resolve, reject, true);
        });
    }
}
