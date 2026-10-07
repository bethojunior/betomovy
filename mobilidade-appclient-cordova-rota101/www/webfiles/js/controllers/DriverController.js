class DriverController {

    getDriverById(driverId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/Find','POST',{ driverId },resolve);
        });
    }

    static find(driverId){
        return new Promise((resolve,reject) => {
            ConnectionServer.sendRequest("Driver/Find","POST",{driverId},resolve,reject);
        })
    };

    static FindWithPendencies(driverId){
        return new Promise(resolve => {
            ConnectionServer.sendRequest("Driver/FindWithPendencies","POST",{driverId},resolve);
        })
    };

    static sendDataDriver(form){
        return new Promise(resolve => {
            ConnectionServer.sendFile("Driver/EditDocsImage","POST", form).then(
                resolve
            );
        })
    }

    static requestUpdateDriverLocation(driverId){
        return new Promise((resolve,reject) => {
            ConnectionServer.sendRequest("Driver/requestUpdateDriverLocation","POST", {driverId},resolve,reject,false);
        })
    }
}