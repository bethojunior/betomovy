class BalanceController {
    lastDriverTransactions(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Balance/LastDriverTransactions", "POST", {driverId}, resolve, reject)
        });
    }

    driverTransactions(driverId, date_interval, page = 1,flow) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(flow)) {
                ConnectionServer.sendRequest("Balance/DriverTransactions", "POST", {
                    driverId,
                    date_interval,
                    page,flow
                }, resolve, reject);
                return;
            }

            ConnectionServer.sendRequest("Balance/DriverTransactions", "POST", {
                driverId,
                date_interval,
                page,
            }, resolve, reject)
        });
    }

    getTypes(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Balance/GetTypes","GET",null,resolve,reject);
        });
    }
}