class WebMapKeyController
{
    static findAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("webMapKey","GET",null,resolve,reject,true);
        })
    }

    static delete(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`webMapKey/${id}`,"DELETE",null,resolve,reject,true);
        })
    }

    static save(key){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`webMapKey`,"POST", {key},resolve,reject,true);
        })
    }
}