class DriverCommissionController {
    static get(idCity){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driverCommission/${idCity}`,"GET",{},resolve,reject, true);
        });
    }

    static insert(idCity,values){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driverCommission/${idCity}`,"POST",values,resolve,reject, true);
        });
    }

    static getTariffs(idCity){
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`price/${idCity}`,"GET",null, resolve, undefined, true);
        });
    }
}