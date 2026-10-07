class ConfigController {
    static general(){
        return new Promise((resolve, reject) => {
            return ConnectionServer.sendRequest("config/general","GET",null,resolve,reject);
        })
    }
}