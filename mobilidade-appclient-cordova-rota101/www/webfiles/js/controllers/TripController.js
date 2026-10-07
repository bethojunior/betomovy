class TripController {

    static actionNew(object, callback) {
        ConnectionServer.sendRequest('Trip/New', 'POST', object, callback);
    }

    static actionGet(tripReference, zoneId, callback) {
        ConnectionServer.sendRequest('Trip/Get', 'POST', {tripReference, zoneId}, callback);
    }

    static actionCancel(tripReference, userId, dateEnd, callback) {
        ConnectionServer.sendRequest('Trip/Cancel', 'POST', {tripReference, userId, dateEnd}, callback);
    }


    static increaseArea(tripReference, zoneId, callback) {
        ConnectionServer.sendRequest('Trip/IncreaseArea', 'POST', {tripReference, zoneId}, callback);
    }

    static get(tripReference) {
        return new Promise((resolve, reject) => {
            if (typeof (managerTripViewCurrent) !== "undefined") {
                managerTripViewCurrent.request =
                    ConnectionServer.sendRequest('Trip/Get', 'POST', {tripReference}, resolve, reject);
            } else {
                ConnectionServer.sendRequest('Trip/Get', 'POST', {tripReference}, resolve, reject);
            }
        })
    }

    static getById(idTrip) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Trip/GetById', 'POST', {idTrip}, resolve);
        })
    }

    static ratingDriver(rating, tripReference, userId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('trip/rating/driver', 'POST',
                {rating, tripReference, userId}, resolve, reject, false);
        })
    }

    static getShareLink(tripReference) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Trip/GetShareLink?tripReference=${tripReference}`, 'GET',
                null, resolve, reject, false);
        })
    }

    static changeRoute({tripReference, price, distance, duration, waypoints, destination}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('trip/changeRoute', 'POST', {
                tripReference,
                price,
                distance,
                duration,
                waypoints,
                destination
            }, resolve, reject, false);
        })
    }
}
