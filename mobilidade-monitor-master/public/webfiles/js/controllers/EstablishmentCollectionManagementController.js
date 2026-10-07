class EstablishmentCollectionManagementController {
    static listCharges() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('establishmentCollectionManagement','GET', null,resolve, reject, true);
        });
    }

    static insertCharges(data) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest('establishmentCollectionManagement', 'POST', data, resolve, reject, true);
        });
    }

    static deleteCharge(id) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest(`establishmentCollectionManagement/${id}`, 'DELETE', null, resolve, reject, true);
        });
    }

    static setBillingDate(billingDate) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('config/billingDate', 'PUT', {billingDate}, resolve, reject, true);
        });
    }

    static selectedBillingDate() {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest('config/billing_date', 'GET', null, resolve, reject, true);
        });
    }
}