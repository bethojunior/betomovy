class BeesCentralController {

    static getFee() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('central/fee', 'GET', null, resolve, undefined, true);
        });
    }

    static updateFeeCentral(returnFee) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('central/fee', 'POST', returnFee, resolve, undefined, true);
        });
    }
}