class CancellationReasonsController{

  GetAll(){
      return new Promise((resolve,reject)=>{
          ConnectionServer.sendRequest('CancellationReasons/GetAllCustomer','POST',{},result=>{
              if(!result.status){
                  reject(result);
                  return;
              }
              resolve(result)
          });
      });
  }
}