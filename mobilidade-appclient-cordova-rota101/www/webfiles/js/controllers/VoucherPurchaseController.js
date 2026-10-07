class VoucherPurchaseController {
    customerInsert(params){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("VoucherPurchase/CustomerInsert" , "POST",
                params,resolve,reject,false);
        });
    }

    static getAllVoucher(lat, lng) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`voucherPromotion/findAll?latitude=${lat}&longitude=${lng}`, "GET",
                null, resolve, reject, false);
        });
    }
}