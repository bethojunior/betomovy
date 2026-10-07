class ExternalServiceController {

    static getListServices() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("externalServiceActive", "GET", null, resolve, reject, true);
        });
    }

    static getServicesTypes() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("externalServiceType?externalServiceGroupId=1", "GET", null, resolve, reject, true);
        });
    }

    static updateExternalServiceActive(id, externalServiceTypeId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`externalServiceActive/${id}`, "PUT", {externalServiceTypeId}, resolve, reject, true);
        });
    }

    static changeTypeCodeConfirmation(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('requiredField/changeConfirmationCode', "PUT", data, resolve, reject, true);
        });
    }

    static getConfirmationCodeCustomer() {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest('requiredField/confirmationCodeCustomer', "GET", null, resolve, reject, true);
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`externalService/sms`, "GET", null, resolve, reject, true);
        });
    }

    static updateService(id, metadata) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`externalService/${id}`, "PUT", {metadata}, resolve, reject, true);
        });
    }

    static testKeyServiceExternal(phone) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest('externalService/sendSmsTest', 'POST', {phone}, resolve, reject, true);
        });
    }
}