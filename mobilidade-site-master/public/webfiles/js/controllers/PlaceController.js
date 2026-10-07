class PlaceController {
    static searching(address, latlng) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Place/Search?latlng=${latlng}&q=${address}`, "GET", null, resolve, reject, undefined, false);
        });
    }

    static getDetailPlace(address) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`geocoding/search?address=${address}`, 'GET', null, resolve, reject, undefined, false);
        });
    }
}