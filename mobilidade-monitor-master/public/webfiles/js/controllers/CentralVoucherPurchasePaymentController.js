class CentralVoucherPurchasePaymentController {

    static getVoucherPurchasePaymentForms() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('central/voucherPurchasePayment/findAll', 'GET', null, resolve, undefined, true);
        });
    }

    static updateVoucherPurchasePaymentForm(data) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('central/voucherPurchasePayment/updatePaymentForm', 'PUT', data, resolve, undefined, true);
        });
    }
}