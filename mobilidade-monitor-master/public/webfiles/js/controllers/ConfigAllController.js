class ConfigAllController {

    static getAll()
    {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("configs","GET",null,resolve,reject);
        });
    }
    
    static getAllV2()
    {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("config","GET",null,resolve,reject, true);
        });
    }

}