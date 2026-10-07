class UserTypeController {
    static changeStatus(id, status) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`userType/${id}/${status}`, "PUT", null, resolve, reject, true, false);
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`userType/${id}`, "DELETE", null, resolve, reject, true, false);
        });
    }

    static getActives(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`userType/actives`,"GET",null,resolve,reject,true);
        });
    }

    static changeTypeDrive(userLast, userNew) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`userType/${userLast}/moveUsers/${userNew}`, 'PUT', null, resolve, undefined, true)
        });
    }

    static getNotifyBirthday() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`eventNotification`, 'GET', null, resolve, undefined, true)
        });
    }

    static createNotifyBirthday(data) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`eventNotification`, 'POST', data, resolve, undefined, true)
        });
    }

    static deleteNotifyBirthday(id) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`eventNotification/${id}`, 'DELETE', null, resolve, undefined, true)
        });
    }
}