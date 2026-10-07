viewController.setObserver("trip-in-wait", (tripReference) => {

    const elementProperty = new ElementProperty();


    showInfoTrip(Session.get("preAvailableTripData"));

    function showInfoTrip(trip) {
        elementProperty.getElement(".name-customer-trip-wait", element => {
            element.innerHTML = trip.customer.name;
        });
        elementProperty.getElement(".origin-trip-wait", element => {
            element.innerHTML = `Origem: ${trip.origin.address}`;
        });
        elementProperty.getElement(".destination-trip-wait", element => {
            element.innerHTML = `Destino: ${trip.destination.name}`;
        });

        const showPriceField = isToShowField("price");
        if (showPriceField) {
        elementProperty.getElement(".payment-trip-wait", element => {
            element.innerHTML = ` ${trip.tripPaymentForm} -  ${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(trip.price))}`;
        });
        } else {
            elementProperty.getElement(".payment-trip-wait", element => {
                element.innerHTML = ` ${trip.tripPaymentForm}`;
            });
        }

        elementProperty.getElement("#photoClient", element => {
            const config = Session.get("configGeneral");
            const picturesLink = config.find(item => {
                return item.key === 'link_storage_pictures';
            });

            element.style.backgroundImage = `url(${picturesLink.value + trip.customer.profileImage})`;
        });
    }

    elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    elementProperty.addEventInElement(".back-page", "onclick", comeBackIndex);

    viewController.onBack(function () {


    });

    function comeBackIndex() {
        Route.backPage()
    }


    elementProperty.addEventInElement("#cancelTripWait", "onclick", function () {
        viewController.addParams("cancel-another-trip", tripReference);
        Route.redirectDynamic("Driver", "CancelAnotherTrip");
    });

    elementProperty.addEventInElement("#chatTripWait", "onclick", function () {
        viewController.elementProperty.removeClass(".notification-chat", "notification-chat");

        viewController.addParams("chat-trip", Session.get("preAvailableTripData"));

        elementProperty.removeClass(".container-notification-chat", "active");

        Route.redirectDynamic("Driver", "Chat");
        clearNotification();
    });

    function isToShowField(field){
        const cityConfig = Session.get("cityConfig");
        return cityConfig.enabledDriverFields.accept[field];
    }

});
