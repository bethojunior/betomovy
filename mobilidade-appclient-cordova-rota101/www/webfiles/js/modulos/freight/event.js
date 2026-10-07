function activeFreightScreen(data) {

    Session.set("tripReferenceFreight", data.tripReference);
    managerItemDelivery.photos = [];
    document.querySelector(`#listPhotosItems`).innerHTML = "";
    hideTab();
    viewController.elementProperty.removeClass(".container-alert-info-travel", "active");
    viewController.elementProperty.removeClass(".container-scheduled-datetime", "active");
    viewController.elementProperty.removeClass(".container-scheduled-time", "active");
    viewController.elementProperty.removeClass(".container-budget", "active");
    viewController.elementProperty.removeClass(".container-accessibility-item", "active");
    viewController.elementProperty.removeClass(".container-selected-item", "active", "show-active");
    viewController.elementProperty.removeClass(".container-choose-type-service", "active");
    viewController.elementProperty.removeClass(".container-price-delivery", "active");
    viewController.elementProperty.removeClass(".container-detail-freight-trip", "active");
    viewController.elementProperty.getElement(".btn-list-freight", element => {
        element.style.display = "none";
    });
    globalFreight.mapService.removeDetailMap();

    console.log(data)
    if (data.status === STATUS_SCHEDULED)
        return showScheduleFreight(data.tripReference);

    initRealtimeFreight();
}


function initEventLayoutFreight(trip) {
    updateMapFreightDriver(trip);

    const chatRepository = new ChatRepository();

    const chatIds = [];

    viewController.elementProperty.addEventInElement("#cancelFreight", "onclick", function () {
        preload(true);

        CustomerController.checkCancellationFee(
            Session.get("tripReferenceFreight")
        )
            .then(({status, data}) => {
                if (data == null) {
                    viewController.elementProperty.getElement("#messageCancelTrip", element => {
                        element.innerHTML = getTextTranslate("home", "message-wish-cancel-trip");
                    });
                } else {
                    viewController.elementProperty.getElement("#messageCancelTrip", element => {
                        element.innerHTML = data.type.description;
                    });
                }

                viewController.elementProperty.addClass(".container-cancel-request-trip", "active");

                viewController.elementProperty.addEventInElement("#btnCancelModalTripRequest", "onclick", function () {
                    viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
                });

                viewController.elementProperty.addEventInElement("#btnCancelTripRequest", "onclick", function () {
                    viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
                    preload(true);
                    const customerController = new CustomerController();
                    customerController.actionCancel(Session.get("tripReferenceFreight"),
                        Session.getValueInSession("user", "idUser"), DateCustom.getNow(), STATUS_CANCELED)
                        .then(function ({status, data}) {
                            preload(false);
                            if (!status) {
                                SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
                                return;
                            }
                            cleanFreightActive();
                        }).catch(() => {
                        preload(false);
                        SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
                    });

                });
            })
            .finally(() => {
                preload(false);
            });
    });
    activeMenu();

    viewController.elementProperty.addEventInElement("#chatFreight", "onclick", () => {
        Session.set("tripChat", trip);
        Route.redirectDynamic("Client", "Chat");
        viewController.elementProperty.removeClass("#chatFreight", "active");

        chatIds.map(id => {
            chatRepository.setViewMessage(id);
        })
    });

    viewController.elementProperty.addEventInElement("#detailFreight", "onclick", () => {
        preload(true);

        TripController.get(Session.get("tripReferenceFreight")).then(({data}) => {
            preload(false);
            showDetailFreight(data);

            Route.startClassesInComponent(
                [{component: ".container-detail-freight", class: "active"}],
                () => {
                    viewController.elementProperty.removeClass(
                        ".container-detail-freight",
                        "active"
                    );
                }
            );
        });
    });

    (()=>{
        chatRepository.getLastMessageUnread(trip.tripReference, (result, id) => {
            if (result.userId != Session.getValueInSession("user", "idUser"))
                if (!result.viewed) {
                    chatIds.push(id);
                    viewController.elementProperty.addClass("#chatFreight", "active");
                }
        });
    })();
}


function cleanFreightActive() {
    viewController.elementProperty.getElement(
        "#containerCustomerPlacesFreight",
        element => element.innerHTML = " "
    );

    viewController.elementProperty.getElement(".search-address-location-freight", element => {
        element.value = "";
    });

    viewController.elementProperty.removeClass(".container-freight-trip", "active", "search-freight");
    viewController.elementProperty.removeClass(".container-choice-trip-type", "active");
    viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
    viewController.elementProperty.getElement(".btn-list-freight", element => {
        element.style = "";
    });
    globalFreight.mapService.removeDetailMap();
    Session.delete("tripReferenceFreight");
    globalFreight.mapService.map.setPadding(25, 25, 25, 25);
    viewController.elementProperty.removeClass(".option-item-tab", "active");
    viewController.elementProperty.addClass("#enableFreightApp", "active");
    showTab();

    positionFreight.originFreight = null;
    positionFreight.destinationFreight = null;

    activeMenu();


}

function initSearchFreight(trip) {
    viewController.elementProperty.addClass(".container-freight-trip", "active", "search-freight");
    viewController.elementProperty.getElement("#statusFreightActive", element => {
        element.innerHTML = checkStatusByTrip(trip.status);
    });

    initEventLayoutFreight(trip);
}

function initRaceFreight(trip) {
    viewController.elementProperty.addClass(".container-freight-trip", "active");
    viewController.elementProperty.removeClass(".container-freight-trip", "search-freight");

    viewController.elementProperty.getElement(".profile-driver-freight", element => {
        element.style.backgroundImage = `url(${trip.driver.profilePicture})`;
    });
    document.querySelector("#nameDriverFreiht").innerHTML = trip.driver.name;

    viewController.elementProperty.getElement("#statusFreightActive", element => {
        element.innerHTML = checkStatusByTrip(trip.status);
    });

    Session.set("tripFreightActive", trip);
    initEventLayoutFreight(trip);
}


function showScheduleFreight(tripReference) {
    preload(true);
    TripController.get(tripReference).then(({status, data}) => {
        if (!status)
            return;

        document.querySelector("#addressScheduleTrip").innerHTML = data.destination.name;
        document.querySelector("#descriptionDateTimeScheduleTrip").innerHTML = getDescriptionScheduleFreight(data.schedule.schedule);
        document.querySelector("#priceScheduleTrip").innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(data.price))}`;

        viewController.elementProperty.addEventInElement("#closeDetailScheduleTrip", "onclick", () => {
            cleanFreightActive();
            viewController.elementProperty.removeClass(".container-detail-schedule-trip", "active");
        });

        viewController.elementProperty.addClass(".container-detail-schedule-trip", "active");
    }).finally(() => {
        preload(false);
    });
}

function getDescriptionScheduleFreight(dateString) {
    function createDayOfWeek() {
        return Array('dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb');
    }

    function createMonthYear() {
        return Array('jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez');
    }

    const dayOfWeek = createDayOfWeek();

    const monthYear = createMonthYear();

    const date = new Date(dateString);
    const descriptionDate = `${dayOfWeek[date.getDay()]}, ${date.getDate()} ${monthYear[date.getMonth()]} ${date.getFullYear()}`;

    const firstDate = date.toLocaleTimeString().slice(0, 5);

    date.setMinutes(date.getMinutes() + 10);

    const lastDate = date.toLocaleTimeString().slice(0, 5);

    const time = `${firstDate} - ${lastDate}`;

    return `${descriptionDate} ${time}`;
}

function updateMapFreightDriver() {
    const cityConfig = Session.get("cityConfig");

    if (managerUpdateFreight.socket == null && !Array.isArray(Session.get("lastDriverInTrip")))
        drawerDriverInMapFreight(Session.get("lastDriverInTrip"));

    if (managerUpdateFreight.socket != null)
        managerUpdateFreight.socket.disconnect();

    managerUpdateFreight.socket = io.connect(`${environment.hosts.hostSocket}${cityConfig.configDriverLocation.port_url}`,
        {query: `tripReference=${Session.get("tripReferenceFreight")}`});

    if (!Array.isArray(Session.get("positionDriverTrip")))
        drawerDriverInMapFreight(Session.get("positionDriverTrip"));

    managerUpdateFreight.socket.on(`location-${Session.get("tripReferenceFreight")}`, function (result) {
        if (!result)
            return;

        if (Array.isArray(Session.get("tripReferenceFreight")))
            return;

        Session.set("lastDriverInTrip", result);

        drawerDriverInMapFreight(result);
    });
}

function drawerDriverInMapFreight(result) {
    globalFreight.mapService.runEventForeground("update_map_trip_driver", () => {

        const {position, polyline} = result;

        const trip = Session.get("tripFreightActive");

        const positionWait = getDestination(trip);

        if (trip.status === STATUS_PRE_ACCEPTED) {
            if (result.waypoint)
                globalFreight.mapService.createWaypointInfoPreAccepted(result.waypoint);
        } else {
            globalFreight.mapService.clearWaypointInfoPreAccepted();
        }

        globalFreight.mapService.addPointClientWait(positionWait);

        globalFreight.mapService.showTimeArrival(positionWait, result.time);

        globalFreight.mapService.updateRouteInMap(positionWait, position, polyline, trip.driver.iconMapDriver);

        globalFreight.mapService.map.setPadding(25, 25, 300, 25);

        globalFreight.mapService.zoomBetweenPoints(false);
    });
}


function initRealtimeFreight() {
    freightCurrentRepository.close();

    freightCurrentRepository.getTrip(Session.get("tripReferenceFreight"), (trip, type) => {
        if (type === freightCurrentRepository.typeRemoved) {
            TripController.get(trip.tripReference)
                .then(({status, data: response}) => {
                    if (response.status === STATUS_FINISHED) {
                        finishTrip(response);
                        cleanFreightActive();

                        Session.delete("tripReferenceFreight");
                        Session.delete("positionDriverTrip");
                        return;
                    }

                    if (
                        response.status === STATUS_CANCELED ||
                        response.status === STATUS_NOT_ANSWERED ||
                        response.status === STATUS_BACK_OFF ||
                        response.status === STATUS_PAYMENT_REFUSED
                    ) {
                        cleanFreightActive();

                        Session.delete("tripReferenceFreight");
                        Session.delete("positionDriverTrip");

                        if (response.status === STATUS_NOT_ANSWERED) SwalCustom.messageDialog("", "Não motorista encontrado");
                    }

                    cleanFreightActive();
                })
                .catch(e => console.log(e));
            return;
        }
        if (
            trip.status === STATUS_SEARCHING ||
            trip.status === STATUS_SEARCHING_FAVORITE
        ) {
            initSearchFreight(trip.tripReference);
            return;
        }

        if (trip.status === STATUS_ACCEPTED || trip.status === STATUS_PRE_ACCEPTED) {
            initRaceFreight(trip);
            return;
        }

        if (trip.status === STATUS_BOARDING || trip.status === STATUS_IN_PROGRESS) {
            initRaceFreight(trip);
        }
    })
}
