const managerUpdateTrip = {
    chatRepository: new ChatRepository(),
    searchingCars: [],
    socketTripRoute: null
};

const managerTripViewCurrent = {
    isVisible: true,
    request: null
};

const tripCurrentRepository = new TripRepository();
const elementProperty = new ElementProperty();

function verifyTrip() {
    //Route.removeGroupComponent(COMPONENT_CREATE_TRIP);

    clearTimeout(managerTrip.timeOut);

    if (!managerTripViewCurrent.isVisible) return;

    const tripReference = Session.get("tripReference");

    if (tripReference.length === 0) return;

    verifyChatTrip(tripReference);

    TripController.get(tripReference)
        .then(({message, status, data}) => {
            viewController.elementProperty.getElement(
                ".container-connection-internet",
                element => element.classList.remove("active")
            );

            if (!status)
                return SwalCustom.messageDialog(
                    message,
                    "Atenção",
                    undefined,
                    "warning"
                );

            if (data != null) return checkStatusTrip(data);
        })
        .catch(e => {
            console.log(e);
            viewController.elementProperty.getElement(
                ".container-connection-internet",
                element => element.classList.add("active")
            );

            setTimeout(verifyTrip, 3000);
        });
}

function verifyChatTrip(tripReference) {
    if (managerUpdateTrip.chatRepository.isConnect) return;

    managerUpdateTrip.chatRepository.getLastMessageUnread(
        tripReference,
        (result, id) => {
            if (result.userId != Session.getValueInSession("user", "idUser")) {
                if (!result.viewed) {
                    viewController.elementProperty.getElement(".chat-client", element => {
                        element.classList.add("active");
                    });

                    viewController.elementProperty.getElement(".message-client-notification", element => {
                        if (result.isAudio) {
                            element.innerHTML = "Mensagem de áudio";
                        } else if (result.message === "call-number call-customer") {
                            element.innerHTML = getTextTranslate("home", "called-notification");
                        } else {
                            element.innerHTML = result.message;
                        }
                    });

                    if (result.message != null) {
                        viewController.elementProperty.addClass(".container-notification-chat", "active");
                    }

                    viewController.elementProperty.getElement("#songMessage", element => {
                        element.play();
                    });
                }
            }
        }
    );
}

elementProperty.addEventInElement('.container-notification-chat', 'onclick', function () {
    const container = document.querySelector('.container-notification-chat');

    if(container.classList.contains("active")){
        viewController.elementProperty.getElement(".container-notification-chat", element => {
            element.classList.remove("active");
        });

        return openChat(managerTrip.tripCurrent);
    }
});

function verifyTripLogDistanceValue(trip) {
    if (trip.tripLongDistanceValue != null && trip.recalculatedPrice == null) {
        viewController.elementProperty.addClass(".container-long-distance", "active");
        document.querySelector("#newValueLongDistance").innerHTML = `${CityConfig.getTypeCoin()}` + Mask.maskMoney(parseFloat(trip.price) +
            parseFloat(trip.tripLongDistanceValue.value));

        viewController.elementProperty.addEventInElement("#recalculateTripLongDistance", "onclick", function () {
            viewController.elementProperty.removeClass(".container-long-distance", "active");
            TripLongDistanceController.recalculate({
                tripReference: trip.tripReference,
                oldPrice: parseFloat(trip.price),
                newPrice: parseFloat(trip.price) +
                    parseFloat(trip.tripLongDistanceValue.value),
            })
        });

        viewController.elementProperty.addEventInElement("#findAnotherDriverTrip", "onclick", function () {
            viewController.elementProperty.removeClass(".container-long-distance", "active");
            preload(true);
            new CustomerController().actionCancel(
                trip.tripReference,
                Session.getValueInSession("user", "idUser"),
                DateCustom.getNow()
            ).then(() => {
                if (tripRouteRepository != null)
                    tripRouteRepository.close();

                if (mapService != null)
                    mapService.removeRoute();

                initProcessingCallTrip(false);
                initNewTripAfterCancel(trip);
            }).finally(() => {
                preload(false);
            })
        });
    } else {
        viewController.elementProperty.removeClass(".container-long-distance", "active");
    }
}

function updateInfoTripRide(){
    viewController.elementProperty.addClass(".btn-travel-track-shared","active");

    viewController.elementProperty.addEventInElement(".btn-travel-track-shared","onclick",function(){
        if (Array.isArray(Session.get("tripReference")))
            return this.classList.remove("active");
            Route.redirectDynamic("Ride", "AccompanyTrip");
    });
}

function initRace(trip) {
    animationPlacesMap(false);
    hideTab();
    verifyTripLogDistanceValue(trip);
    stopProgressTrip();
    clearDataCar();
    checkEnabledCall();
    clearSearchingCarMap();

    managerTrip.tripCurrent = trip;

    viewController.elementProperty.getElement(".info-trip", element => {
        if (
            trip.status !== STATUS_ACCEPTED ||
            trip.status !== STATUS_PRE_ACCEPTED
        ) {
            element.style.display = "none";
            return;
        }
        element.style.display = "block";
    });

    if (trip.status === STATUS_IN_PROGRESS || trip.tripCallTypeId === TYPE_RIDE) {
        viewController.elementProperty.getElement(".cancel-trip-event", element => {
            element.style.display = "none";
        });
    } else {
        viewController.elementProperty.getElement(".cancel-trip-event", element => {
            element.style.display = "flex";
        });
    }

    viewController.elementProperty.addEventInElement("#btnRequestUpdateDriverLocation","onclick",function(event){
        event.stopPropagation();
        preload(true);
        DriverController.requestUpdateDriverLocation(trip.driverId).then(()=>{
            preload(false);
        });
    })

    viewController.elementProperty.addEventInElement(
        ".event-data-trip-info",
        "onclick",
        function () {
            InfoTrip.showDataClientTrip(trip);
        }
    );

    viewController.elementProperty.getElement(
        ".footer-container-trip",
        element => {
            element.classList.remove("active");
        }
    );
    viewController.elementProperty.removeClass(".trip-bid-offer-modal", "active");
    viewController.elementProperty.addClass(".container-trip-data-v2","active");
    viewController.elementProperty.getElement(".trip-client", element => {
        element.classList.add("active");
    });
    viewController.elementProperty.getElement(
        ".footer-container-trip",
        element => {
            element.classList.remove("active");
        }
    );
    viewController.elementProperty.getElement(".map-client", element => {
        mapService.map.setPadding(50, 20, 200, 20);
        element.classList.add("in-trip");
    });
    viewController.elementProperty.getElement(".footer-payment-form", element =>
        element.classList.remove("active")
    );

    viewController.elementProperty.addEventInElement(
        ".btn-security-customer",
        "onclick",
        () => {
            if (Session.get("configGeneral").find(item => {
                return item.value == true && item.key == "enable_security_button_options";
            }) != null)
                return showOptionSecurityDriver();


            window.plugins.CallNumber.callNumber(
                result => {
                },
                result => {
                    SwalCustom.messageDialog(
                        "",
                        "Ops... não foi possível fazer a ligação",
                        undefined,
                        "warning"
                    );
                },
                Session.getValueInSession("cityConfig", "securityContactNumber"), true);
        }
    );

    viewController.elementProperty.getElement(".name-driver-trip", element => {
        element.innerHTML = trip.driver.nickname;
    });

    if (!Array.isArray(trip.driver.car)) {
        viewController.elementProperty.getElement(".car-plate-driver", element => {
            element.innerHTML = trip.driver.car ? trip.driver.car.plate : "Não informado";
        });
        viewController.elementProperty.getElement(".car-brand-driver", element => {
            element.innerHTML = `<span>${trip.driver.car.brand}/${trip.driver.car.model || "Não informado"}</span>&nbsp;<span>${trip.driver.car.color || "Não informado"}</span>`;
        });
    } else {
        viewController.elementProperty.getElement(".car-plate-driver", element => {
            element.innerHTML = getTextTranslate('home', 'text-uninformed');
        });
        viewController.elementProperty.getElement(".car-brand-driver", element => {
            element.innerHTML = ``;
        });
    }

    viewController.elementProperty.getElement(
        ".image-profile-driver",
        element => {
            const config = Session.get("configGeneral");
            const picturesLink = config.find(item => {
                return item.key === 'link_storage_pictures';
            });
                
            const finalLink = `${picturesLink.value}driver/profile/compressed/`;

            // element.style.backgroundImage = `url('${PATH_PROFILE_DRIVER +
            // trip.driver.profileImage}')`;
            element.style.backgroundImage = `url('${finalLink + trip.driver.profileImage}')`;
        }
    );

    mapService.removeRoute();

    const positionWait = getDestination(trip);

    showStatusTrip(managerTrip.tripCurrent.status);

    mapService.checkMapLoad(() => {
        mapService.addPointClientWait(positionWait);
        updateMapTripDriver();
    });
    // driverInDriver.progressTime(3,checkStatusTrip);

    viewController.elementProperty.addEventInElement(
        ".share-trip-app-event",
        "onclick",
        shareTripCustomer
    );
    viewController.elementProperty.addEventInElement(
        ".share-trip-customer",
        "onclick",
        shareTripCustomer
    );

    function shareTripCustomer(event) {
        event.stopPropagation();
        TripController.getShareLink(Session.get("tripReference")).then(
            ({status, data}) => {
                if (!status) return;
                window.plugins.socialsharing.shareWithOptions(
                    {
                        message:
                            `Estou indo de ${NAME_APP}, placa ` +
                            managerTrip.tripCurrent.driver.car.plate +
                            " com motorista " +
                            managerTrip.tripCurrent.driver.nickname +
                            ", Clique e acompanhe a minha corrida.\n",
                        subject: NAME_APP,
                        url: data
                    },
                    result => {
                    },
                    error => {
                    }
                );
            }
        );
    }
}

function updateMapTripDriver() {
    const trip = managerTrip.tripCurrent;

    if (trip.tripCallTypeId === TYPE_FREIGHT)
        return;

    const cityConfig = Session.get("cityConfig");

    if (managerUpdateTrip.socketTripRoute == null && !Array.isArray(Session.get("lastDriverInTrip")))
        drawerDriverInMap(Session.get("lastDriverInTrip"));

    if (managerUpdateTrip.socketTripRoute != null)
        managerUpdateTrip.socketTripRoute.disconnect();

    managerUpdateTrip.socketTripRoute = io.connect(`${environment.hosts.hostSocket}${cityConfig.configDriverLocation.port_url}`,
        {query: `tripReference=${Session.get("tripReference")}`});

    if (!Array.isArray(Session.get("positionDriverTrip")))
        drawerDriverInMap(Session.get("positionDriverTrip"));

    managerUpdateTrip.socketTripRoute.on(`location-${Session.get("tripReference")}`, function (result) {
        if (!result)
            return;

        if (Array.isArray(Session.get("tripReference")))
            return;

        Session.set("positionDriverTrip", result);

        drawerDriverInMap(result);
    });
}

function drawerDriverInMap(result) {
    mapService.runEventForeground("update_map_trip_driver", () => {

        const {position, polyline} = result;

        const positionWait = getDestination(managerTrip.tripCurrent);

        if (trip.status === STATUS_PRE_ACCEPTED) {
            if (result.waypoint)
                mapService.createWaypointInfoPreAccepted(result.waypoint);
        } else {
            mapService.clearWaypointInfoPreAccepted();
        }

        mapService.showTimeArrival(positionWait, result.time);

        mapService.updateRouteInMap(positionWait, position, polyline, managerTrip.tripCurrent.driver.iconMapDriver);
    });
}

function stopProgressTrip() {
    searchTripProgress.stopProgress();

    viewController.elementProperty.removeClass(".container-notification-chat", "active");

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

    if (mapService.pointCustomer != null)
        mapService.pointCustomer.setMap(mapService.map);

    if (mapService.map != null)
        mapService.map.setOptions({styles: mapService.getStyleMapDefault()});

    if (mapService.infoSearch !== null) mapService.infoSearch.setMap(null);
}

function clearDataCar() {
    viewController.elementProperty.getElement(".name-driver-trip", element => {
        element.innerHTML = "";
    });
    viewController.elementProperty.getElement(".car-plate-driver", element => {
        element.innerHTML = "";
    });
    viewController.elementProperty.getElement(".car-brand-driver", element => {
        element.innerHTML = "";
    });
}

function initCloseTrip() {
    viewController.elementProperty.addEventInElement(
        ".menu-close",
        "onclick",
        e => {
            e.stopPropagation();
            initProcessingCallTrip();
            verifyListTripActivePartner();
            managerTripViewCurrent.isVisible = true;
        }
    );

    viewController.elementProperty.addClass(".menu-close", "open");
}

function getTaxiType() {
    if (this.classList.contains("active")) return;

    const object = JSON.parse(this.getAttribute("value"));

    const isOfferTrip = this.classList.contains("type-trip-offer")
    managerTrip.typeTaxi.priceId = object.idPrice;
    managerTrip.typeTaxi.price = parseFloat(object.price);
    managerTrip.typeTaxi.tripTypeId = parseFloat(object.tripTypeId);
    managerTrip.typeTaxi.priceName = object.priceName;
    managerTrip.typeTaxi.multiplierPriceDynamic = object.priceDynamicValue;
    managerTrip.typeTaxi.tripType = object.tripType;
    if (object.cashback != null) managerTrip.typeTaxi.cashback = object.cashback;

    viewController.elementProperty.getElement(".trip-type", element =>
        element.classList.remove("active")
    );

    this.classList.add("active");
    
    getPaymentForm(function () {
        elementProperty.addEventInElement(
            ".payment-form-trip",
            "onclick",
            function () {
                clearCouponApply();
                managerTrip.paymentFormIdSelected = getPaymentFormSelect(this);
            }
        );
    }, isOfferTrip);
    
    showPaymentForm(isOfferTrip);
    resetPricesEdited();
    clearCouponApply();
}

function checkEnabledCall() {
    const config = Session.get("cityConfig");

    if (config.enableCallInChat == true) {
        viewController.elementProperty.getElement(".phone-client", element => {
            element.style.display = "flex"
        });
        viewController.elementProperty.getElement("#callNumberClient", element => {
            element.style.display = "flex"
        });
    } else {
        viewController.elementProperty.getElement(".phone-client", element => {
            element.style.display = "none"
        });
        viewController.elementProperty.getElement("#callNumberClient", element => {
            element.style.display = "none"
        });
    }
}

function initSearchTrip(data) {
    mapService.map.setPadding(50, 20, 20, 20);
    animationPlacesMap(true, data);
    managerTripViewCurrent.isVisible = true;
    checkEnabledCall();
    hideTab();
    managerTrip.tripCurrent = data;

    if (mapService.polylineRoute != null) {
        mapService.polylineRoute.remove();
        mapService.polylineRoute = null;
    }

    viewController.elementProperty.getElement(".container-km-trip", element => {
        element.innerHTML = "";
    });

    viewController.elementProperty.removeClass(
        ".footer-container-trip",
        "active"
    );
    /* viewController.elementProperty.getElement(".map-client", element => {
         element.classList.remove("active");
     });*/

    viewController.elementProperty.getElement(".footer-payment-form", element =>
        element.classList.remove("active")
    );

    activeMenu();

    mapService.searchDriver(data);

    viewController.elementProperty.addClass(".search-driver-in-trip", "active");

    viewController.elementProperty.getElement(".car-return", element => {
        element.src = `${HOST}webfiles/img/logo/return-${data.tripTypeId}-d.png`;
    });

    if (Session.get("dateInitTrip").length === 0)
        Session.set("dateInitTrip", DateCustom.getNow());

    if (Session.get("timePhrase").length === 0) sortTimePhrase();

    initEventSearch();

    managerTrip.isSearch = true;

    observerRealtime();
}

function initEventSearch() {
    viewController.elementProperty.addEventInElement(
        ".cancel-search-trip",
        "onclick",
        function () {
            viewController.elementProperty.getElement(
                "#messageCancelTrip",
                element => {
                    element.innerHTML = getTextTranslate("home", "message-cancel-trip");
                }
            );
            cancelSearchTrip(STATUS_BACK_OFF);
        }
    );
}

function showVehicles() {
    const {lat, lng} = Session.get("location");

    clearSearchingCarMap();

    DriverCloseController.get({lat, lng}).then(({status, data}) => {
        if (!status) return;

        if (data == null)
            return;

        data.map((car) => {
            const position = {
                lat: parseFloat(car.latitude),
                lng: parseFloat(car.longitude)
            };

            const pop = mapService.createCar(
                position,
                mapService.map,
                car.iconMapDriver
            );

            managerUpdateTrip.searchingCars.push(pop);
        });

        //mapService.map.setCenter({lat, lng});
        //mapService.map.setZoom(17);
    });
}

function clearSearchingCarMap() {
    mapService.runEventForeground("remove-searching-car", () => {
        managerUpdateTrip.searchingCars.map((car) => {
            mapService.removeMakerMap(car);
        });

        managerUpdateTrip.searchingCars = [];
    });
}

function getRandomInRange(from, to) {
    return Math.random() * (to - from) + from;
}

