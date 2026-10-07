class DriverRepository {
    static list(idCentral){
        return new Promise((resolve, reject) => {
            ConnectionServer
                .sendRequest(
                    `central/${idCentral}/driver`,
                    "GET",
                    null,
                    resolve,
                    reject);
        });
    }

    static getLocation(driverId){
        return new Promise((resolve, reject) => {
            ConnectionServer.
                sendRequest(`driver/${driverId}/position`,"GET",null,resolve,reject);
        })
    }

    static getDriversPositions(centralId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${centralId}/driver/positions?status=disponivel,corrida`,'GET',
                null,resolve,reject);
        });
    }

    static getDriversByUrl(url){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestByUrl(url,"GET",null,resolve,reject);
        })
    }

    static remove(centralId,driverId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${centralId}/driver/${driverId}`,"DELETE",null,resolve,reject);
        });
    }

    static blocked(centralId, driverId) {
        return new Promise ((resolve,reject) => {
            ConnectionServer.sendRequest(`driver/blockDriver`,"POST",{
                idCentral: Number(centralId),
                idDriver: Number(driverId)
            },resolve,reject);
        })
    }

    static unblockedUserDriver(idBlock) {
        return new Promise ((resolve,reject) => {
            ConnectionServer.sendRequest(`driver/unblockDriver/${idBlock}`,"PUT",{},resolve,reject);
        })
    }
}