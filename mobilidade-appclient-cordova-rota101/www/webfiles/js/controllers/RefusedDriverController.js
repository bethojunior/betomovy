class RefusedDriverController {
    static insert(driverId,customerId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("RefusedDriver/Insert","POST",{driverId,customerId},resolve,reject,false)
        });
    }
    static list(customerId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("RefusedDriver/list","POST",{customerId},resolve,reject,false)
        });
    }

    static remove(idRefused){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("RefusedDriver/Delete","POST",{idRefused},resolve,reject,false)
        });
    }
}
