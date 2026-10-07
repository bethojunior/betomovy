class CarController {
    static insertSecondCar(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Car/InsertSecondCar", "POST",data,resolve,reject);
        })
    }

    static findAllPendingByDriver(driverId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Car/FindAllPendingByDriver?driverId=${driverId}`,"GET",null,resolve,reject);
        });
    }
}
