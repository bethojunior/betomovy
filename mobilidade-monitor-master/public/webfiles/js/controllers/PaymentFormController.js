class PaymentFormController {
    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("paymentForm", "GET", null, resolve, reject, true);
        });
    }

    static insertCreditPrepaid(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("creditPrepaid", "POST", data, resolve, reject, true);
        });
    }

    static listCreditPrepaid(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("creditPrepaid","GET",null,resolve,reject,true);
        })
    }

    static deleteCreditPrepaid(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`creditPrepaid/${id}`,"DELETE",null,resolve,reject,true);
        })
    }
}