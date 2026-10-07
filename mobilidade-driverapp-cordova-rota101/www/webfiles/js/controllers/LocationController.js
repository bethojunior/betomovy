class LocationController{
    insert(object,callback){
        ConnectionServer.sendRequest('Location/Insert','POST',object,callback);
    }
}