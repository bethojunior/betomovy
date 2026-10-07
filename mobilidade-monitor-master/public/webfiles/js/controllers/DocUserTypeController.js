class DocUserTypeController{
    static findByUserType(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain(`DocUserType/FindByUserType?userTypeId=${id}`,"GET",null,resolve,reject);
        })
    }
}