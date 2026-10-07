class PriceController {
    static getPrice(origin, destiny, tripTypeId) {
        return new Promise((resolve, reject) =>
            ConnectionServer.sendRequest('Price/Calculate', 'POST', {
                origin,
                destiny,
                tripTypeId
            }, resolve, reject, undefined, false));
    }

    static findByTripType({lat,lng},tripTypeId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Price/FindByTripType?tripTypeId=${tripTypeId}&lat=${lat}&lng=${lng}`,"GET", null,resolve,reject, undefined,false);
        })
    }
}
