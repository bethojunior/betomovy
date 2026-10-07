class MapSettingController {

    static getAll()
    {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("config","GET",null,resolve,reject, true);
        });
    }

    static update(data)
    {
        return new Promise((resolve , reject) => {
            ConnectionServer.sendRequest('config','PUT',data,resolve,reject, true)
        });
    }

    static getConfigDelivery() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/type_of_delivery_area`,'GET',null, resolve,reject,true);
        });
    }


    static getNameEstablishmentDelivery() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/name_establishment_delivery`,'GET',null, resolve,reject,true);
        });
    }

    static getConfigDeliveryConfirmationCodeRegisterCustomer() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/customer_register_sms_confirmation_code`,'GET',null, resolve,reject,true);
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/type/${id}`, 'GET', null, resolve, reject, true);
        });
    }

    static test(type) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestApi(`map/serviceTest`, 'POST', {type}, resolve);
        });
    }
}