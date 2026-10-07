class DynamicAreaController {
    static findAll(lat, lng) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dynamicArea/findAll?lat=${lat}&lng=${lng}&timeCurrent=${new Date().toLocaleTimeString()}`, 'GET', null, resolve, reject);
        })
    }
}