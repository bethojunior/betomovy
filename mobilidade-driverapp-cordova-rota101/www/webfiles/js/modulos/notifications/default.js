Route.waitView().then(() => {

    pushEvent.addEvent("notifyApp", showNotificationDefault);

    viewController.elementProperty.addEventInElement("#closeNotifyApp", "onclick", () => {
        viewController.elementProperty.removeClass(".container-notification-default", "active");
    });

    setTimeout(() => {
        verifyPushCache("notifyApp", showNotificationDefault);
    }, 1000);

    function showNotificationDefault(data) {
        const { link, lat, lng } = data.additionalData.additionalData;
        viewController.elementProperty.addEventInElement(".button-track-race", 'onclick', function () {
            link === null
                ? window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,  "_system")
                : window.open(`${link}`,  "_system");
            viewController.elementProperty.removeClass(".container-notification-default", "active");
        });
        document.querySelector("#titleNotifyApp").innerHTML = data.title || "Notificação do App";
        document.querySelector("#descriptionNotifyApp").innerHTML = data.message;
        viewController.elementProperty.addClass(".container-notification-default", "active");
    }
});