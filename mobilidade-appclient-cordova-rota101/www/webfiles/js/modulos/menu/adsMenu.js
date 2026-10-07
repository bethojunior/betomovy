Route.waitView().then(() => {
    const adsMenuCustomerTypeId = 2;

    function checkAdsMenuActive() {
        AppController.checkAdsMenuApp(adsMenuCustomerTypeId).then(response => {
            const {message} = response;

            if (message.length === 0)
                return;

            document.querySelector(".ads-menu-link").innerHTML = `${message.description}`;
            document.querySelector("#adsMenu").style.display = "block";
            viewController.elementProperty.addEventInElement('#adsMenu', 'onclick', function () {
                preload(true);
                AppController.insertCountAds(message.id, null).then(() => {
                    preload(false);
                    cordova.InAppBrowser.open(`${message.link}`, '_system', 'location=yes')
                });
            });
        });
    }

    checkAdsMenuActive();
});