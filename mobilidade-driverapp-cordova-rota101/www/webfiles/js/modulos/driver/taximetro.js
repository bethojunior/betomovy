function initEventTaximetro() {
    viewController.elementProperty.addEventInElement(".close-taximetro", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement(".btn-taximetro", "onclick", function () {
        const {tripTypes} = Session.get("user");

        if (tripTypes.length > 1) {
            Route.startClassesInComponent([
                {component: ".btn-taximetro", class: "active"},
                {component: ".modal-type-driver-taximetro", class: "active"}
            ], () => {
                viewController.elementProperty.removeClass(".btn-taximetro", "active");
                viewController.elementProperty.removeClass(".modal-type-driver-taximetro", "active");
            })
            document.querySelector("#listTripTypeTaximetro").innerHTML = tripTypes.map(item => {
                return `<li class="item-trip-type-tax" value='${JSON.stringify(item)}'>${item.tripType}</li>`
            }).join("");
        } else {
            showRatesByTripTypeTaximeter(tripTypes[0]);
        }

        viewController.elementProperty.addEventInElement(".item-trip-type-tax", "onclick", function () {
            viewController.elementProperty.removeClass(".modal-type-driver-taximetro", "active");
            const item = JSON.parse(this.getAttribute("value"));
            showRatesByTripTypeTaximeter(item);
        });

        viewController.elementProperty.addEventInElement(".close-modal-type-taximetro", "onclick", function () {
            viewController.elementProperty.removeClass(".modal-type-driver-taximetro", "active");
            viewController.elementProperty.removeClass(".btn-taximetro", "active");
        });

        function showRatesByTripTypeTaximeter(item) {
            PreloadRequest.clear();
            PreloadRequest.progress(getTextTranslate("taximeter", "update-fare"));
            Session.set("tripTypeTaximeter", item.tripTypeId);

            PriceController.findByTripType(Session.get("lastPosition"), item.tripTypeId).then(({
                                                                                                   status,
                                                                                                   data,
                                                                                                   message
                                                                                               }) => {
                if (!status) {
                    viewController.elementProperty.addClass(".modal-type-driver-taximetro", "active");
                    return PreloadRequest.info(message);
                }

                PreloadRequest.clear();

                Session.set("fareTripTypeTaximeter", data);

                viewController.elementProperty.getElement("#valueTaximetro", element => {
                    element.innerHTML = `${getTextTranslate("taximeter", "text-base-price")}: ${CityConfig.getTypeCoin()}${Mask.maskMoney((parseFloat(data.base_price)))} ${getTextTranslate("taximeter", "text-km-price")}: ${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(data.km_price))} ${getTextTranslate("taximeter", "text-minute-price")}: ${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(data.minute_price))}`
                });


                Route.startClassesInComponent(
                    [
                        {component: ".btn-taximetro", class: "active"},
                        {component: ".container-taximetro", class: "active"}
                    ],
                    () => {
                        if (isStartTaximetro())
                            return;
                        viewController.elementProperty.removeClass(".btn-taximetro", "active");
                        viewController.elementProperty.removeClass(".container-taximetro", "active");
                    });
            });
        }
    });

    viewController.elementProperty.addEventInElement("#startTaximetro", "onclick", function () {
        if (isStartTaximetro()) {
            Session.set("startTaximetro", new Date());
            startTripTaximetroLayout();
        } else {
            const fare = Session.get("fareTripTypeTaximeter");
            viewController.elementProperty.removeClass("#startTaximetro", "active");
            PreloadRequest.clear();

            PreloadRequest.progress("Iniciando viagem");
            const {lat, lng} = Session.get("lastPosition");

            TaximeterTripController.insert({
                "tripTypeId": Session.get("tripTypeTaximeter"),
                "latitude": lat,
                "longitude": lng,
                "priceId": fare.id,
                "multiplierDynamic": fare.multiplierValue
            }).then(({status, data}) => {
                if (!status) {
                    PreloadRequest.info("Não foi possível iniciar viagem");
                    viewController.elementProperty.removeClass("#startTaximetro", "active");
                    return;
                }

                initTripInProgressTaximeter(data)
            })
        }
    });

    viewController.elementProperty.addEventInElement("#pauseTaximetro", "onclick", function () {
        Session.set("pauseRouteTaximetro", true);
        viewController.elementProperty.addClass("#startTaximetro", "active");
        viewController.elementProperty.removeClass("#pauseTaximetro", "active");
        viewController.elementProperty.addClass("#stopTaximetro", "active");
        saveRouteTimeTaximetro();
        Session.delete("startTaximetro");
        Session.delete("routeTraveledTaximetro");
        Session.delete("pauseRouteTaximetro");
    });

    viewController.elementProperty.addEventInElement("#stopTaximetro", "onclick", function () {
        stopTripTaximetroLayout();
    })

    viewController.elementProperty.addEventInElement(".btn-finish-taximeter", "onclick", function () {
        SwalCustom.dialogConfirm(getTextTranslate("taximeter", "message-finish-trip"), "", (status) => {

            const trip = Session.get("tripDriver");
            PreloadRequest.progress("Registrando corrida...");

            if (trip.haveReturn == true) {
                SwalCustom.messageDialog(`Viagem concluida, valor ${Mask.maskMoney(parseFloat(trip.price))}`,
                    "Agora retorne para central", () => {
                        viewController.elementProperty.removeClass(".container-taximetro", "active", "start-taximetro");
                        viewController.elementProperty.removeClass(".footer-race", "hidden-to-taximetro");
                        confirmStop();
                    });
                return;
            }

            PreloadRequest.progress(getTextTranslate("taximeter", "finishing-done"));

            new DriverController().finishTripOffline(trip.tripReference, null).then((result) => {
                Session.delete("pauseRouteTaximetro");

                if (!result.status) {
                    return;
                }

                if (result != null) {
                    responseStatusTrip(result);
                } else {
                    clearDataTrip();
                }

                clearDataTaximeter();

            })
        })
    })
}

function initTripInProgressTaximeter(data) {
    PreloadRequest.success("Viagem iniciada!");
    Session.set("startTaximetro", new Date());
    Session.delete("routeTraveledTaximetro");
    Session.delete("historyTaximetro");
    Session.delete("pauseRouteTaximetro");
    startTripTaximetroLayout();
    initTripTaximeter(data);
}

function saveRouteTimeTaximetro() {
    if (Array.isArray(Session.get("startTaximetro")))
        return;

    const historyTaximetro = Session.get("historyTaximetro");

    historyTaximetro.push({
        minutes: parseInt(getMinutesRouteTraveledTaximetro(Session.get("startTaximetro"))),
        meters: getKmRouteTraveledTaximetro()
    });

    Session.set("historyTaximetro", historyTaximetro)
}

function createLayoutInTrip(init = false) {
    if (init) {
        Session.delete("routeTraveledTaximetro");
        Session.delete("historyTaximetro");
        Session.delete("startTaximetro");
        Session.delete("pauseRouteTaximetro")
    }

    if (Array.isArray(Session.get("startTaximetro")) && Array.isArray(Session.get("pauseRouteTaximetro"))) {
        Session.set("startTaximetro", new Date());
    }

    changePostTemplate();
    viewController.elementProperty.addClass(".btn-taximetro", "active");
    viewController.elementProperty.addClass(".footer-race", "hidden-to-taximetro");
    PreloadRequest.clear();
    PreloadRequest.progress("Atualizando dados da viagem");

    if (Session.get("tripDriver").centralNeighborhoodId != null) {
        const trip = Session.get("tripDriver");
        document.querySelector("#nameNeighborhoodTrip").innerHTML = trip.tripWayPoints.length > 0 ? trip.tripWayPoints[0].address : trip.destination.name;

        viewController.elementProperty.addClass(".container-taximetro", "trip-neighborhood")
    } else {
        viewController.elementProperty.removeClass(".container-taximetro", "trip-neighborhood")
    }

    TripController.actionGet(Session.get("tripDriver").tripReference).then(({status, data}) => {
        PreloadRequest.clear();
        if (!status) {
            PreloadRequest.info("Ocorreu um erro ao atualizar dados da viagem");
            return updateTripDriver();
        }
        initTripTaximeter(data);
    });
}

function initTripTaximeter(data) {
    Session.set("tripDriver", data);

    viewController.elementProperty.getElement("#valueTaximetro", element => {
        element.innerHTML = `Bandeirada: ${CityConfig.getTypeCoin()}${Mask.maskMoney((parseFloat(data.fare.base_price)))} Quilômetro: ${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(data.fare.km_price))} Tempo: ${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(data.fare.minute_price))}`
    });

    showDataTaximetro();
    viewController.elementProperty.addClass(".container-taximetro", "active", "start-taximetro");
    if (!Array.isArray(Session.get("pauseRouteTaximetro"))) {
        viewController.elementProperty.addClass("#startTaximetro", "active");
        viewController.elementProperty.removeClass("#pauseTaximetro", "active");
        viewController.elementProperty.removeClass("#stopTaximetro", "active");
    } else {
        viewController.elementProperty.removeClass("#startTaximetro", "active");
        viewController.elementProperty.addClass("#pauseTaximetro", "active");
        viewController.elementProperty.addClass("#stopTaximetro", "active");
    }
    viewController.elementProperty.addClass(".close-taximetro", "hidden");
    viewController.elementProperty.addClass("#displayValueTaximetro", "active");
    viewController.elementProperty.addClass(".center-camera-map-position", "taximetro-active");
    viewController.elementProperty.getElement(".container-qrcode-driver", element => element.style.display = "none");
    viewController.elementProperty.getElement(".button-float-datasheet", element => element.style.display = "none");
}

function startTripTaximetroLayout() {
    Session.delete("pauseRouteTaximetro");
    viewController.elementProperty.addClass(".container-taximetro", "start-taximetro");
    viewController.elementProperty.removeClass("#startTaximetro", "active");
    viewController.elementProperty.addClass("#pauseTaximetro", "active");
    viewController.elementProperty.addClass("#stopTaximetro", "active");
    viewController.elementProperty.addClass(".close-taximetro", "hidden");
    viewController.elementProperty.addClass("#displayValueTaximetro", "active");
    viewController.elementProperty.addClass(".footer-race", "hidden-to-taximetro");
    viewController.elementProperty.addClass(".center-camera-map-position", "taximetro-active");
    viewController.elementProperty.getElement(".container-qrcode-driver", element => element.style.display = "none");
    viewController.elementProperty.getElement(".button-float-datasheet", element => element.style.display = "none");
}

function stopTripTaximetroLayout() {
    SwalCustom.dialogConfirm(getTextTranslate("taximeter", "message-finish-trip"), "", (status) => {
        if (status) {
            Session.set("pauseRouteTaximetro", true);
            viewController.elementProperty.removeClass("#startTaximetro", "active");
            viewController.elementProperty.removeClass("#stopTaximetro", "active");
            viewController.elementProperty.removeClass("#pauseTaximetro", "active");
            const {time, price, km} = getValuesTaximeter();
            const trip = Session.get("tripDriver");
            PreloadRequest.progress("Registrando corrida...");

            const infoUpdateTaximeter = {
                "tripReference": trip.tripReference,
                "distance": km,
                "estimatedTripTime": time,
                "price": price
            };

            TaximeterTripController.update(infoUpdateTaximeter).then(({status}) => {
                if (trip.haveReturn == true) {
                    SwalCustom.messageDialog(`Viagem concluida, valor ${Mask.maskMoney(price)}`,
                        "Agora retorne para central", () => {
                            viewController.elementProperty.removeClass(".container-taximetro", "active", "start-taximetro");
                            viewController.elementProperty.removeClass(".footer-race", "hidden-to-taximetro");
                            confirmStop();
                        });
                    return;
                }


                if (!status) {
                    errorFinishedTrip();
                    return;
                }

                PreloadRequest.progress(getTextTranslate("taximeter", "finishing-done"));

                new DriverController().finishTripOffline(trip.tripReference, null).then((result) => {
                    Session.delete("pauseRouteTaximetro");

                    if (!result.status) {
                        errorFinishedTrip();
                        return;
                    }

                    finishTaximeterActive(result);

                }).catch(errorFinishedTrip);

                function errorFinishedTrip() {
                    PreloadRequest.progress(getTextTranslate("taximeter", "verify-trip-status"));
                    const userLogged = Session.get("user");
                    new DriverController().find(userLogged.idDriver).then(result => {
                        if (result.data.trip == null) {
                            finishTaximeterActive();
                            PreloadRequest.info(getTextTranslate("taximeter", "race-already-finished"));
                        } else {
                            Session.delete("pauseRouteTaximetro");
                            viewController.elementProperty.addClass("#stopTaximetro", "active");
                            viewController.elementProperty.addClass("#pauseTaximetro", "active");
                        }

                    });
                }

                function finishTaximeterActive(result = null) {
                    if (result != null) {
                        responseStatusTrip(result);
                    } else {
                        clearDataTrip();
                    }

                    clearDataTaximeter();
                }
            }).catch(() => {
                if (trip.haveReturn == true)
                    return SwalCustom.messageDialog("", "Ocorreu um erro ao tentar encerra viagem");

                Session.set("infoUpdateTaximeter", infoUpdateTaximeter);
                finishTripOffline();
                clearDataTaximeter();
            });
        }
    });
}


function clearDataTaximeter() {
    PreloadRequest.clear();

    Session.delete("pauseRouteTaximetro");
    Session.delete("startTaximetro");
    viewController.elementProperty.removeClass(".container-taximetro", "start-taximetro", "active");
    viewController.elementProperty.removeClass(".container-taximetro", "trip-neighborhood")
    viewController.elementProperty.addClass("#startTaximetro", "active");
    viewController.elementProperty.removeClass("#pauseTaximetro", "active");
    viewController.elementProperty.removeClass("#stopTaximetro", "active");
    viewController.elementProperty.removeClass(".close-taximetro", "hidden");
    viewController.elementProperty.removeClass("#displayValueTaximetro", "active");
    viewController.elementProperty.removeClass(".footer-race", "hidden-to-taximetro");
    viewController.elementProperty.removeClass(".center-camera-map-position", "taximetro-active");
    viewController.elementProperty.getElement(".container-qrcode-driver", element => element.style = "");
    viewController.elementProperty.getElement(".button-float-datasheet", element => element.style = "");
    viewController.elementProperty.removeClass(".btn-taximetro", "active");
}

function isStartTaximetro() {
    return document.querySelector(".container-taximetro").classList.contains("start-taximetro");
}


function trackValueTaximetro({lat, lng}) {
    if (!isStartTaximetro())
        return;

    if (Session.get("pauseRouteTaximetro") === true)
        return;

    showDataTaximetro();

    const pathRoute = getPathRouteTraveledTaximetro();

    const lastPosition = getLastPositionByPath(pathRoute);

    if (lastPosition != null) {
        if (
            plugin.google.maps.geometry.spherical.computeDistanceBetween(
                lastPosition,
                {lat, lng}
            ) < 50
        )
            return;
    }

    pathRoute.push({lat, lng});

    Session.set(
        "routeTraveledTaximetro",
        plugin.google.maps.geometry.encoding.encodePath(pathRoute));

    showDataTaximetro();

}

function getValuesTaximeter() {
    let time = parseInt(getMinutesRouteTraveledTaximetro(Session.get("startTaximetro")));
    let km = getKmRouteTraveledTaximetro();

    Session.get("historyTaximetro").map(({minutes, meters}) => {
        time += minutes;
        km += meters;
    });

    const price = parseFloat(calculateNewPrice(km, parseInt(time), true));

    return {price, time, km};
}

function showDataTaximetro() {
    if (!Array.isArray(Session.get("timeoutShowDataTaximeter")))
        clearTimeout(Session.get("timeoutShowDataTaximeter"));

    const {time, price, km} = getValuesTaximeter();

    document.querySelector("#typeCoin").innerHTML = CityConfig.getTypeCoin();

    document.querySelector("#priceTaximeterCalculate").innerHTML = Mask.maskMoney(price);

    document.querySelector("#timeProgressTaximetro")
        .innerHTML = `${getTextTranslate("taximeter", "time-progress-taximeter")}: ${parseInt(time)}min`;
    document.querySelector("#kmProgressTaximetro")
        .innerHTML = `Km: ${km.toFixed(3)}`;

    let timeout = setTimeout(showDataTaximetro, 5000);

    Session.set("timeoutShowDataTaximeter", timeout)
}

function getMinutesRouteTraveledTaximetro(date) {
    const start = Array.isArray(date) ? new Date() : new Date(date);
    const end = new Date();

    return (end - start) / 60 / 1000;
}


function getKmRouteTraveledTaximetro() {
    let meters = 0;
    const path = getPathRouteTraveledTaximetro();

    path.map((point, index) => {
        if (index === 0) return;

        meters += plugin.google.maps.geometry.spherical.computeDistanceBetween(
            path[index - 1],
            point
        );
    });

    return meters / 1000;
}

function getPathRouteTraveledTaximetro() {
    const routeTraveled = Session.get("routeTraveledTaximetro");
    if (Array.isArray(routeTraveled)) return routeTraveled;

    return plugin.google.maps.geometry.encoding.decodePath(routeTraveled);
}
