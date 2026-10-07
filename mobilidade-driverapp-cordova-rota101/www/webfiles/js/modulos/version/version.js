Route.waitView().then(()=>{

    const elementProperty = new ElementProperty();

    const appId = 2;

    cordova.getAppVersion.getVersionNumber().then((version)=> {
        Session.set("version",version);

        AppController.checkVersion(appId).then(({status,data: {update, version: {link}}})=>{
            if(!status)
                return;

            const appDemo = false;

            if (update && !appDemo) {
                elementProperty.addClass(".container-modal-version", "active");

                elementProperty.addEventInElement("#updateClientApp","onclick",function(){
                    //location.href = link;
                    const page = cordova.InAppBrowser.open(link, '_system',
                        'hidenavigationbuttons=yes,hideurlbar=yes,toolbarcolor=#FF9425,zoom=no,closebuttoncolor=#FFFFFF');

                    page.show();
                });
            }
        });
    });
});