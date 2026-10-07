class StationTypeController{
    getAll(){
        return new Promise(resolve=>{
            ConnectionServer.sendRequestMain('StationType/Get','POST',{},resolve);
        })
    }
}