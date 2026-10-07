class CustomerPlaceController {
    insert(place){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("CustomerPlace/Insert","POST",place,resolve,reject,false);
        });
    }

    getAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("CustomerPlace/getAll","GET",null,resolve,reject)
        });
    }

    delete(place){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("CustomerPlace/delete","POST",place,resolve,reject,false);
        });
    }
}