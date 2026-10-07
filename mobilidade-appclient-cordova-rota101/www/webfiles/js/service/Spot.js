class Spot {

    static sendMapping(data){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Spot/InsertIndication' , 'POST' , {...data} , resolve);
        });
    }

    static finishMapping(container , method = "POST" , url){
        return new Promise(resolve => {
            ConnectionServer.sendRequest(url , method , {container} , resolve);
        });
    }

    static GetByEstablishment(establishmentId)
    {
        return new Promise((resolve) => {
            ConnectionServer.sendRequest("Spot/GetByEstablishment" , "POST" , {establishmentId} , resolve);
        });
    }
}