class RefusedDriverController{
    driversBlockedByCustomer(driverId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Customer/driversBlockedByCustomer","POST",
                {driverId},
                resolve,reject,
                undefined,false);
        });
    }

    findCustomersBlockedMe(driverId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Driver/findCustomersBlockedMe","POST",
                {driverId},
                resolve,reject,
                undefined,false);
        });
    }
}