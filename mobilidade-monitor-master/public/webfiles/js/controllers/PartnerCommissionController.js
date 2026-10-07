class PartnerCommissionController {

    static insert(object){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("partnerCommission/","POST",object,resolve,reject);
        });
    }

    static update(id,object){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`partnerCommission/${id}`,"PUT",object,resolve,reject);
        });
    }
}