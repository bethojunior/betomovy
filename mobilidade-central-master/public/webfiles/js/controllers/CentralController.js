class CentralController {
    static getAllCentralCallTypes() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('central/centralCallTypes/findAll', 'GET', null, resolve, undefined, true);
        });
    }
}