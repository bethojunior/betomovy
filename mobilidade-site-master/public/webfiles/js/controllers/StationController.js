class StationController{
    getByCity(cityId,stationTypeId){
        return new Promise(resolve=>{
            ConnectionServer.sendRequest('Station/GetByCity','POST',{cityId,stationTypeId},resolve);
        })
    }

    getByDriver(driverId){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('Station/GetByDriver','POST',{driverId},resolve,reject);
        })
    }
    insertByDriver(station){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('Station/InsertByDriver','POST',station,resolve,reject);
        })
    }
    edit(station){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('Station/Edit','POST',station,resolve,reject);
        })
    }
}