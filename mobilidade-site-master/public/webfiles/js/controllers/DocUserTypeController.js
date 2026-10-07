class DocUserTypeController{
    static findByUserType(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`DocUserType/FindByUserType?userTypeId=${id}`,"GET",null,resolve,reject);
        })
    }
}