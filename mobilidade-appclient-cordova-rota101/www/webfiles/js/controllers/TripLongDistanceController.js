class TripLongDistanceController {
    static recalculate({tripReference,oldPrice,newPrice,newDistance,newTripTime}){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                "TripLongDistance/Recalculate",
                "POST",
                {
                        tripReference,
                        oldPrice,
                        newPrice
                },
                resolve,reject,false);
        })
    }
}