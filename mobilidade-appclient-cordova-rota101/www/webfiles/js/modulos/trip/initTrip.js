function initTrip(trip) {
    return new Promise((resolve, reject) => {
        if (!validateTrip(trip)) {
            preload(false);
            return;
        }

        new CustomerController()
            .actionNew({...trip})
            .then(resolve)
            .catch(function (message, error) {
                reject(error, message);
            });
    });
}

/**
 *
 * @param trip
 * @returns {boolean}
 */
function validateTrip(trip) {
    if (parseInt(trip.tripPaymentFormId) === PAYMENT_CARD_CREDIT) {
        if (Array.isArray(Session.get("cardSelected"))) {
            /*SwalCustom.messageDialog(
                "Informe o cartão",
                "Atenção",
                undefined,
                "warning"
            );*/
            choiceCard();
            return false;
        }
    }
    if (trip.userId === null) {
        SwalCustom.messageDialog(
            "Error ao tentar confirmar corrida",
            "Atenção",
            undefined,
            "warning"
        );
        return false;
    }
    if (trip.tripPaymentFormId === null) {
        SwalCustom.messageDialog(
            "Informe a forma de pagamento",
            "Atenção",
            undefined,
            "warning"
        );
        return false;
    }
    if (trip.tripTypeId === null) {
        SwalCustom.messageDialog(
            "Informe o tipo da corrida",
            "Atenção",
            undefined,
            "warning"
        );
        return false;
    }

    return true;
}

function authorizedTravelUser() {
    const userLogged = Session.get("user");
    if (userLogged.customerRegisterStatusId === STATUS_BLOCKED) {
        SwalCustom.messageDialog(
            "",
            "Atenção, você não tem autorização para solicitar viagem",
            undefined,
            "warning"
        );
        return false;
    }

    return true;
}

function toggleCallOrCancel(event) {
    event.stopPropagation();
    if (!authorizedTravelUser()) return;

    getBalanceClient();

    initCloseTrip();

    viewController.elementProperty.getElement("#destination", element => {
        setTimeout(function () {
            viewController.elementProperty.getElement(".menu-close", menu => {
                if (menu.classList.contains("open")) {
                    element.focus();
                }
            });
        }, 1000);
    });

    viewController.elementProperty.getElement("#callRunning", element => {
        if (element.classList.contains("active")) return;

        managerUpdateTrip.searchingCars.map(item => {
            mapService.removeMakerMap(item);
        });

        Route.startClassesInComponent(
            [
                {component: ".btn-call-trip", class: "active"},
                {component: "#callRunning", class: "active"},
                {component: ".container-publicity-app", class: "hidden"},
                {component: ".floating-icon-coupon", class: "active"}
            ],
            () => {
                initProcessingCallTrip();
                verifyListTripActivePartner();
                managerTripViewCurrent.isVisible = true;

                viewController.elementProperty.getElement(".pac-container", element => {
                    element.style.display = "none";
                });

                viewController.elementProperty.getElement(".input-custom", element => {
                    element.disabled = true;
                });
            },
            COMPONENT_CREATE_TRIP
        );

        viewController.elementProperty.getElement(".input-custom", element => {
            element.disabled = false;
        });

        viewController.elementProperty.removeClass(
            ".list-trips-active-partner",
            "active"
        );

        localCurrent();
    });
}

function initNewTrip(travelAgain = null, checkDriverFavorite = true) {
    const waypoints = getWaypointTrip();

    let tripDiscountCoupon = null;

    let price = managerTrip.typeTaxi.price;

    if (managerCouponTrip.couponSelected != null) {
        tripDiscountCoupon = {
            oldPrice: price,
            userDiscountCouponId: managerCouponTrip.couponSelected.id
        };

        price = calculateDiscount(price);
    }

    const tolls = Session.get("tolls").map((toll) => {
        return toll.id;
    });

    const newTrip = travelAgain || {
        userId: parseInt(userLogged.idUser),
        tripTypeId: managerTrip.typeTaxi.tripTypeId,
        tripPaymentFormId: managerTrip.paymentFormIdSelected,
        origin: {
            address: document.getElementById("origin").value,
            latitude: trip.origin.lat,
            longitude: trip.origin.lng,
            type: trip.origin.type || null,
            neighborhood: convertArrayToNull(Session.get("neighborhood-origin"))
        },
        destination: {
            address: document.getElementById("destination").value,
            latitude: trip.destination.lat,
            longitude: trip.destination.lng,
            type: trip.destination.type || null,
            neighborhood: convertArrayToNull(Session.get("neighborhood-destination"))
        },
        distance: Session.get("distanceTrip"),
        estimatedTripTime: Session.get("estimatedTripTime"),
        priceId: managerTrip.typeTaxi.priceId,
        price,
        schedule: getScheduled(),
        scheduleISO: getScheduledISO(),
        waypoints,
        multiplierDynamic: managerTrip.typeTaxi.multiplierPriceDynamic,
        tripDiscountCoupon,
        isFavorite: checkDriverFavorite,
        tolls,
    };

    if (managerTrip.typeTaxi.cashback != null)
        newTrip.cashback = managerTrip.typeTaxi.cashback;

    if (managerTrip.recalculatedTrip != null)
        newTrip.recalculatedTrip = managerTrip.recalculatedTrip;

    Session.set("managerTrip", managerTrip);

    if (!validateTrip(newTrip)) {
        preload(false)
        return;
    }

    Session.set("lastTrip", newTrip);

    if (newTrip.deliveryInfo == null)
        if (managerTrip.typeTaxi != null)
            if (managerTrip.typeTaxi.tripType != null)
                if (managerTrip.typeTaxi.tripType.deliveryOption == true){
                    preload(false)
                    return showItemDelivery(newTrip);
                }

    if (managerTrip.typeTaxi != null)
        if (managerTrip.typeTaxi.tripType != null)
            if (managerTrip.typeTaxi.tripType.offerOption == true  || ConfigGeneral().get("travel_only_by_offer") == true)
                return showPriceOfferModal(newTrip);

    verifyPaymentFormTrip(newTrip);
}

function verifyPaymentFormTrip(newTrip) {
    if (parseInt(Session.get("paymentForm").paymentFormTypeId) === PAYMENT_CARD_CREDIT ||
        parseInt(Session.get("paymentForm").paymentFormTypeId) === PAYMENT_CARD_DEBIT) {
        getCardSelectedPayTrip(Session.get("cardSelected"), true)
            .then(() => {
                newTrip["mpToken"] = Session.getValueInSession("tokenCard", "token");
                newTrip["cardId"] = Session.getValueInSession("tokenCard", "cardId");

                verifyTripWasDriverFavorite(newTrip, newTrip.isFavorite);
            })
            .catch(message => {
                SwalCustom.messageDialog("", message, undefined, "warning");
                preload(false);
            });
    } else {
        verifyTripWasDriverFavorite(newTrip, newTrip.isFavorite);
    }
}

function verifyTripWasDriverFavorite(newTrip, checkDriverFavorite) {

    if (ConfigGeneral().get("enable_favorite_customer_and_driver") == true) {
        if (checkDriverFavorite && newTrip.schedule == null) {
            checkFavoritesDriver(newTrip);
            return;
        }
    }

    newTrip.favorites = null;

    checkTypeCustomerByTrip(newTrip);
    
}

function getWaypointTrip() {
    return Object.keys(trip.waypoints).map(item => {
        const waypoint = trip.waypoints[item];

        waypoint.latitude = waypoint.lat;
        waypoint.longitude = waypoint.lng;

        return waypoint;
    });
}

function describeReasonForTrip(trip, callback) {
    document.querySelector("#countLengthObs").innerHTML = `0/150`;
    document.querySelector("#textAreaObs").value = "";
    document.querySelector("#titleObs").innerHTML = "Descreva o motivo da viagem";

    Route.startClassesInComponent([{component: ".container-obs-delivery-info", class: "active"}], () => {
        viewController.elementProperty.removeClass(".container-obs-delivery-info", "active");
    });

    viewController.elementProperty.addEventInElement("#textAreaObs", "oninput", function () {
        if (this.value.length > 150)
            return false;
        document.querySelector("#countLengthObs").innerHTML = `${document.querySelector("#textAreaObs").value.length}/150`;
    });

    viewController.elementProperty.addEventInElement("#btnSaveObs", "onclick", () => {
        if (document.querySelector("#textAreaObs").value.trim().length === 0)
            return SwalCustom.messageDialog("", "Informe a descrição da viagem");

        trip.description = document.querySelector("#textAreaObs").value;

        Route.backPage();

        if (callback)
            callback(trip);
    });

    setTimeout(() => {
        document.querySelector("#textAreaObs").focus();
    }, 500);
}

function checkTypeCustomerByTrip(newTrip) {
    if (trip.typeCustomerInTrip === "forMe") {
        const cityConfig = Session.get("cityConfig");

        function nextOptionCreateTrip(newTrip) {
            if (cityConfig.enableDepartureAddressConfirmation == true) {
                preload(false)
                openLocalConfirmationOption(newTrip);
            } else {
                newTripCustomer(newTrip);
            }
        }

        if (cityConfig.addTripNote == true) {
            preload(false)
            return describeReasonForTrip(newTrip, nextOptionCreateTrip);
        }

        nextOptionCreateTrip(newTrip);
    }

    if (trip.typeCustomerInTrip === "forAnother") {
        newTrip.tripCustomer = {
            name: document.getElementById("nameAnotherCustomer").value,
            phone: document.getElementById("phoneAnotherCustomer").value
        };

        newAnotherTripCustomer(newTrip);
    }
}

function newTripCustomer(newTrip) {
    preload(true);

    initTrip(newTrip)
        .then(prepareScreenToTrip)
        .catch(error => {
            viewController.elementProperty.addClass(
                ".container-connection-internet",
                "active"
            );
            setTimeout(function () {
                initNewTrip(newTrip);
            }, 5000);
        })
        .finally(() => {
            saveOrderPrices(newTrip);
            saveAddressInCache(newTrip.destination)
        });
}

function openLocalConfirmationOption(newTrip) {
    if (!document.querySelector(".footer-container-trip").classList.contains("active"))
        return newTripCustomer(newTrip);


    viewController.elementProperty.removeClass(
        ".footer-container-trip",
        "active"
    );

    const position = {lat: newTrip.origin.latitude, lng: newTrip.origin.longitude};

    markerLocalConfirmationOption = mapService.makeMarker(position, mapService.map, {
        url: "webfiles/img/icon/pin-origin.png",
        size: {
            width: 40,
            height: 40
        },
        anchor: [20, 50]
    }, 2);

    markerPointOrigin = mapService.makeMarker(position, mapService.map, {
        url: "webfiles/img/icon/rec.png",
        size: {
            width: 20,
            height: 20
        }
    });

    mapService.map.animateCamera({
        target: position,
        duration: 300,
        zoom: 19
    });

    mapService.map.setPadding(70, 20, 250, 20);

    document.querySelector("#addressOriginLabelConfirmation").innerHTML = newTrip.origin.address;

    changeVisibilityPoints(false);

    viewController.elementProperty.addEventInElement("#btnLocalConfirmationOption", "onclick", function () {
        returnConfirmationLocal();
        newTripCustomer(newTrip);
    });

    viewController.elementProperty.addEventInElement("#btnSearchLocalConfirmationOrigin", "onclick", function () {
        returnConfirmationLocal();
        editLocalOriginSelected();
    });

    Route.startClassesInComponent([
        {
            component: ".container-local-confirmation-option",
            class: "active"
        }
    ], () => {
        returnConfirmationLocal();
    }, COMPONENT_CREATE_TRIP);


    function returnConfirmationLocal() {
        viewController.elementProperty.addClass(
            ".footer-container-trip",
            "active"
        );
        viewController.elementProperty.removeClass(".container-local-confirmation-option", "active");
        changeVisibilityPoints(true);
        mapService.map.setPadding(70, 20, 320, 20);
        markerLocalConfirmationOption = mapService.removeMakerMap(markerLocalConfirmationOption);
        markerPointOrigin = mapService.removeMakerMap(markerPointOrigin);
        mapService.map.animateCamera({
            target: mapService.polylineRoute.getPoints().getArray(),
            duration: 1000,
            padding: 60,
        });
    }
}

function changeVisibilityPoints(status) {
    if (mapService.locationClient)
        mapService.locationClient.setVisible(status);
    if (mapService.locationDestination)
        mapService.locationDestination.setVisible(status);
    if (mapService.infoOrigin)
        mapService.infoOrigin.setVisible(status);
    if (mapService.infoDestination)
        mapService.infoDestination.setVisible(status);
    if (mapService.polylineRoute)
        mapService.polylineRoute.setVisible(status);

    mapService.waypoints.map((point) => {
        point.setVisible(status);
    });
}

function prepareScreenToTrip({status, data, errors, message}) {
    viewController.elementProperty.removeClass(
        ".container-connection-internet",
        "active"
    );
    Session.set("dateInitTrip", DateCustom.getNow());
    sortTimePhrase();

    preload(false);
    if (!status && [1621, 1622].includes(errors.code)) {
        return SwalCustom.dialogConfirm(getTextTranslate("init-trip", "title-dialog-attention"), message, "warning",
            {
                yes: {
                    text: getTextTranslate("init-trip", "text-confirm-dialog-check-now"),
                    value: true,
                },
                no: {
                    text: getTextTranslate("init-trip", "text-cancel-dialog"),
                    value: false,
                },
            }
        ).then(() => {
            initProcessingCallTrip();
            verifyListTripActivePartner();
            managerTripViewCurrent.isVisible = true;
            return Route.redirectDynamic('Client', 'Profile');
        });
    } else if (!status) {
        return SwalCustom.messageDialog("", message, undefined, "warning");
    }

    mapService.removeRoute();

    Route.removeGroupComponent(COMPONENT_CREATE_TRIP);

    if (data.status === STATUS_SCHEDULED) {
        initProcessingCallTrip(false);
        return showScheduleTrip(data.tripReference);
    }

    if(data.status === STATUS_GET_BID_BY_DRIVERS){
        initProcessingCallTrip(false);
        return startTripBidOfferScreen(data);
    }

    Session.set("tripReference", data.tripReference);

    initSearchTrip(data);
}

function newAnotherTripCustomer(newTrip) {
    preload(true);

    if (!validateTrip(newTrip)) {
        preload(false);
        return;
    }

    PartnerController.newTrip(newTrip)
        .then(({status, data, message, errors}) => {
            if ([1600, 0]?.includes(errors?.code)) {
                SwalCustom.messageDialog("", message, undefined, "warning");
                preload(false);
                return;
            }
            prepareScreenToTrip({status, data, message});
            verifyListTripActivePartner();
        })
}

function saveOrderPrices(trip) {
    const prices = Session.get("listPrices");

    Session.set("orderPrices", [
        parseInt(trip.tripTypeId),
        ...prices
            .filter(price => {
                return parseInt(price.tripTypeId) !== parseInt(trip.tripTypeId);
            })
            .map(price => {
                return parseInt(price.tripTypeId);
            })
    ]);
}
