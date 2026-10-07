class TripCallInfoController {
    static get(tripReference){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("TripCallInfo/Get","POST",
                {tripReference},resolve,reject,undefined,false)
        });
    }
}