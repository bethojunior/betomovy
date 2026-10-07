class DynamicController {
    static lastDynamicPlaces({lat,lng}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dynamic/lastDynamicsPlaces?latitude=${lat}&longitude=${lng}`, "GET", null, resolve, reject);
        })
    }

    static expensiveDynamicsPlaces({lat,lng}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dynamic/ExpensiveDynamicsPlaces?limit=15&latitude=${lat}&longitude=${lng}`, "GET", null, resolve, reject);
        })
    }

    static placesMoreTripsDayAgo({lat,lng}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dynamic/PlacesMoreTripsDayAgo?limit=15&latitude=${lat}&longitude=${lng}`, "GET", null, resolve, reject);
        })
    }

    static placesMoreTripsWeekAgo({lat,lng}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dynamic/placesMoreTripsWeekAgo?limit=15&latitude=${lat}&longitude=${lng}`, "GET", null, resolve, reject);
        })
    }
}
