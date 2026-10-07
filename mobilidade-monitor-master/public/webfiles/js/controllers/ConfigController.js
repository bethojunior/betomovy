class ConfigController {
    static getRealtimeDatabase() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("config/realtimeDatabase",
                "GET", null, resolve, reject, true);
        });
    }


    static updateRealtimeDatabase(status) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("config/updateRealtimeDatabase",
                "PUT", {status}, resolve, reject, true);
        });
    }

    static formStep() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("config/formStep",
                "GET", null, resolve, reject, true);
        });
    }

    static formStepUserType(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/formStep/userType/${id}`, 'GET', null, resolve, reject, true);
        });
    }

    static removeFormStepUserType(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/formStepUserType/${id}`, 'DELETE', null, resolve, reject, true);
        });
    }

    static insertFormStepUserType({userTypeId, formStepId}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/formStepUserType`, 'POST', {
                userTypeId,
                formStepId
            }, resolve, reject, true)
        })
    }

    static getDelivery(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("config/delivery","GET",null,resolve,reject,true);
        })
    }
}