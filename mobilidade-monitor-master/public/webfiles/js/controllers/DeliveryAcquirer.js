class DeliveryAcquirer {
    static getAcquirer(){
        return new Promise((resolve)=>{
            ConnectionServer.sendRequest('deliveryAcquirer','GET',{},resolve, undefined, true);
        });
    }

    static updateAcquirer(id, metadata){
        return new Promise((resolve)=>{
            ConnectionServer.sendRequest(`deliveryAcquirer/${id}`,'PUT', {metadata},resolve, undefined, true);
        });
    }
}