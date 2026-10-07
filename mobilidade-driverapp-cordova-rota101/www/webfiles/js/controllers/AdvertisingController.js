class AdvertisingController{
    static findByCoordinate(lat,lng){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`advertising/get?lat=${lat}&lng=${lng}&appId=2`,"GET",null,resolve,reject)
        })
    }
}