class AppController {
    static checkVersion(app){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("App/CheckVersion","POST",{app},resolve,reject,undefined,false)
        });
    }

    static sharing(data){
       return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("AppSharing/Insert","POST",data,resolve,reject,undefined,false);
       });
    }

    static checkAdsMenuApp(typeId){
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest(`menuApp/findByType?type=${typeId}`, "GET","", resolve, reject, undefined,false);
        });
    }

    static insertCountAds(menuAppId,advertisingId){
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest("adsCount/insert", "POST", {menuAppId,advertisingId}, resolve, reject, undefined, false);
        });
    }
}