class StationTypeController{
    getAll(){
        return new Promise(resolve=>{
            ConnectionServer.sendRequest('StationType/Get','POST',{},resolve);
        })
    }
}