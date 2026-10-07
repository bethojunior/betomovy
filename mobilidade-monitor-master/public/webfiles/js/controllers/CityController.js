class CityController {
    static getAll(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain("City/GetAll?estado="+id , "POST",
                null,resolve,reject);
        });
    }
    static getActives(){
        return CityController.getCitiesActivesV2().then(({status, response: data, message})=>{
            return {
                status,
                data,
                message
            }
        })
    }

    static getCityByCityId(cityId) {
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`city/${cityId}`, "GET", null, resolve, undefined, true);
        })
    }

    static getCitiesActivesV2(){
        return new Promise((resolve) => {
            ConnectionServer.sendRequest("city/actives/fully","GET",null,resolve, undefined, true);
        });
    }

    static getByEstate(estateId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("city?estateId="+estateId,"GET",null,resolve);
        });
    }

    static getByEstateV2(estateId, isUpdatePJ = false, search = ""){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("city?estateId="+estateId + "&isUpdatePJ=" + isUpdatePJ + "&q=" + search,"GET",null,resolve, undefined, true);
        });
    }


    static getConfigs(){
        return new Promise((resolve) => {
            ConnectionServer.sendRequest("config", "GET",null,resolve, undefined, true);
        });
    }

    static getTripTypes(cityId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city/${Session.getValueInSessionLocal("citySelected","cityId")}/tripTypes`,"GET",null,resolve,reject);
        });
    }

    static getTripTypesV2(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city/${Session.getValueInSessionLocal("citySelected","cityId")}/tripTypes`,"GET",null,resolve,reject, true);
        });
    }

    static deleteCityRole(cityId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`role/city/delete/${cityId}`, "DELETE",null,resolve, reject, true);
        });
    }

    static updateCityShortName(cityId, shortName) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city/${cityId}`, "PUT",{shortName},resolve, reject, true);
        });
    }

    static find(cityId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city/${cityId}`, "GET",null,resolve, reject);
         });
    }

    static create(city) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("city", "POST",city,resolve, reject, true);
        });
    }

    static deleteCityName(cityId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city/${cityId}/delete/cityName`, "DELETE",null,resolve, reject, true);
        });
    }
}
