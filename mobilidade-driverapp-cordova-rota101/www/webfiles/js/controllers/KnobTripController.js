class KnobTripController {
    static init(trip){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("KnobTrip/Init","POST",trip,resolve,reject,undefined,false);
        });
    }
}