function getConfigCityByPosition(position) {
    CityController.getConfigByPosition(position).then(({status, data}) => {
        if (!status)
            return;

        Session.set("cityConfig", data);

        verifyConfigApp();

        verifyNetworkSocial();

        if (typeof verifyConnectionNetwork === "function")
            verifyConnectionNetwork();
    });
}


function verifyConfigApp() {
    const cityConfig = Session.get("cityConfig");

    if (cityConfig.urlPartner != null)
        viewController.elementProperty.addClass(".option-partner", "active");


    if (cityConfig.enableTripSharing == true) {
        viewController.elementProperty.addClass(".share-trip-customer", "active");
        viewController.elementProperty.getElement("#shareTripCustomerV2", element=> element.style = "");
    }

    if (cityConfig.enableKnobTrip == true) {
        viewController.elementProperty.removeClass(".btn-qrcode-driver-trip", "hidden");
    } else {
        viewController.elementProperty.addClass(".btn-qrcode-driver-trip", "hidden");
    }

    if (cityConfig.enableTripScheduled == false) {
        if (document.querySelector("#btnScheduleTrip"))
            document.querySelector("#btnScheduleTrip").style.display = "none";
    } else {
        if (document.querySelector("#btnScheduleTrip"))
            document.querySelector("#btnScheduleTrip").style = "";
    }

    if (typeof verifyScheduledTrip === "function")
        verifyScheduledTrip();
}

function verifyNetworkSocial() {
    const config = Session.get("cityConfig");

    if (config.urlFacebook != null)
        viewController.elementProperty.addClass("#openFacebookApp", "active");
    if (config.urlInstagram != null)
        viewController.elementProperty.addClass("#openInstagramApp", "active");
}
