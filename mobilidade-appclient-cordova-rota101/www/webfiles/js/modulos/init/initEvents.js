document.addEventListener("deviceready", function () {
    //cordova.plugins.backgroundMode.enable();

    const elementProperty = new ElementProperty();
    const supportController = new SupportController();
    elementProperty.getElement("#containerViews",element=>{
        element.scrollTo(0, 0);
    });

    elementProperty.addEventInElement("#containerViews", "onscroll", () => {
        document.querySelector("#containerViews").scrollTo(0, 0);
    })

    document.addEventListener('resume', function (evt) {
        window.plugin.backgroundMode.disable();
    });

    if (device.platform === "iOS") {
        Keyboard.hideFormAccessoryBar(false);
        Keyboard.disableScroll(false);
    }


    if (window.MobileAccessibility) {
        window.MobileAccessibility.usePreferredTextZoom(false);
    }

    getPermission();

    Position.getPositionNetwork().then(result => {
        if (!Array.isArray(Session.get("location")))
            return;
        if (result.loc === undefined)
            return;

        const location = result.loc.split(",");

        Session.set("location", {lat: parseFloat(location[0]), lng: parseFloat(location[1])});
    });

    if (!Array.isArray(Session.get("user"))) {
        supportController.getConfig("mp_public_key").then(({status, data}) => {
            if (!status)
                return;

            Session.set("KEY_MERCADOPAGO", data);
        });
    }

    function openAppForeground() {
    }

    if (device.platform != "iOS") {
        (function verifyGps() {
            setTimeout(function () {
                gpsDetect.checkGPS((isEnabled) => {
                    verifyGps();

                    if (!isEnabled) {
                        viewController.elementProperty.addClass(".container-gps-disabled", "active");
                        return;
                    }
                    viewController.elementProperty.removeClass(".container-gps-disabled", "active");
                }, verifyGps)
            }, 5000);
        })();
    }

    function getPermission() {
        // RequestPermission.requestAudio();
    }
});

function showOptionsReturn() {
    Route.startClassesInComponent([
        {component: "#modalInfoReturn", class: "active"}], () => {
        viewController.elementProperty.removeClass("#modalInfoReturn", "active")
    }, COMPONENT_CREATE_TRIP);
}

function closeOptionsReturn() {
    new ElementProperty().getElement("#modalInfoReturn", element => {
        element.classList.remove("active");
    });
}
