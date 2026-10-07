class TripItemTypeController {
    static getAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("TripItemType/all","GET",null,resolve,reject,false);
        })
    }
}