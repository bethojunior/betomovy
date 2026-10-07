class TripReceiptController{

    static sendCustomer(tripReference){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`TripReceipt/SendCustomer?t=${tripReference}`,
                "GET",null,resolve,reject);
        })
    }
}