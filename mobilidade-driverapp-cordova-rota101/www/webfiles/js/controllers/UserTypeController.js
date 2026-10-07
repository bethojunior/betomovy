class UserTypeController {
    static getDrivers(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`usertype/drivers`,`GET`,null,resolve,reject);
        })
    }
}