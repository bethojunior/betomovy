class AdvertisingController {
    static get({lat,lng}){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`advertising/get?lat=${lat}&lng=${lng}`,"GET",null,resolve,reject);
        });
    }
}