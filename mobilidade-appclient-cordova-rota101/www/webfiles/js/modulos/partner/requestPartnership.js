viewController.setObserver("request-partnership",() => {

    verifyPartner();

    function verifyPartner(){
        PartnerController.findByUser().then(({status,data})=>{
            viewController.elementProperty.removeClass(".preload-data-partner","active");

            if(!status){
                viewController.elementProperty.addClass(".type-request-partnership","active");
                viewController.elementProperty.removeClass(".exist-partnership","active");
                return;
            }

            viewController.elementProperty.removeClass(".type-request-partnership","active");
            viewController.elementProperty.addClass(".exist-partnership","active");

            viewController.elementProperty.getElement("#nameEstablishment",element=>{
                element.innerHTML = data.nameEstablishment;
            });
            viewController.elementProperty.getElement("#partnerFunction",element=>{
                element.innerHTML = data.function;
            });
            viewController.elementProperty.getElement("#addressEstablishment",element=>{
                element.innerHTML = data.addressEstablishment;
            });
            viewController.elementProperty.getElement("#partnerRegister",element=>{
                element.innerHTML = data.partnerRegister;
            });
            viewController.elementProperty.getElement("#imgLocalPartner",element=>{
                element.src = `https://maps.googleapis.com/maps/api/staticmap?center=${data.latitude},${data.longitude}`+
                    `&zoom=18&size=600x300&maptype=roadmap&markers=color:orange%7Clabel:A%7C${data.latitude},${data.longitude}`+
                    `&key=${Session.get("googleApiKey")}`
            });
        })
    }


    viewController.elementProperty.addEventInElement("#btnRequestPartnership", "onclick", () => {
        const cityConfig = Session.get("cityConfig");

        const page = cordova.InAppBrowser.open(cityConfig.urlPartner, '_blank',
            'usewkwebview=no,beforeload=get,hidenavigationbuttons=yes,hideurlbar=yes,toolbarcolor=#FF9425,zoom=no,closebuttoncolor=#FFFFFF,location=no,disallowoverscroll=no,closebuttoncaption=Voltar');

        page.addEventListener('loadstart', (event) => {
            if (event.url.includes("?exit")) {
                verifyPartner();
                page.close();
            }
        });
        page.addEventListener('loadstop', () => {
            page.executeScript({
                code: `showInfoUser(${JSON.stringify(Session.get("user"))},'${Session.get("googleApiKey")}');`
            });
        });

        page.show();
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", () => {
        Route.backPage();
    })
});