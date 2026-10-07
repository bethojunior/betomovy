class EstateController{
    getAll(){
        return new Promise(resolve=>{
            ConnectionServer.sendRequest('Estate/GetAll','POST',{},resolve);
        })
    }
}