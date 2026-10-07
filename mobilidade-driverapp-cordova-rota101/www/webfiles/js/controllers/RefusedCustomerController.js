class RefusedCustomerController{
    static insert(customerId,driverId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("RefusedCustomer/Insert","POST",
                {customerId,driverId},
                resolve,reject,
                undefined,false);
        });
    }
}