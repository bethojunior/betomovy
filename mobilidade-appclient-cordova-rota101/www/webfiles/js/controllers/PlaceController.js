class PlaceController {
    static searching(address,latlng){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Place/Search?latlng=${latlng}&q=${address}`,"GET",null,resolve, reject,false);
        });
    }
    static getLocalByLocation({lat,lng}){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`geocoding/search?latlng=${lat},${lng}`, 'GET', null,resolve,reject);
        })
    }
}
