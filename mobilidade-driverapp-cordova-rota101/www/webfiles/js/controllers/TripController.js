class TripController {

    static actionNew(object, callback) {
        ConnectionServer.sendRequest('Trip/New', 'POST', object, callback);
    }

    static actionGet(tripReference) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Trip/Get', 'POST', {tripReference}, resolve, reject);
        })
    }

    static actionCancel(tripReference, dateEnd, callback) {
        ConnectionServer.sendRequest('Trip/Cancel', 'POST', {tripReference, dateEnd}, callback);
    }

    static getTimeLineByTrip(tripReference) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Trip/GetWithTimeline', 'POST', {tripReference}, resolve)
        });
    }

    static ratingCustomer(rating, tripReference, userId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('trip/rating/customer', 'POST',
                {rating, tripReference, userId}, resolve, reject, false);
        })
    }

    static report(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Trip/Report', 'POST', data, resolve, reject, undefined, false)
        });
    }

    static recalculatePrice({tripReference, oldPrice, newPrice, newDistance, newTripTime}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Trip/RecalculatePrice', 'POST', {
                tripReference,
                oldPrice,
                newPrice,
                newDistance,
                newTripTime
            }, resolve, reject, undefined, false)
        });
    }

    static removeTripRoute(tripReference) {
        const port = Session.get("configLocation")?.port_url;

        const baseUrl = UrlBuilder.resolveWithPort(API_HOST_LOCATION, port);

        return ConnectionServer.sendRequestNative(`${baseUrl}/location/deleteRoute`, "post", {tripReference})
    }

    static sendNotifyByCustomer(phone){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Notify/SendAlertToCustomer', 'POST', {phone}, resolve, reject, undefined, false)
        });
    }

    static getCancelMessage(tripReference){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`UserType/GetMessageTripCanceled?tripReference=${tripReference}`, 'POST', {}, resolve, reject, undefined, false)
        });
    }
}
