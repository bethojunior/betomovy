class TripController {
    share(tripReference){
        return new Promise((resolve,reject ) =>{
            ConnectionServer.sendRequest('Trip/Share', 'POST', {tripReference}, resolve,reject,undefined,false);
        });
    }
}