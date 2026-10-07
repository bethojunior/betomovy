class TripTypeController {
    static findByLocale(location) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`TripType/FindByLocale?latlng=${location.lat},${location.lng}`,
                "GET", null, resolve, reject, undefined, false);
        });
    }
}