class RiskAreaController{
    static findAll(page = 1){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("riskArea?page="+page,"GET",null,resolve,reject,true);
        })
    }

    static confirm(id,radius){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`riskArea/${id}`,"PUT",{radius},resolve,reject,true);
        })
    }

    static rejectArea(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`riskArea/${id}`,"DELETE",null, resolve,reject,true);
        })
    }
}