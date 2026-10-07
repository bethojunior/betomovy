class CityController {
    static getAll(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain("City/GetAll?estado="+id , "POST",
                null,resolve,reject);
        });
    }

    static getConfig(cityId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("City/GetConfig", "POST",
                {cityId},resolve,reject,false);
        });
    }
}