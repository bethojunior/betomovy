class CountryController {
    static getAllV2(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("country", "GET", null, resolve, reject, true);
        })
    }

    static create(country){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("country", "POST", country, resolve, reject, true);
        })
    }
}