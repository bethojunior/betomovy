class TripPaymentFormRepository {
    static getAll(){
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest("tripPaymentForm","GET",null,resolve,reject);
        });
    }
}