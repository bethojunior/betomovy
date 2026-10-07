Route.waitView().then(function () {

    if (cordova.InAppBrowser) {
        window.open = cordova.InAppBrowser.open;
    }

    document.addEventListener('resume', function (evt) {
        window.plugin.backgroundMode.disable();
    });

    if (Array.isArray(Session.get("appSetting")))
        Session.set("appSetting", {
            modeAcceptTrip: {
                enableClick: true,
                enableTouch: true
            }
        });

    /*pushEvent.addEvent("showPosition", function () {
        BackgroundGeolocation.getCurrentLocation(
            (position) => {
                const {latitude: lat, longitude: lng} = position;
                executeCallback(() => getNewPositionDriver({lat, lng}));
            },
            err => {
                console.log(err);
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
            });
    });*/

    pushEvent.addEvent("message",data=>{
        cordova.plugins.notification.local.schedule({
            title: data.title,
            text: data.message,
            foreground: true
        });
    });

    pushEvent.addEvent("openApp", function (data) {
        openAppForeground();
        console.log(data);
    });

    pushEvent.addEvent("pendencelink", function (data) {
        window.open(data.additionalData.url, "_system");
    });

    pushEvent.addEvent("updateStatusDocuments", function (data) {
        const trip = Session.get("tripDriver");
        if(trip.length == 0) {
            SwalCustom.messageDialog("", data.title, undefined, "info");
            updateTripDriver();
        }
    });

    pushEvent.addEvent("changeStatusDriver", function (data) {

        viewController.elementProperty.getElement("#descriptionBlocked", element => {
            element.innerHTML = data.title;
        });

        viewController.elementProperty.getElement("#reasonsBlocked", element => {
            element.innerHTML = `<li>${data.message}</li>`;
        });

        viewController.elementProperty.addClass(".container-modal-blocked", "active", "enabled");

        viewController.elementProperty.addEventInElement("#closeModalBlocked", "onclick", function () {
            viewController.elementProperty.removeClass(".container-modal-blocked",
                "active", "enabled");
        });
        updateTripDriver();
    });

    pushEvent.addEvent("updateDriverInfo", function (data) {
        SwalCustom.messageDialog("", data.title, undefined, "info");

        updateTripDriver();
    });

    pushEvent.addEvent("cancelTrip", function (data) {
        SwalCustom.messageDialog(data.message, "Atenção", clearDataTrip);
    });

    pushEvent.addEvent("newNotificationApp", (data) => {
        if (data.additionalData.coldstart === false && data.additionalData.foreground === false) {
            setTimeout(() => {
                showDetailNotificationByPush(data);
            }, 1000)
        } else {
            updateNotificationsApp();
        }

    });

    supportGetConfig("mp_public_key").then(({status, data}) => {
        if (!status)
            return;

        Session.set("KEY_MERCADOPAGO", data);
    });

    function supportGetConfig(configKey){
        return new Promise((resolve, reject) => {
            ConnectionServer.
            sendRequest("Support/GetConfig","POST",{configKey},resolve,reject,undefined,false);
        });
    }

    // Exibir versão do app no splash
    displayAppVersion("splash-version");
});
