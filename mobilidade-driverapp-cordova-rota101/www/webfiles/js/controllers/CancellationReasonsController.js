class CancellationReasonsController{

    GetAll(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('CancellationReasons/GetAll','POST',{},result=>{
                if(!result.status){
                    reject(result);
                    return;
                }
                resolve(result)
            });
        });
    }
}