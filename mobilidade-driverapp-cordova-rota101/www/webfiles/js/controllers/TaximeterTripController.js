class TaximeterTripController {
    static insert(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("taximeterTrip/start","POST",data,resolve,reject,undefined,false);
        })
    }

    static update(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("TaximeterTrip/update","POST",data,resolve,reject,5000,false)
        })
    }
}
