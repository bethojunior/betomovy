class DeliveryChargeController extends ConnectionServer {
    static getCharges(page=1, filter=null) {
        return new Promise(resolve => {

            let path = `establishmentBilling?page=${page}`;
            if(filter != null){
                path += `&companyId=${filter}`
            }
            ConnectionServer.sendRequest(path,'GET', null, resolve, undefined, true);
        });
    }

    static createCharge(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`establishmentBilling`, 'POST', data, resolve, undefined, true);
        });
    }

    static deleteCharge(id) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`establishmentBilling/${id}`, 'DELETE', null, resolve, undefined, true);
        });
    }

    static approvePaymentCharge(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`establishmentBilling/${id}/confirm`, 'PUT', null, resolve, undefined, true);
        });
    }

    static refusePaymentCharge(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`establishmentBilling/${id}/refuse`, 'PUT', null, resolve, undefined, true);
        });
    }
}