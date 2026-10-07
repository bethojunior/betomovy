$(document).ready(function(){
    ConfigController.general().then(({status,data})=>{
        if(!status)
            return;

        Session.set("configGeneral",data);

    //     const config = Session.get("configGeneral");
    //     const picturesLink = config.find(item => {
    //         return item.key === 'link_storage_pictures';
    //     });

    //     const imageName = 'driverLogo.png';
    //     const finalLink = picturesLink.value + imageName;

    //     viewController.elementProperty.getElement("#logo-driver").src = finalLink;
        
    });

    viewController.elementProperty.addEventInElement("#btnTermUs","onclick",function(){
        const config = Session.get("configGeneral");

        if (config.length === 0)
            return;

         const term = config.find(item => {
             return item.key === 'driver_terms_of_use';
         });


        const link =
        (!term.value.includes(".pdf")) ?
            HOST_SITE + 'privacidade' :
            encodeURI(HOST_SITE + 'privacidade');


    const page = cordova.InAppBrowser.open(link, '_blank',
        'usewkwebview=yes,beforeload=get,hidenavigationbuttons=no,hideurlbar=yes,toolbarcolor=#FFFFFF,zoom=no,closebuttoncolor=#000000,location=no,disallowoverscroll=no,closebuttoncaption=Voltar');

        // const page = cordova.InAppBrowser.open(term.value,"_system","location=yes,hidden=no,enableViewportScale=yes,toolbar=no,hardwareback=yes");

        page.show();
    });

    // Exibir versão do app
    displayAppVersion("main-version");
});
