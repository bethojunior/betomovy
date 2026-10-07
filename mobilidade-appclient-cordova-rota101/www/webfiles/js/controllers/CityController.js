class CityController {
    static getAll(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("City/GetAll?estado="+id , "POST",
                null,resolve,reject);
        });
    }

    static getConfig(cityId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("City/GetConfig", "POST",
                {cityId},resolve,reject,false);
        });
    }


    /**
     *
     * @param position {Object}{lat:0,lng:0}
     * @returns {Promise<any>}
     */
    static getConfigByPosition(position){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("City/GetConfig","POST", position,resolve,reject,false);
        });
    }

    static general(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("config/general","GET",null,resolve,reject,false);
        });
    }

    static getAllCitiesActives() {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest('city/getactives', 'GET', null, resolve, reject, false);
        });
    }
}
