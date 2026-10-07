class CentralController {
    static insert(data) {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("address", data.address);
        formData.append("latitude", data.latitude);
        formData.append("longitude", data.longitude);
        formData.append("syncCustomers", data.syncCustomers ? "1" : "0");
        formData.append("centralCallDriver", data.centralCallDriver);
        formData.append("user[name]", data.user.name);
        formData.append("user[email]", data.user.email);
        formData.append("user[phone]", data.user.phone);
        formData.append("user[password]", data.user.password);
        formData.append("logo", data.logo.data, data.logo.name);

        return ConnectionServer.sendRequestWithFiles("central", "POST", formData, true)
    }

    static get(name,page) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central?page=${page}&name=${name}`, "GET", null, resolve, reject,true);
        })
    }

    static getCentral(idCentral) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${idCentral}`, "GET", null, resolve, reject, true);
        })
    }

    static edit(idCentral, data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${idCentral}`, "PUT", data, resolve, reject, true);
        })
    }

    static updateVoucherValue(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/balance`, "POST", data, resolve, reject, true);
        })
    }

    static updateLogo(idCentral, logo) {
        const formData = new FormData();

        formData.append("logo", logo.data, logo.name);

        return ConnectionServer.sendRequestWithFiles(`central/${idCentral}/updateLogo`, "POST", formData)
    }

    static listPartnerCommission() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("partnerCommission", "GET", null, resolve, reject, true);
        })
    }

    static insertPartnerCommission(commission) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("partnerCommission", "POST", commission, resolve, reject, true);
        })
    }

    static deletePartnerCommission(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`partnerCommission/${id}`, "DELETE", null, resolve, reject, true);
        })
    }

    static editPartnerCommission(id, commission) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`partnerCommission/${id}`, "PUT", commission, resolve, reject, true);
        });
    }

    static centralCallDriver() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("central/centralCallDriver", "GET", null, resolve, reject, true);
        })
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${id}`, "DELETE", null, resolve, reject, true)
        });
    }

    static changeStatus(id,status){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${id}/${status}`, "PUT",null,resolve,reject,true);
        })
    }

    static getCentralCallTypes() {
        return new Promise((resolve) => {
            ConnectionServer.sendRequest("central/centralCallTypes/findAll", "GET", null, resolve, undefined, true);
        })
    }

    static updateCentralCallType(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("central/centralCallTypes/update", "PUT", data, resolve, reject, true);
        })
    }

    static getPriceRange(cityId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`central/priceRange?cityId=${cityId}`, 'GET', '', resolve, '', true);
        })
    }

    static insertPriceRange(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("central/priceRange", "POST", data, resolve, reject, true);
        })
    }

    static deletePriceRange(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('central/priceRange/' + id, 'DELETE', '', resolve, '', true);
        })
    }

    static getAllCentral() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central`, "GET", null, resolve, reject,true);
        })
    }
}