class CentralVoucherPurchasePaymentController {
    static getVoucherPurchasePaymentForms() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('central/voucherPurchasePayment/findAllActives', 'GET', null, resolve, undefined, true);
        });
    }
}