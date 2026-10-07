class AcquirerByCityController {
    static getAcquiresByCIty(cityId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('acquirer/city', "GET", {cityId}, resolve, reject, true);
        });
    }

    static updateAcquires(id,metadata){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`acquirer/city`, "PUT", {metadata}, resolve, reject, true);
        });
    }

    static disableAcquire(metadata){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`acquirer/city/delete`, "PUT", {metadata}, resolve, reject, true);
        });
    }
}