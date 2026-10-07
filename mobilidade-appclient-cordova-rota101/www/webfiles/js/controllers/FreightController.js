class FreightController {
    static new(object){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Freight/new","POST",object,resolve,reject,false);
        });
    }

    static picture(form){
        return ConnectionServer.sendFile('freight/picture',"POST",form);
    }

    static acceptScheduled(tripReference, driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `Freight/acceptScheduled`, `POST`,
                {tripReference, driverId}, resolve, reject,false);
        })
    }
}
