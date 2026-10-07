class CustomerRideController {
    static find({lat, lng}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `CustomerRide/Find?lat=${lat}&lng=${lng}`,
                "GET",
                null,
                resolve,
                reject
            );
        });
    }

    static request({tripReference, tripPaymentFormId, value, riderTripCustomers}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`CustomerRide/Request`, "POST", {
                tripReference,
                tripPaymentFormId,
                value,
                riderTripCustomers
            }, resolve, reject, false);
        });
    }

    static findActives(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`CustomerRide/FindActives`, "GET", null, resolve, reject, false);
        })
    }


    static findByUser(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`CustomerRide/FindByUser`, "GET", null, resolve, reject, false);
        })
    }

    static cancelByCustomer(tripReference){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`CustomerRide/Cancel`, "POST", {tripReference}, resolve, reject, false);
        })
    }
}
