class DocUserTypeController{
    static findByUserType(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`DocUserType/FindByUserType?userTypeId=${id}`,"GET",null,resolve,reject);
        })
    }

    static getDocuments(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Doc/FindAll`,"GET",null,resolve,reject);
        });
    }
}
