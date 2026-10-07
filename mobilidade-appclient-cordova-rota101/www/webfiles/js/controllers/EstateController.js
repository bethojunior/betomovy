class EstateController {
    static getAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Estate/GetAll" , "POST",
                null,resolve,reject);
        })
    }
}