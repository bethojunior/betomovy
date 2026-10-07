class TripPaymentFormController {
    getAll(){
        return new Promise((resolve,reject) => {
            ConnectionServer.sendRequest('TripPaymentForm/GetAll','POST',{},resolve,reject);
        });
    }
}