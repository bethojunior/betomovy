class UserTypeController {
    static getDrivers(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain(`usertype/drivers`,`GET`,null,resolve,reject);
        })
    }

    static getDriversAppPartner(appPartner){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain(`usertype/driversbyapppartners?app_partner=${appPartner}`,`GET`,null,resolve,reject);
        })
    }
}