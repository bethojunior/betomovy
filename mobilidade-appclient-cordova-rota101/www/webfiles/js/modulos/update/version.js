Route.waitView().then(()=>{

    cordova.getAppVersion.getVersionNumber().then((version)=> {
        Session.set("version",version);

        AppController.checkVersion(appId).then(({status,data: {update, version: {link}}})=>{
            if(!status)
                return;

            if (update) {
                viewController.elementProperty.addClass(".container-modal-version", "active");

                viewController.elementProperty.addEventInElement("#updateClientApp","onclick",function(){
                    cordova.InAppBrowser.open(link, '_system');
                });
            }
        });
    });
});