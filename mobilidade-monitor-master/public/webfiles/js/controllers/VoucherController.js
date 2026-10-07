class VoucherController {
    static insertVoucherByClient(data){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('balance/'+data.idCostumer+'/flow' , 'PUT' , data , resolve, undefined, true);
        });
    }

    static getAllPromotionalVouchers(page) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest(`voucherPromotion?page=${page}`, 'GET', null, resolve, reject, true);
        });
    }

    static getPromotionVoucherById(id) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest(`voucherPromotion/${id}`, 'GET', null, resolve, reject, true);
        });
    }

    static insertPromotionVoucher(data) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest('voucherPromotion', 'POST', data, resolve, reject, true);
        });
    }

    static editPromotionVoucher(id, data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`voucherPromotion/${id}`, 'PUT', data, resolve, reject, true);
        });
    }

    static deletePromotionVoucher(id) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest(`voucherPromotion/${id}`, 'DELETE', null, resolve, reject, true);
        });
    }
}