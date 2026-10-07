class ZoneController{
    static getAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Zone/GetAll','POST',{},resolve,reject);
        })
    }
}