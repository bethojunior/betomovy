class PriceController {
    getPrice(origin,destiny) {
        return new Promise((resolve,reject) =>
            ConnectionServer.
                sendRequest('Price/Calculate', 'POST', { origin, destiny }, resolve,reject,false))
    }
    calculateAll(cityId,origin,destiny,waypoints) {
        return new Promise((resolve,reject) =>
            ConnectionServer.
                sendRequest('Price/CalculateAll', 'POST',
                {cityId,origin, destiny,waypoints},
                resolve,reject,false))
    }

    calculate(origin,destination,waypoints){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("PricePartner/Calculate","POST",
                {origin,destination,waypoints},resolve,reject,false);
        });
    }
}