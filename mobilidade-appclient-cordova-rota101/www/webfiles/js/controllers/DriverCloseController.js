class DriverCloseController {
    static get({lat,lng}){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`DriverClose/Get?lat=${lat}&lng=${lng}`,'GET',null,resolve,reject);
        });
    }
}