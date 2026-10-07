class PriceController  extends ConnectionServer{

    static save(data){
        return new Promise((resolve,reject) => {
            ConnectionServer.sendRequest("price","POST", data, resolve, reject, true);
        });
    }

    static disableTripType(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("price/"+id,"DELETE",'',resolve, reject, true);
        })
    }

    static getByCity(id){
        return new Promise(resolve => {
            ConnectionServer.sendRequest("price?cityId="+id,"GET",null, resolve, undefined, true);
        })
    }

    static getRange()
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('price/range','GET','',resolve,'',true)
        });
    }

    static insertRange(data)
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('price/range','POST',data,resolve,'',true)
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertCashBack(data)
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('cashback','POST',data,resolve,false,true);
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static getCashBack(data)
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('cashback?cityId='+ Session.getValueInSessionLocal("citySelected","cityId")+'&tripTypeId='+data.tripTypeId,'GET',data,resolve,false,true);
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deleteCash(id)
    {
        return new Promise(resolve => {
            this.sendRequest('cashback/'+id,'DELETE','',resolve,false,true);
        })

    }

    static getFees(cityId, tripTypeId){
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`tax?cityId=${cityId}&tripTypeId=${tripTypeId}`,"GET", null, resolve, undefined, true);
        });
    }

    static createFee(data){
        return new Promise((resolve) => {
            ConnectionServer.sendRequest('tax',"POST", data, resolve, undefined, true);
        });
    }

    static changeStatusFee(id, data){
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`tax/${id}/active`,"PUT", data, resolve, undefined, true);
        });
    }

    static updateFee(id, data){
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`tax/${id}`,"PUT", data, resolve, undefined, true);
        });
    }

    static deleteFee(id){
        return new Promise((resolve) => {
            ConnectionServer.sendRequest(`tax/${id}`,"DELETE", null, resolve, undefined, true);
        });
    }
}
