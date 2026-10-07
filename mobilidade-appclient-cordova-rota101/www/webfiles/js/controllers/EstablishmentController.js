class EstablishmentController{
    getRoutePrice(establishmentId,callback){
        ConnectionServer.sendRequest('Establishment/RoutePrice','POST',{establishmentId},callback);
    }

    async getBalance(establishmentId) {

        const promise = await fetch(product+'EstablishmentBalance/Get', {
            body: JSON.stringify({stdObject : [{establishmentId}]}),
            url: product+'EstablishmentBalance/Get',
            method: 'POST'
            }) 
        
        const data = promise.json()

        return data

    }

    getCurrentTrips(establishmentId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Establishment/GetCurrentTrips','POST',{establishmentId},resolve);
        });
    }

    rechargeEstablishiment(rechargeObj) {
        return new Promise(resolve =>
            ConnectionServer.sendRequest('Establishment/Recharge', 'POST', {...rechargeObj}, resolve))
    }

    getEstablishimentTrips(establishment) {
        return new Promise(resolve =>
        ConnectionServer.sendRequest('Establishment/GetTrips','POST', {...establishment},resolve))
    }

    requestBalance(idUser,establishmentId,value,paymentForm){
        return new Promise(resolve =>
            ConnectionServer.sendRequest('Establishment/RequestBalance','POST', {idUser,establishmentId,value,paymentForm},resolve))
    }
}