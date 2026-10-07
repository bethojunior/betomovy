function prepareScreenToFreight({status, data, message}) {
    viewController.elementProperty.removeClass(
        ".container-connection-internet",
        "active"
    );
    Session.set("dateInitTrip", DateCustom.getNow());
    sortTimePhrase();

    preload(false);
    if (!status)
        return SwalCustom.messageDialog("", message, undefined, "warning");

    mapService.removeRoute();

    Route.removeGroupComponent(COMPONENT_CREATE_TRIP);

    if (data.status === STATUS_SCHEDULED) {
        initProcessingCallTrip(false);
        return showScheduleTrip(data.tripReference);
    }

    Session.set("tripReference", data.tripReference);

    initSearchFreight(data);
}


function initSearchFreight(data) {
    globalFreight.mapService.map.setPadding(50, 20, 20, 20);
  //  animationPlacesMap(true, data);
    managerTripViewCurrent.isVisible = true;

    if (globalFreight.mapService.polylineRoute != null) {
        globalFreight.mapService.polylineRoute.remove();
        globalFreight.mapService.polylineRoute = null;
    }

    viewController.elementProperty.getElement(".container-km-trip", element => {
        element.innerHTML = "";
    });

    viewController.elementProperty.removeClass(
        ".footer-container-trip",
        "active"
    );

    viewController.elementProperty.getElement(".footer-payment-form", element =>
        element.classList.remove("active")
    );

    activeMenu();

    globalFreight.mapService.searchDriver(data);

    viewController.elementProperty.addClass(".search-driver-in-trip", "active");

    viewController.elementProperty.getElement(".car-return", element => {
        element.src = `${HOST}webfiles/img/logo/return-${data.tripTypeId}-d.png`;
    });

    if (Session.get("dateInitTrip").length === 0)
        Session.set("dateInitTrip", DateCustom.getNow());

    if (Session.get("timePhrase").length === 0) sortTimePhrase();

    initEventSearchFreight();

    observerRealtimeFreight();
}

function initEventSearchFreight() {
    viewController.elementProperty.addEventInElement(
        ".cancel-search-trip",
        "onclick",
        function () {
            viewController.elementProperty.getElement(
                "#messageCancelTrip",
                element => {
                    element.innerHTML =  getTextTranslate("home","message-cancel-trip");
                }
            );
            cancelSearchFreight(STATUS_BACK_OFF);
        }
    );
}



function cancelSearchFreight(status = STATUS_CANCELED) {

    viewController.elementProperty.addClass(".container-cancel-request-trip", "active");

    viewController.elementProperty.addEventInElement("#btnCancelModalTripRequest", "onclick", function () {
        viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
    });

    viewController.elementProperty.addEventInElement("#btnCancelTripRequest", "onclick", function () {
        viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
        preload(true);
        cancelFreightByCustomer(status)

    });
}

function cancelFreightByCustomer(status){
    const userLogged = Session.get("user");

    const customerController = new CustomerController();
    customerController.actionCancel(Session.get("tripReference"),
        userLogged.idUser, DateCustom.getNow(), status)
        .then(function ({status, data}) {
            preload(false);
            if (!status) {
                SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
                return;
            }
            stopProgressFreight();
        }).catch(() => {
        preload(false);
        SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
    });
}

function stopProgressFreight() {
    viewController.elementProperty.getElement(
        ".preloader-search-trip",
        element => {
            element.classList.remove("active");
        }
    );

    viewController.elementProperty.removeClass(
        ".search-driver-in-trip",
        "active"
    );

    if (globalFreight.mapService.pointCustomer != null)
        globalFreight.mapService.pointCustomer.setMap(mapService.map);

    if (globalFreight.mapService.map != null)
        globalFreight.mapService.map.setOptions({styles: globalFreight.mapService.getStyleMapDefault()});

    if (globalFreight.mapService.infoSearch !== null) globalFreight.mapService.infoSearch.setMap(null);
}

function observerRealtimeFreight() {
    tripCurrentRepository.close();

    tripCurrentRepository.getTrip(
        Session.get("tripReference"),
        checkStatusFreightRealtime
    );
}

function checkStatusFreightRealtime(trip, type) {
    prepareScreenTrip();

    if (trip.status !== STATUS_PRE_ACCEPTED)
        globalFreight.mapService.clearWaypointInfoPreAccepted();

    if (type === tripCurrentRepository.typeRemoved) {
        TripController.get(trip.tripReference)
            .then(({status, data: response}) => {
                if (response.status === STATUS_FINISHED) {
                    initProcessingCallTrip();
                    finishTrip(response);
                    Session.delete("tripReference");
                    Session.delete("positionDriverTrip");
                    return;
                }

                if (
                    response.status === STATUS_CANCELED ||
                    response.status === STATUS_NOT_ANSWERED ||
                    response.status === STATUS_BACK_OFF ||
                    response.status === STATUS_PAYMENT_REFUSED
                ) {
                    stopProgressTrip();
                    clearDataCar();
                    initProcessingCallTrip();

                    if (response.canceledBy === "admin") {
                        if(response.callAgain == true){
                            initNewTripAfterCancel(trip);
                            return;
                        }
                    }

                    if (response.canceledBy === "driver") {
                        if (response.customerCancellationFee != null) {
                            SwalCustom.messageDialog(
                                response.customerCancellationFee.description,
                                response.customerCancellationFee.title,
                                undefined,
                                "warning"
                            );
                        } else {
                            initNewTripAfterCancel(response);
                            return;
                        }
                    }

                    clearTimeout(managerTrip.timeOut);
                    managerTrip.timeOut = null;
                    Session.delete("tripReference");
                    Session.delete("positionDriverTrip");

                    if (response.status === STATUS_NOT_ANSWERED) customerOnTripExpired();
                }

                initProcessingCallTrip();
            })
            .catch(e => console.log(e));
        return;
    }

    if (
        trip.status === STATUS_SEARCHING ||
        trip.status === STATUS_SEARCHING_FAVORITE
    ) {
        if (!managerTrip.isSearch) initSearchFreight(trip);
        return;
    }

    if (trip.status === STATUS_ACCEPTED || trip.status === STATUS_PRE_ACCEPTED) {
        initRace(trip);
        return;
    }

    if (trip.status === STATUS_BOARDING || trip.status === STATUS_IN_PROGRESS) {
        initRace(trip);
    }
}
