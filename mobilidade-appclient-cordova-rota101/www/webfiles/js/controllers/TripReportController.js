class TripReportController {
    static insertByCustomer(data) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest("TripReport/InsertByCustomer","POST",data,resolve,reject,false);
        });
    }
}