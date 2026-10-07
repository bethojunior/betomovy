class EstateController {
    static getAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain("Estate/GetAll" , "POST",
                null,resolve,reject);
        })
    }
}