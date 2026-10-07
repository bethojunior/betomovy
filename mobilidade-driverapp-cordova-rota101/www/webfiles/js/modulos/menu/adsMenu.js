Route.waitView().then(() => {
    const adsMenuDriverTypeId = 1;

    function checkAdsMenuActive() {
        AppController.checkAdsMenuApp(adsMenuDriverTypeId).then(response => {
            const {message} = response;

            if (message.length === 0)
                return;

            document.querySelector("#adsMenu").innerHTML = `${message.description}`;
            document.querySelector("#adsMenu").style.display = "block";
            viewController.elementProperty.addEventInElement('#adsMenu', 'onclick', function () {
                preloadGlobal(true);
                AppController.insertCountAds(message.id).then(() => {
                    preloadGlobal(false);
                    window.open(`${message.link}`, "_system");
                });
            });
        });
    }

    checkAdsMenuActive();
});