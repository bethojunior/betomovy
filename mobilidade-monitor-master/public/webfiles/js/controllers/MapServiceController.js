class MapServiceController {
    static getList() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('mapService', "GET", null, resolve, reject, true);
        });
    }

    static insert(mapServiceId, metadata) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('mapService', "POST", {mapServiceId, metadata}, resolve, reject, true);
        })
    }

    static getTypes() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('mapService/types', "GET", null, resolve, reject, true);
        });
    }

    static disableByGroupCode(groupCode) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`mapService/${groupCode}/disable`, "GET", null, resolve, reject, true);
        });
    }
}