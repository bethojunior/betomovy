class PartnerController {
    static findByUser(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Partner/FindByUser","GET",null,resolve,reject);
        })
    }

    static newTrip(trip){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Partner/NewTrip","POST",trip,resolve,reject,false);
        })
    }

    static getActiveTrips(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Partner/GetActiveTrips","GET",null,resolve,reject);
        });
    }
}