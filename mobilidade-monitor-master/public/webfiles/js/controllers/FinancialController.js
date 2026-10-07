class FinancialController {

    static getAllRequests() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('withdraw/driver', 'GET', {}, resolve);
        });
    }

    static confirmRequest(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('withdraw/confirm/' + id, 'PUT', {}, resolve);
        });
    }

    static getReport(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'report/driver/synthetic?dateStart=' + data.date_start + '&dateEnd=' + data.date_end + '&cities[]=' + data.cities + '&drivers[]=' + data.drivers,
                'GET',
                '',
                resolve,
                undefined,
                true
            );
        })
    }

    static balanceFlowType() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'balanceFlowType/searchable',
                'GET',
                '',
                resolve,
                '',
                true
            )
        })
    }

    static updateBalanceDriver(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'driver/balance',
                'PUT',
                data,
                resolve,
                '',
                true
            )
        })
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static referralMonetization(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'referralMonetization?cityId='+Session.getValueInSessionLocal("citySelected","cityId"),
                data.method,
                data,
                resolve,
                '',
                true
            )
        })
    }

    static referralMonetizationAllCities(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'referralMonetization',
                data.method,
                data,
                resolve,
                '',
                true
            )
        })
    }

    static referralMonetizationId(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'referralMonetization/' + data.id,
                data.method,
                data,
                resolve,
                '',
                true
            )
        })
    }

    static indicationsByUser(name = '', monetizationId = '') {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'userIndication/report/referredUsers?name=' + name + '&monetizationId=' + monetizationId,
                'GET',
                '',
                resolve,
                false,
                true
            )
        });
    }

    static referralEarnings(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'userIndication/report/referralEarnings?dateStart=' + data.dateStart + '&dateEnd=' + data.dateEnd + '&userId=' + data.userId,
                'GET',
                data,
                resolve,
                '',
                true
            )
        })
    }

    static cancellationFee(page= 1, data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                `trip/cancellationFee/findAll?page=${page}&dateStart=${data.dateStart}&dateEnd=${data.dateEnd}&cityId=${data.cityId}&withTrash=${data.withTrash}&userId=${data.userId}&driverId=${data.driverId}
                `,
                'GET',
                data,
                resolve,
                '',
                true
            )
        })
    }

    static delete(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                `trip/cancellationFee/` + id,
                'DELETE',
                '',
                resolve,
                '',
                true
            )
        })
    }

    static getIndicationByUser(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('userIndication/user/' + id + '/referredUsers', 'GET', '', resolve, false, true);
        });
    }

    static referralDrivers(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip/report/valuesByDriver?' + data, 'GET', '', resolve, false, true);
        });
    }

    static balancePosting(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("balancePosting", "POST", data, resolve, reject, true);
        });
    }

    static getBalancePosting() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("balancePosting", "GET", null, resolve, reject, true);
        });
    }

    static removeBalancePosting(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`balancePosting/${id}`, "DELETE", null, resolve, reject,true);
        })
    }

    static getAll() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('driver/getAll', 'GET', '', resolve, false, true);
        });
    }

    // CRIAR BOLETOS PARA DRIVERS //
    static createBoletoAsaas(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`asaas/createBoleto`, "POST", data, resolve, reject, true);
        })
    }

    // VERIFICAR BOLETOS //
    static getBoletosAsaas(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`asaas/boletos/${id}`, "GET", null, resolve, reject, true);
        })
    }

    // VERIFICAR BOLETOS //
    static getUserAsaas(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`asaas/user/${id}`, "GET", null, resolve, reject, true);
        })
    }

}
