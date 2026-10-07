class DashboardController{ 
    static currentQuantities(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('monitor/currentQuantities','GET',null,resolve);
        });
    }
    static getQuantitiesTrip(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('monitor/trip/quantities','GET',null,resolve);
        });
    }
    static getAllActivesTrip(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('monitor/activeTrips','GET',null,resolve);
        });
    }
    static getAllActivesTrip(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('trip/ranking','GET',null,resolve);
        });
    }  
}