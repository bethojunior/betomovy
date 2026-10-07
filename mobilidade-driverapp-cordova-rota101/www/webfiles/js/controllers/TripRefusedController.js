class TripRefusedController {
    static create(driverId,tripId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("TripRefused/Create","POST",{driverId,tripId}, resolve,reject, undefined,true);
        })
    }

    static get(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("TripRefused/Get","POST",{id}, resolve,reject, undefined,true);
        })
    }

    static delete(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("TripRefused/Delete","POST",{id}, resolve,reject, undefined,true);
        })
    }
}