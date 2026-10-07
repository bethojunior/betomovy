class DeliveryInfoController {
    static suggestion(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryInfo/suggestion`,'GET',null,resolve,reject);
        });
    }
}