class TripBidController{
    static create(driverId,tripId,price){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripbid/create","POST",{driverId,tripId,price}, resolve,reject, undefined,false);
        })
    }

    static cancel(driverId, tripReference) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/RefuseTrip', 'POST', {driverId, tripReference}, resolve);
        })
    }
        
    static accept(driverId,tripReference){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripbid/acceptOfferByDriver","POST",{driverId,tripReference}, resolve,reject, undefined,false);
        })
    }
}