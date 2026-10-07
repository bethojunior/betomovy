class PartnerController {
    static actionList() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`partner`,"GET",null, resolve, reject, true);
        });
    }

    static changeStatus(idPartner,partnerRegisterStatusId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`partner/${idPartner}/changeStatus`,"PUT",
                {partnerRegisterStatusId},resolve,reject);
        });
    }

    static insert(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestApi(`Partner/RequestPartnership`,"POST",
                data,resolve,reject);
        });
    }

    static getStatusPartner() {
        return new  Promise(resolve => {
            ConnectionServer.sendRequest(`report/select/partnerRegisterStatus`, 'GET', null, resolve, undefined, true);
        });
    }

    static filterPartnerName(userName, statusId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`partner?name=${userName}&partnerRegisterStatusId=${statusId}`, 'GET', userName, resolve, undefined, true);
        });
    }

    static filterPartnerEmail(userEmail, statusId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`partner?email=${userEmail}&partnerRegisterStatusId=${statusId}`, 'GET', null, resolve, undefined, true);
        });
    }

    static filterPartnerStatus(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`partner?partnerRegisterStatusId=${id}`, 'GET', null, resolve, undefined, true);
        });
    }

    static getMessageAudit(filter) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`audit?${filter}`, 'GET', null, resolve, undefined, true);
        });
    }

    static deleteMessageAudit(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`audit/${id}`, 'DELETE', null, resolve, undefined, true);
        });
    }
}