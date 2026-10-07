class DeliveryRateController {
    static list() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("deliveryRate", "GET", null, resolve, reject, true);
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliveryRate/${id}`, "DELETE", null, resolve, reject, true);
        });
    }

    static insert({range, tax, time, cityId, deliveryServiceFee, deliveryServiceFeeType}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("deliveryRate", "POST", {
                range,
                tax,
                time,
                cityId,
                deliveryServiceFee,
                deliveryServiceFeeType
            }, resolve, reject, true);
        })
    }
    static getToken(){
        return new Promise( (resolve) => {
           ConnectionServer.sendRequest("deliveryAcquirer/token","GET", null, resolve, undefined, true);
        });
    }
    static updateToken(value){
        return new Promise((resolve) => {
          ConnectionServer.sendRequest("deliveryAcquirer/token", "PUT", value, resolve,undefined,true);
        });
    }
    static getRate(cityId){
        return new Promise((resolve) =>{
            ConnectionServer.sendRequest(`payMachineReturn/${cityId}`, "GET", null, resolve, undefined, true);
        });
    }
    static typeRate(){
        return new Promise((resolve) =>{
            ConnectionServer.sendRequest(`payMachineReturn/types`, "GET", null, resolve, undefined, true);
        });
    }
    static updateRate(data){
        return new Promise((resolve) => {
           ConnectionServer.sendRequest(`payMachineReturn`, "POST", data, resolve, undefined, true);
        });
    }
}