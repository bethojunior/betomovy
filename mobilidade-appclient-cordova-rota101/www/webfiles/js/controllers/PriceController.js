class PriceController {
    static getPrice(origin, destiny, tripTypeId, waypoints = null) {
        return new Promise((resolve, reject) =>
            ConnectionServer.sendRequest('Price/Calculate', 'POST', {
                origin,
                destiny,
                tripTypeId,
                waypoints
            }, resolve, reject, false))
    }

    calculateAll(cityId, origin, destiny, waypoints, time, noDestination) {
        return new Promise((resolve, reject) =>
            ConnectionServer.sendRequest('Price/CalculateAll', 'POST',
                {cityId, origin, destiny, waypoints, time, noDestination, timeCurrent: new Date().toLocaleTimeString()},
                resolve, reject, false))
    }

    calculate(origin, destination, waypoints, noDestination) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("PricePartner/Calculate", "POST",
                {origin, destination, waypoints, noDestination}, resolve, reject, false);
        });
    }

    static previewNewPriceInChangeRoute({tripReference, destination,waypoints, kmProgressing, minuteProgressing, multiplierDynamicPrice}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
              "Price/PreviewNewPriceInChangeRoute",
              "POST",
              {
                tripReference,
                destination,
                waypoints,
                kmProgressing,
                minuteProgressing,
                timeCurrent: new Date().toLocaleTimeString(),
                multiplierDynamicPrice,
              },
              resolve,
              reject,
              false
            );
        });
    }
}
