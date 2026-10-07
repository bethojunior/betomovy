class AppSharingController {
    static insert(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("AppSharing/Insert","POST",data,resolve,reject,undefined,false);
        });
    }

}