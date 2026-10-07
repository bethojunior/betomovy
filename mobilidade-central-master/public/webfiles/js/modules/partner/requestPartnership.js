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
            viewController.elementProperty.getElement("#imgLocalPartner", element => {
                new MapService().getKey().then(({ response: token }) => {
                    const lat = data.latitude;
                    const lng = data.longitude;
                    element.src = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static`
                        + `/pin-s+FFA500(${lng},${lat})`
                        + `/${lng},${lat},16,0/600x300`
                        + `?access_token=${token}`;
                });
            });
        })
    }


    viewController.elementProperty.addEventInElement("#btnRequestPartnership", "onclick", () => {
        const page = cordova.InAppBrowser.open(`${HOST_SITE}partner/`, '_blank',
            'usewkwebview=no,beforeload=get,hidenavigationbuttons=yes,hideurlbar=yes,toolbarcolor=#FF9425,zoom=no,closebuttoncolor=#FFFFFF,location=no,disallowoverscroll=no,closebuttoncaption=Voltar');

        page.addEventListener('loadstart', (event) => {
            if (event.url.includes("?exit")) {
                verifyPartner();
                page.close();
            }
        });
        page.addEventListener('loadstop', () => {
            page.executeScript({
                code: `showInfoUser(${JSON.stringify(Session.get("user"))});`
            });
        });

        page.show();
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", () => {
        Route.backPage();
    })
});