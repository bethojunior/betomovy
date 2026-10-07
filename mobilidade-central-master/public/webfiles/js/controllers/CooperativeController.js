class CooperativeController{
    getByStation(stationId){
        return new Promise(resolve=>{
            ConnectionServer.sendRequest('Cooperative/GetByStation','POST',{stationId},resolve);
        })
    }
}