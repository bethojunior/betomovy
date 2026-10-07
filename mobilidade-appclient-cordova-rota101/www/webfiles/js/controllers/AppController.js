class AppController {
    static checkVersion(app){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("App/CheckVersion","POST",{app},resolve,reject,false)
        });
    }

    static checkAdsMenuApp(typeId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`menuApp/findByType?type=${typeId}`, "GET","", resolve, reject, false);
        });
    }

    static insertCountAds(menuAppId, advertisingId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("adsCount/insert", "POST", {menuAppId, advertisingId}, resolve, reject, false);
        });
    }
}