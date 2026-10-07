class DriverController {

    static getAllPositions(status = "disponivel,desligado,corrida") {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/positions?status=${status}`, 'GET', null, resolve, reject, true);
        });
    }

    checkEmail(email) {
        return new Promise(resolve => {
            ConnectionServer.sendRequestMain('Driver/CheckEmail', 'POST', {email}, resolve);
        });
    }

    static checkCpf(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain('Driver/CheckDocument', 'POST', data, resolve, reject, false);
        });
    }

    static getDriversMarket(page = 1, name = '') {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('preRegisterDriver?page=' + page, 'GET', null, resolve);
        });
    }

    static getDriversList(page = 1, filters = {}) {
        return new Promise((resolve, reject) => {
            const filter = Object.keys(filters).map(key => {
                return `${key}=${filters[key]}`;
            }).join("&")

            return ConnectionServer
                .sendRequest(
                    `driver?page=${page}&${filter}`,
                    'GET',
                    null,
                    resolve, reject, true);
        });
    }

    static getDrivers(page = 1,
                      name = '',
                      email = '',
                      document = '',
                      phone = '',
                      carPlate = '',
                      status = 2) {

        return new Promise((resolve, reject) => {
            let filter = "";

            if (name != "")
                filter += '&name=' + name;

            if (email != "")
                filter += '&email=' + email;

            if (document != "" && document !== 2)
                filter += '&document=' + document;

            if (phone != "")
                filter += '&phone=' + phone;

            if (carPlate != "")
                filter += '&carPlate=' + carPlate;

            ConnectionServer
                .sendRequest(
                    `driver?page=${page}${filter}`,
                    'GET',
                    {},
                    resolve, reject, true);

            // ConnectionServer.sendRequest('driver?page=' + page + '&name=' + name + '&email=' + email, 'GET', null, resolve);
        });
    }

    static updateDriver(data, driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('driver/' + driverId, 'PUT', data, resolve, reject, true);
        });
    }

    static delete(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('driver/' + id, 'DELETE', '', resolve, undefined, true);
        });
    }

    static getDriverById(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('driver/' + id, 'GET', {}, resolve);
        });
    }

    static getPendencies() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('pendencyReasonsType', 'GET', '', resolve);
        });
    }

    static insertPendencies(driverId, data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('pendencyreasons/driver/' + driverId, 'POST', data, resolve);
        });
    }

    static insertBalance(id, data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('balance/driver/' + id, 'PUT', data, resolve, undefined, true)
        })
    }

    static blockDriver(driverId, data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('blockreasons/driver/' + driverId, 'POST', data, resolve, undefined, true);
        })
    }

    static updateDataCar(data, idCar) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('car/' + idCar, 'PUT', data, resolve, reject, true);
        });
    }

    static activateRegister(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('driver/' + id + '/activateRegister', 'PUT', {}, resolve, undefined, true);
        });
    }

    static getTripByDriver(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip?driverId=' + data.driverId + '&page=' + data.page, 'GET', data, resolve);
        });
    }

    static listDriverBy(search = {page: 1}) {
        return new Promise((resolve, reject) => {
            const gets = Object.keys(search).map((attribute) => {
                return `${attribute}=${search[attribute]}`;
            }).join("&");

            ConnectionServer.sendRequest(`driver?${gets}`, "GET", null, resolve, reject, true);
        })
    }

    static getReasonsBlocked() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('blockReasonsType', 'GET', null, resolve,()=>{},true);
        })
    }

    static getFinancialById(id, params) {
        return new Promise(resolve => {
             ConnectionServer.sendRequest(
                `driver/${id}/financial-report?${ConnectionServer.createGets(params)}`,
                'GET',
                {},
                resolve,
                undefined,
                true
            );
        });
    }

    static getFinancialDetailOfTrip(id, date) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`report/financialDetailOfTrip?driverId=${id}&${date ? `date=${date}` : ''}`,
                `GET`,
                {},
                resolve,
                undefined,
                true);
        })
    }

    static resetBalance(userId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                `resetBalance/driver/${userId}`,
                'POST',
                {userId},
                resolve,
                undefined,
                true
            );
        });
    }

    static getTypeUsersV2() {
        return new Promise((resolve,reject) => {
            ConnectionServer.sendRequest(
                'userType/drivers',
                'GET',
                '',
                resolve,
                reject,
                true
            )
        })
    }

    static getTypeUsers() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'userType/driver',
                'GET',
                '',
                resolve
            )
        })
    }

    static changeTypeUser(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'user/' + data.userId + '/changeType',
                'PUT',
                data,
                resolve
            )
        })
    }

    static releasePhoto(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'driver/' + id + '/profileImage/authorize',
                'POST',
                '',
                resolve,
                '',
                true
            )
        })
    }

    static denyPhoto(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'driver/' + id + '/profileImage/deny',
                'POST',
                '',
                resolve,
                '',
                true
            )
        })
    }

    register(driver, registerByManager = false, userLoggedManagerId = null) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();

            if (registerByManager) {
                formData.append("registerByManager", registerByManager);
                formData.append("userLoggedManagerId", userLoggedManagerId);
            }

            formData.append("stdObject", JSON.stringify(driver));


            Promise.all([
                new Promise(resolve1 => {
                    formData.append("PROFILE", driver.image.PROFILE.data, driver.image.PROFILE.name);

                    resolve1();
                }),
                ...driver.image.DOCUMENTS.map(item => {
                    return new Promise(resolve1 => {
                        formData.append(`DOC_${item.docId}`, item.image.data, item.image.name);

                        resolve1();
                    })
                })])
                .then(() => {
                    ConnectionServer.sendRequestWithFilesMain("Driver/Register", "POST", formData)
                        .then(resolve)
                        .catch(reject);
                });

        });
    }


    static getBanks() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('bank', 'GET', '', resolve, reject, true);
        });
    }

    static lastPositions(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/${driverId}/lastPositions`, "GET", null, resolve, reject, true);
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/${id}`, "GET", null, resolve, reject, true);
        })
    }

    static criminalRecord(id, data) {
        return new Promise (resolve => {
            ConnectionServer.sendRequest(`driver/criminal-record/${id}`, 'POST', data, resolve, undefined, true);
        });
    }

    static requestNewProfileImage(id, blockDriver) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driver/${id}/profileImage/requestNew`, "POST", {blockDriver}, resolve, reject, true);
        })
    }

    static getDriverRegisterStatus(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('report/select/driverRegisterStatus','GET','',resolve,reject,true);
        });
    }

    static getObservation(id) {
        return new Promise ( resolve => {
            ConnectionServer.sendRequest(`driver/${id}`, 'GET', id, resolve, null, true);
        })
    }

    static createObservation(id, data) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`user/${id}/observation`, 'PUT', data, resolve, undefined, true)
        })
    }

    static messageWhatsapp() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('config/whatsapp_message_driver', 'GET', {}, resolve, undefined, true);
        });
    }
    static getInformation(id, page = 1) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`driver/${id}/driverAppInfo?page=${page}`, 'GET', null, resolve, undefined, true);
        });
    }

    static getNoteDriver(id) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`tripRating?driverId=${id}`, 'GET', id, resolve, undefined, true);
        });
    }

    static updateDriverAddress(data, driverId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`driver/${driverId}/address`, 'POST', data, resolve, undefined, true);
        });
    }

    static createDriverSplitConfig(driverId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`driver/${driverId}/driverSplitConfig`, 'POST', {}, resolve, undefined, true);
        });
    }

    static getDriverSplitConfig(driverId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`driver/${driverId}/driverSplitConfig`, 'GET', {}, resolve, undefined, true);
        });
    }
}
