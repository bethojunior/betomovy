class GoogleServiceController{
    static getDirection(origin,destination,key){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestCustomer('/GoogleService/Direction','POST',{origin,destination,key},resolve,reject)
        })
    }
}