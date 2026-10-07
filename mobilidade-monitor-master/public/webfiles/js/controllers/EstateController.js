class EstateController {
    static getAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("estate","GET",null,resolve,reject);
        })
    }

    static getAllV2(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("estate", "GET", null, resolve, reject, true);
        })
    }

    static getByCountry(countryId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("estate/country/"+countryId,"GET",null,resolve,reject,true);
        })
    }

    static getById(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("estate/"+id,"GET",null,resolve,reject,true);
        })
    }

    static create(estate){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("estate","POST",estate,resolve,reject,true);
        })
    }
}