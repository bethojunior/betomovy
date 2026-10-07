class TripBidController{
    static actionAccept(tripBidId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripbid/AcceptOffer","POST",{tripBidId}, resolve,reject,false)
        })
    }

   static actionRefuse(tripBidId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripBid/refuse","POST",{tripBidId}, resolve,reject,false)
        })
    }

    static actionChangePrice(tripReference,price){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripbid/changepricetrip","POST",{tripReference,price}, resolve,reject,false)
        })
    }
}