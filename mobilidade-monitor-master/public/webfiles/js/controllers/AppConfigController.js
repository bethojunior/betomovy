class AppConfigController{
    static create(form){
        return ConnectionServer.sendRequestWithFiles("appConfig","POST",form,true);
    }

    static list(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("appConfig","GET",null,resolve,reject,true);
        })
    }

    static delete(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`appConfig/${id}`,"DELETE",null,resolve,reject,true);
        })
    }

    static updateDefaultLogo(form){
        return ConnectionServer.sendRequestWithFiles("appConfig/defaultLogo","POST",form,true);
    }
}