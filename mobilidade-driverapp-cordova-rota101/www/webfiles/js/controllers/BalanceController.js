class BalanceController {
    lastDriverTransactions(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Balance/LastDriverTransactions", "POST", {driverId}, resolve, reject)
        });
    }

    /**
     *
     * @param driverId
     * @param date_interval
     * @param page
     * @param flow
     * @returns {{request: XMLHttpRequest, promise: Promise<any>}}
     */
    driverTransactions(driverId, date_interval, page = 1, flow) {
        if (Array.isArray(flow))
            flow = undefined;

        return ConnectionServer.requestWithReturn("Balance/DriverTransactions", "POST", {
            driverId,
            date_interval,
            page,
            flow
        })
    }

    getTypes() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Balance/GetTypes", "GET", null, resolve, reject);
        });
    }

    generatePixCode(value) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("DriverCredit/AddViaPix", "POST", {amount: value}, resolve, reject, undefined, false);
        });
    }

    verifyPaymentPixCode(idPix) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("DriverCredit/ShowCreditPix", "POST", {transactionId: idPix}, resolve, reject, undefined, false);
        });
    }

    verifyCurrentAdquirer() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Adquirer/CurrentAdquirer", "GET", {}, resolve, reject, undefined, false);
        });
    }
}