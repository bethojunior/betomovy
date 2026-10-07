class TripTypeController {
    static actives(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripType/Actives","GET",null,resolve,reject,false);
        })
    }
}