class LocationController{
    insertByUser(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Location/InsertByUser","POST",data,resolve,reject,false);
        });
    }
}