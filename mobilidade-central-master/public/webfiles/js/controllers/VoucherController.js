class VoucherController {
    static getAll(lat, lng){
        return new Promise((resolve, reject)=>{
            ConnectionServer.sendRequestMain(`voucherPromotion/findAll?latitude=${lat}&longitude=${lng}&user=central`, "GET",
                null, resolve, reject);
        });
    }

    static buyWithCard(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('voucher/buyWithCard', "POST", data, resolve, reject);
        });
    }

    static generateChargePix(value, responsibleId, bonusVoucher){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('voucher/generateChargePix', "POST", {value, responsibleId, bonusVoucher}, resolve, reject);
        });
    }
}