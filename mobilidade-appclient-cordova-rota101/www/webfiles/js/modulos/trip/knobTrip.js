Route.waitView().then(() => {
    const qrCodeDriver = new QRCodeCapture('Código do Motorista',
        'Use este atalho para chamar o motorista presencialmente');

    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".btn-qrcode-driver-trip", "onclick", () => {
        qrCodeDriver.capture().then((value) => {
            const fragmentLink = value.split("/");
            const id = fragmentLink[fragmentLink.length - 1];

            showInfoDriver(id);
        });
    });

    elementProperty.addEventInElement(".remove-drive-knob", "onclick", () => {
        Route.backPage();
    });

});

function showInfoDriver(id) {
    preload(true);
    DriverController.find(id).then(({status, data}) => {
        if (!status) {
            SwalCustom.messageDialog("", "Não foi possível encontrar o motorista", undefined);
            return;
        }

        Route.startClassesInComponent(
            [
                {component: ".footer-container-trip", class: "knob-trip"},
                {component: ".container-knob-trip-driver", class: "active"}
            ],
            () => {
                priceTrip.typeDriverSelected = null;
                priceTrip.createLayoutPrices(priceTrip.listHistoryPrices);
                clearDataKnob();
            }, COMPONENT_CREATE_TRIP);

        Session.set("driverKnob", data);

        viewController.elementProperty.getElement(".profile-driver-knob", element => {
            const config = Session.get("configGeneral");
            const picturesLink = config.find(item => {
                return item.key === 'link_storage_pictures';
            });
                
            const finalLink = `${picturesLink.value}driver/profile/compressed/`;

            // element.style.backgroundImage = `url(${PATH_PROFILE_DRIVER}${data.profileImage})`;
            element.style.backgroundImage = `url(${finalLink}${data.profileImage})`;
        });

        viewController.elementProperty.getElement(".name-driver-knob", element => {
            element.innerHTML = data.name;
        });

        viewController.elementProperty.getElement(".plate-driver-knob", element => {
            element.innerHTML = data.car.plate;
        });

        priceTrip.showPricesByTypeDriver(data.userTypeId).then(() => {
            checkOptionDefaultActive(priceTrip.listHistoryPrices);

            viewController.elementProperty.addEventInElement(
                ".trip-type",
                "onclick",
                getTaxiType
            );
        });
    }).finally(() => {
        preload(false);
    })
}

function clearDataKnob() {
    viewController.elementProperty.removeClass(".footer-container-trip", "knob-trip");

    viewController.elementProperty.removeClass(".container-knob-trip-driver", "active");

    viewController.elementProperty.getElement(".profile-driver-knob", element => {
        element.style.backgroundImage = ``;
    });

    viewController.elementProperty.getElement(".name-driver-knob", element => {
        element.innerHTML = '';
    });

    viewController.elementProperty.getElement(".plate-driver-knob", element => {
        element.innerHTML = '';
    });

    Session.delete("driverKnob");
}

function initTripKnob() {
    const driverKnob = Session.get("driverKnob");

    const waypoints = Object.keys(trip.waypoints).map(item => {
        const waypoint = trip.waypoints[item];

        waypoint.latitude = waypoint.lat;
        waypoint.longitude = waypoint.lng;

        return waypoint;
    });

    const tripKnob = {
        userId: parseInt(userLogged.idUser),
        tripTypeId: managerTrip.typeTaxi.tripTypeId,
        tripPaymentFormId: managerTrip.paymentFormIdSelected,
        origin: {
            address: document.getElementById("origin").value,
            latitude: trip.origin.lat,
            longitude: trip.origin.lng,
            neighborhood: convertArrayToNull(Session.get("neighborhood-origin")),
            cityId: convertArrayToNull(Session.get("city-origin"))
        },
        destination: {
            address: document.getElementById("destination").value,
            latitude: trip.destination.lat,
            longitude: trip.destination.lng,
            neighborhood: convertArrayToNull(Session.get("neighborhood-destination")),
            cityId: convertArrayToNull(Session.get("city-destination"))
        },
        distance: Session.get("distanceTrip"),
        estimatedTripTime: Session.get("estimatedTripTime"),
        price: managerTrip.typeTaxi.price,
        priceId: managerTrip.typeTaxi.priceId,
        multiplierDynamic: managerTrip.typeTaxi.multiplierPriceDynamic,
        cityId: Session.get("cityIdTrip"),
        driverId: driverKnob.idDriver,
        waypoints
    };

    if (!validateTrip(tripKnob)){
        preload(false);
        return;
    }

    preload(true);

    KnobTripController.init(tripKnob).then(({status, data, errors}) => {
        preload(false);
        if (!status) {
            SwalCustom.messageDialog("", errors.message, undefined, "info");
            return;
        }

        Session.set("tripReference", data.tripReference);

        viewController.elementProperty.removeClass(".footer-container-trip", "active", "knob-trip");
        viewController.elementProperty.removeClass(".container-knob-trip-driver", "active");
        /*viewController.elementProperty.getElement(".map-client", element => {
            element.classList.remove("active");
        });*/
        mapService.map.setPadding(50, 20, 20, 20);

        viewController.elementProperty.getElement(".footer-payment-form", element =>
            element.classList.remove("active"));

        Route.removeGroupComponent(COMPONENT_CREATE_TRIP);

        mapService.removeDetailMap();

        activeMenu();

        verifyTrip();
    }).catch(() => {
        preload(false);
    });
}

function convertArrayToNull(value) {
    return Array.isArray(value) ? null : value;
}