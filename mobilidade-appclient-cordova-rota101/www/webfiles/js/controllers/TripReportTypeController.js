class TripReportTypeController{
    static actionGetAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("TripReportType/GetAll","GET",null,resolve,reject);
        });
    }
}