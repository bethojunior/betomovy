class UserController {

    static getAll(name = '', page = 0) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('user/search?q=' + name, 'GET', '', resolve)
        })
    }

    static getAuthenticate(user) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('login', 'POST', user, resolve, reject, true);
        });
    }

    static getDrivers(page = 0) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('driver', 'GET', '', resolve)
        })
    }

    static getDriverByName(name = '', page = 0) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('driver?page=' + page + '&name=' + name, 'GET', '', resolve, undefined, true)
        })
    }

    static instertDriver(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'driver/register',
                'POST',
                data,
                resolve,
            )
        });
    }

    static userTypeDrivers() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                "userType/drivers",
                "GET",
                null,
                resolve,
                reject, true)
        });
    }

    static getUserTypeDrivers() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                "tripTypeDriver",
                "GET",
                null,
                resolve,
                reject, true)
        });
    }

    static edit(id, object) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`user/${id}`, "PUT", object, resolve, reject);
        });
    }

    /**
     *
     */
    static createUserDelivery(user){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('customer/register','POST',user,resolve,reject,false,true)
        })
    }

    static forgetPassword(data) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`user/forgetPassword`, 'POST', data, resolve, undefined, true);
        });
    }

    static updatePassword(id, data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`user/${id}/password`, 'PUT', data, resolve, undefined, true);
        });
    }

    static updatePasswordByConfig(id, data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`user/${id}/password`, 'PUT', data, resolve, undefined, true);
        });
    }

    static getAllDriversWithoutPage() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('driver/withoutPage', 'GET', '', resolve, undefined, true)
        })
    }

    static loginAdmin() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('auth/admin', 'POST', '', resolve, undefined, true)
        })
    }
}

