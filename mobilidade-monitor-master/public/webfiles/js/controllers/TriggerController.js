class TriggerController {
    static getAllTrigger(cityId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`priceDynamicScheduled`,"GET", cityId, resolve, reject, true);
        });
    }

    static getAllTriggerDynamic(cityId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`price/dynamic?cityId=${Session.getValueInSessionLocal("citySelected","cityId")}`,"GET",null,resolve,'',true);
        });
    }

    static getAllTypeTrip(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("tripType","GET",null,resolve);
        });
    }

    static showTrigger(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`price/dynamic/${id}/show`,"GET",null,resolve, reject,true);
        });
    }

    static updateTrigger(id, data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`price/dynamic/${id}/update`,"PUT", data, resolve, reject, true);
        });
    }

    static deleteTrigger(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`priceDynamicScheduled/${id}`,"DELETE", null, resolve, reject, true);
        });
    }

    static deleteTriggerDynamic(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`price/dynamic/${id}`,"DELETE",reject,resolve , '',true);
        });
    }

    static releaseTriggerDynamic(id , status= 'disable') {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`price/dynamic/${id}/${status}`,"PUT",reject,resolve , '',true);
        });
    }

    static sendTrigger(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("priceDynamicScheduled","POST", data, resolve, reject, true);
        });
    }

    static insertDynamic(data)
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('price/dynamic','POST',data,resolve,'',true)
        });
    }

    static getTriggerById(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`priceDynamicScheduled/${id}/show`,"GET", null, resolve, reject, true);
        });
    }

    static updateTriggerPriceDynamicScheduled(id, data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`priceDynamicScheduled/${id}/update`,"PUT", data, resolve, reject, true);
        });
    }
}