document.addEventListener("DOMContentLoaded",() => {
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

    elementProperty.addEventInElement(".remove-drive-knob", "onclick", clearDataKnob);

});

function showInfoDriver(id) {
    DriverController.find(id).then(({status, data}) => {
        if (!status) {
            SwalCustom.messageDialog("", "Não foi possível encontrar o motorista", undefined);
            return;
        }

        Session.set("driverKnob", data);

        viewController.elementProperty.addClass(".footer-container-trip", "knob-trip");

        viewController.elementProperty.addClass(".container-knob-trip-driver", "active");

        viewController.elementProperty.getElement(".profile-driver-knob", element => {
            element.style.backgroundImage = `url(${PATH_PROFILE_DRIVER}${data.profileImage})`;
        });

        viewController.elementProperty.getElement(".name-driver-knob", element => {
            element.innerHTML = data.name;
        });

        viewController.elementProperty.getElement(".plate-driver-knob", element => {
            element.innerHTML = data.car.plate;
        });

        priceTrip.showPricesByTypeDriver(data.userTypeId);
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

    priceTrip.showPricesByTypeDriver();
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
            neighborhood: Session.getLocal("neighborhood-origin"),
            cityId: Session.get("city-origin")
        },
        destination: {
            address: document.getElementById("destination").value,
            latitude: trip.destination.lat,
            longitude: trip.destination.lng,
            neighborhood: Session.getLocal("neighborhood-destination"),
            cityId: Session.get("city-destination")
        },
        price: managerTrip.typeTaxi.price,
        priceId: managerTrip.typeTaxi.priceId,
        cityId: Session.get("cityIdTrip"),
        driverId: driverKnob.idDriver,
        waypoints
    };

    if(!validateTrip(tripKnob))
        return;

    preload(true);

    KnobTripController.init(tripKnob).then(({status,data,errors})=>{
        preload(false);
        if(!status) {
            SwalCustom.messageDialog("",errors.message,undefined,"info");
            return;
        }

        Session.setLocal("tripReference", data.tripReference);

        viewController.elementProperty.removeClass(".footer-container-trip", "active");
        updateBtnCallTripVisibility();
        viewController.elementProperty.getElement("#mapWrapper", element => {
            element.classList.remove("active");
        });
        scheduleMapResize();

        viewController.elementProperty.getElement(".footer-payment-form", element =>
            element.classList.remove("active"));

        activeMenu();

        verifyTrip();
    }).catch(()=>{
        preload(false);
    });
}