class EstablishmentController{
    getRoutePrice(establishmentId,callback){
        ConnectionServer.sendRequest('Establishment/RoutePrice','POST',{establishmentId},callback);
    }


    static GetByCommissionValue(cityId){
        return new Promise (resolve => {
            ConnectionServer.sendRequest('Establishment/GetByCommissionValue' , 'POST' , {cityId} , resolve);
        });
    }
}