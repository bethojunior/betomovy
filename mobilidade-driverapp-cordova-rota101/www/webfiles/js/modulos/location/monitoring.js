const monitoringRoute = {
    polyline: null,
    socket: null
};

let lastPositionStorage = null;
let lastPositionCapture = null;
let auxLastPositionCapture = null;
const idDriver = parseInt(Session.getValueInSession("user", "idDriver"));
const metersToSendPosition = 10;

// Verificação de preço excessivo no recálculo
const MAX_RECALCULATION_FACTOR = 10;

// Recálculo automático
const RECALCULATION_TYPE_AUTOMATIC = "2";

function getCityConfig() {
    let config = Session.get("cityConfig");
    
    if (Array.isArray(config) || !config) {
        config = Session.get("tripCityConfig");
    }
    
    return config;
}

// Converter valores monetários de string para número
function parseMonetaryValue(value) {
    if (value == null || value === '') return 0;
    return parseFloat(String(value).replace(/\./g, '').replace(',', '.')) || 0;
}

// Atualizar preço recalculado na sessão
function updateSessionWithRecalculatedPrice(trip, newPrice) {
    try {
        const newPriceLocal = parseFloat(newPrice);
        if (!isNaN(newPriceLocal)) {
            const updatedTrip = Object.assign({}, trip, {
                price: String(newPriceLocal),
                recalculatedPrice: Object.assign({}, trip.recalculatedPrice || {}, {
                    oldPrice: String(trip.price),
                    newPrice: String(newPriceLocal),
                    recalculatedTripTypeId: RECALCULATION_TYPE_AUTOMATIC
                })
            });
            Session.set("tripDriver", updatedTrip);
        }
    } catch (e) {
        console.error("Falha ao pré-atualizar preço recalculado na sessão", e);
    }
}

function startSocket(lat, lng) {
    if (!socketConnection) return;
    sendPositionSocket(lat, lng);
}

function capturePosition({lat, lng}) {
    const config = getCityConfig();
    
    if (Array.isArray(Session.get("tripDriver")))
        return setMonitoring(false);

    if (Array.isArray(config) || !config) return;

    if (config.enableTripRecalculation == false) return;

    if (!isMonitoring()) return;

    if (!verifyTripExistDistanceAndTime()) return;

    const pathRoute = getPathRouteTraveled();

    const lastPosition = getLastPositionByPath(pathRoute);

    if (lastPosition != null) {
        if (
            plugin.google.maps.geometry.spherical.computeDistanceBetween(
                lastPosition,
                {lat, lng}
            ) < 50
        ) {
            return updateInfoMonitoring();
        }
    }

    if (!verifyPositionCaptureCurrent({lat, lng}))
        return;

    pathRoute.push({lat, lng});

    saveRouteTraveled(pathRoute);

    updateInfoMonitoring();
}

function veirifyPosition({lat, lng}) {
    if (lastPositionStorage == null) {
        lastPositionStorage = {lat, lng};
        return false;
    }

    if (plugin.google.maps.geometry.spherical.computeDistanceBetween({lat, lng}, lastPositionStorage) > metersToSendPosition) {
        startSocket(lat, lng);
        lastPositionStorage = {lat, lng};
        sendPositionSocket(lat, lng);
    }
}

function sendPositionSocket(lat, lng){
    const cityId = Session.getValueInSession("cityConfig", "cityId");
    const trip = Session.get("tripDriver");
    const driverStatus = Session.getValueInSession("user", "status");
    const userTypeId = Session.getValueInSession("user", "userTypeId");
    let status = driverStatus;

    if (!Array.isArray(trip) && trip && trip.status && trip.status !== STATUS_FINISH_TRIP) {
        const userLogged = Session.get("user");
        if (!Array.isArray(userLogged) && userLogged) {
            userLogged.status = trip.status;
            Session.set("user", userLogged);
        }
        status = trip.status;
    }
    socketConnection.emit("driver.location", {
        latitude: lat,
        longitude: lng,
        driverId: idDriver,
        userTypeId: userTypeId || null,
        cityId: cityId || null,
        status: status || null,
    });
}

function verifyPositionCaptureCurrent({lat, lng}) {
    if (lastPositionCapture == null) {
        lastPositionCapture = {lat, lng};
        return false;
    }

    if (plugin.google.maps.geometry.spherical.computeDistanceBetween({lat, lng}, lastPositionCapture) > 200) {
        if (auxLastPositionCapture != null) {
            if (plugin.google.maps.geometry.spherical.computeDistanceBetween(auxLastPositionCapture, lastPositionCapture) > 1000) {
                auxLastPositionCapture = lastPositionCapture;
                return false;
            }
            auxLastPositionCapture = null;
        } else {
            auxLastPositionCapture = {lat, lng};
            return false;
        }
    }

    lastPositionCapture = {lat, lng};

    return true;
}

function verifyTripExistDistanceAndTime() {
    const trip = Session.get("tripDriver");

    if (trip.distance == null)
        return false;

    if (trip.estimatedTripTime == null)
        return false;

    return true;
}

function getLastPositionByPath(path) {
    return path[path.length - 1] || null;
}

function saveRouteTraveled(path) {
    verifyRecalculateIsTripCurrent();

    Session.set(
        "routeTraveled",
        plugin.google.maps.geometry.encoding.encodePath(path));
}

function getPathRouteTraveled() {
    const routeTraveled = Session.get("routeTraveled");
    if (Array.isArray(routeTraveled)) return routeTraveled;

    return plugin.google.maps.geometry.encoding.decodePath(routeTraveled);
}

function isMonitoring() {
    const status = Session.get("statusMonitoring");

    if (!Array.isArray(Session.get("tripDriver"))) {
        const {status} = Session.get("tripDriver");

        if (status !== STATUS_IN_PROGRESS)
            return false;
    }


    if (Array.isArray(status)) return false;

    return status;
}

function setMonitoring(status) {
    const currentConfig = Session.get("cityConfig");

    if (!status) {
        lastPositionCapture = null;
        auxLastPositionCapture = null;
        Session.delete("dateTimeInProgress");
        Session.delete("routeTraveled");
        Session.delete("tripCityConfig");
        
        viewController.elementProperty.removeClass(
            ".container-km-time-trip",
            "active"
        );

        return;
    }

    if (currentConfig && !Array.isArray(currentConfig)) {
        Session.set("tripCityConfig", currentConfig);
    }

    const config = getCityConfig();

    if (Array.isArray(config) || !config) return;

    if (config.enableTripRecalculation == false) return;

    if (!verifyTripExistDistanceAndTime()) return;

    if (Array.isArray(Session.get("dateTimeInProgress")))
        Session.set("dateTimeInProgress", new Date());

    showInfoMonitoring();

    Session.set("statusMonitoring", status);
}

function showInfoMonitoring() {
    viewController.elementProperty.addClass(".container-km-time-trip", "active");
    updateInfoMonitoring();
}

function verifyRecalculateIsTripCurrent() {
    const trip = Session.get("tripDriver");

    if (!Array.isArray(Session.get("lastTripRecalculate"))) {
        if (trip.tripReference !== Session.get("lastTripRecalculate")) {
            Session.delete("routeTraveled");
            Session.set("dateTimeInProgress", new Date());
            Session.set("lastTripRecalculate", trip.tripReference)
        }
    } else {
        Session.set("lastTripRecalculate", trip.tripReference)
    }
}

function updateInfoMonitoring() {
    if (!verifyTripExistDistanceAndTime()) return;

    const trip = Session.get("tripDriver");

    verifyRecalculateIsTripCurrent();

    viewController.elementProperty.getElement(
        ".container-km-time-trip",
        element => {
            element.innerHTML = `<div>
                <span>${getTextTranslate("trip", "text-hired")}:</span>
                <span>${trip.distance}km/${trip.estimatedTripTime}min</span>
            </div>
            <div>
                <span>${getTextTranslate("trip", "text-rotated")}:</span>
                <span>${getKmRouteTraveled().toFixed(3)}km/${parseInt(
                getMinutesRouteTraveled()
            )}min</span>
            </div>`;
        }
    );
}

function verifyRecalculateFare() {
    try {
        const config = getCityConfig();
        const trip = Session.get("tripDriver");

        if (trip.tolls == null) {

            const updatedTripNoToll = Object.assign({}, trip, { tolls: [] });
            Session.set("tripDriver", updatedTripNoToll);
            TripController.actionGet(trip.tripReference)
                .then(response => {
                    if (response.status && response.data && response.data.tolls) {
                        const currentTrip = Session.get("tripDriver");
                        const updatedTrip = { ...currentTrip, tolls: response.data.tolls };
                        Session.set("tripDriver", updatedTrip);
                        console.log("Pedágios adicionados em background:", updatedTrip.tolls);
                    }
                });
        }

        const km = getKmRouteTraveled();
        const minute = getMinutesRouteTraveled();

        const valueMarginForRecalculation = parseFloat(config.marginForRecalculation);
        const tripDistance = parseFloat(trip.distance);
        const estimatedTime = trip.estimatedTripTime;

        const hasCancellationFee = (() => {
            const cancellation = Session.get("valueCancellationFeeByCustomer");
            if (Array.isArray(cancellation)) return false;
            const fee = parseFloat(cancellation?.value ?? 0);
            return !isNaN(fee) && fee > 0;
        })();

        const hasTolls = (() => {
            const tolls = (Session.get("tripDriver")?.tolls) || [];
            if (!Array.isArray(tolls) || tolls.length === 0) return false;
            const total = tolls.reduce((acc, t) => acc + parseMonetaryValue(t.value), 0);
            return total > 0;
        })();

        const willBeRecalculatedOrNot = () => {
            if (config.enableTripRecalculation) {
                const outsideMargin = (km > (tripDistance + valueMarginForRecalculation)) || (km < (tripDistance - valueMarginForRecalculation));
                const minutesChanged = minute !== estimatedTime;
                const absoluteThreshold = km > parseFloat(config.recalculationFromKm);
                return outsideMargin || minutesChanged || absoluteThreshold || hasCancellationFee || hasTolls;
            }
            return false;
        };

        if (!willBeRecalculatedOrNot())
            return null;

        const newPrice = calculateNewPrice(km, minute);

        if (newPrice > parseFloat(trip.price) * MAX_RECALCULATION_FACTOR) {
            console.error("Erro no recálculo: valor muito alto", newPrice);
            return null;
        }

        if (ConfigGeneral().get("enable_floating_price_recalculation") != null)
            if (ConfigGeneral().get("enable_floating_price_recalculation") == false) {
                if (parseFloat(trip.price) < newPrice) return {price: newPrice, km, minute};
            } else {
                return {price: newPrice, km, minute};
            }

        return null;
    } catch (e) {
        console.error("Erro ao recalcular preço:", e);
        return null;
    }
}

function getMinutesRouteTraveled() {
    if(Array.isArray(Session.get("dateTimeInProgress")))
        return 0;
    const start = new Date(Session.get("dateTimeInProgress"));

    const end = new Date();

    return parseInt((end - start) / 60 / 1000);
}

function getKmRouteTraveled() {
    let meters = 0;
    const path = getPathRouteTraveled();

    path.map((point, index) => {
        if (index === 0) return;

        meters += plugin.google.maps.geometry.spherical.computeDistanceBetween(
            path[index - 1],
            point
        );
    });

    return meters / 1000;
}

function calculateNewPrice(km, minute, isTaximeter = false) {
    if (Array.isArray(Session.get("tripDriver")))
        return 0;

    const {fare, tripWayPoints, distance, price, multiplierDynamic, tripDiscountCoupon, tolls} = Session.get("tripDriver");

    if (!isTaximeter)
        if (km <= parseFloat(distance) && ConfigGeneral().get("enable_floating_price_recalculation") == false)
            return parseFloat(price);
    
    const value =
        parseFloat(fare.km_price) * km +
        parseFloat(fare.minute_price) * parseInt(minute) +
        parseFloat(fare.base_price) +
        parseFloat(fare.another_fee) +
        parseFloat(fare.tax_price) +
        parseFloat(fare.waypoint_price) * tripWayPoints.length +
        checkTaxCancellationFee() +
        checkAdditionalValueKM(km, fare.km_to_additional_value, fare.additional_value_after_km, fare.type_additional_value_after_km);

    // Adicionar o valor dos pedágios
    const tollsValue = Array.isArray(tolls) ? 
        tolls.reduce((total, toll) => total + parseMonetaryValue(toll.value), 0) : 0;

    // Aplicar multiplicadores e descontos ao valor base (sem pedágios)
    const baseValueWithMultipliers = checkTripDiscountCoupon(checkMultiplierDynamic(value, multiplierDynamic), tripDiscountCoupon);
    const minPrice = checkTripDiscountCoupon(checkMultiplierDynamic(fare.min_price, multiplierDynamic), tripDiscountCoupon);

    // Valor base não pode ser menor que o preço mínimo
    const finalBaseValue = Math.max(baseValueWithMultipliers, parseFloat(minPrice));

    // Retornar o valor base + pedágios
    const finalPrice = finalBaseValue + tollsValue;

    
    return finalPrice;
}

function checkTripDiscountCoupon(value,tripDiscountCoupon){
    if(tripDiscountCoupon != null){
        switch (tripDiscountCoupon.valueType) {
            case "%":
                return value - (value * parseFloat(tripDiscountCoupon.value) / 100);
            case "$":
                return value - parseFloat(tripDiscountCoupon.value);
            default :
                return value;
        }
    }
    return value;
}

function checkAdditionalValueKM(km, km_to_additional_value, additional_value_after_km, type_additional_value_after_km) {
    if (parseFloat(km_to_additional_value) > 0)
        if (km >= parseFloat(km_to_additional_value)) {
            switch (type_additional_value_after_km) {
                case "km":
                    return (km - parseFloat(km_to_additional_value)) * parseFloat(additional_value_after_km);
                case "$":
                    return parseFloat(additional_value_after_km);
                default :
                    return 0;
            }
        }

    return 0;
}

function checkTaxCancellationFee() {
    const data = Session.get("valueCancellationFeeByCustomer");
    if (Array.isArray(data))
        return 0;

    return data.value;
}

function checkMultiplierDynamic(value, multiplierDynamic) {
    if (multiplierDynamic == null)
        return value;

    if (parseFloat(multiplierDynamic) === 0)
        return value;

    return value * parseFloat(multiplierDynamic);
}


function applyTravelCalculation(recalculate, tripFromFinish = null) {
    const trip = tripFromFinish || Session.get("tripDriver");

    PreloadRequest.progress("Sincronizando recalculo");
    // Isso evita que o modal de finalização apareça com o preço antigo
    updateSessionWithRecalculatedPrice(trip, recalculate.price);

    TripController.recalculatePrice({
        tripReference: trip.tripReference,
        newPrice: parseFloat(recalculate.price),
        oldPrice: parseFloat(trip.price),
        newDistance: getKmRouteTraveled(),
        newTripTime: getMinutesRouteTraveled()
    }).then(({status}) => {
        if (!status) return errorChangeStatus();

        PreloadRequest.progress("Finalizando corrida");

        if (tripFromFinish) {
            finalizeTrip(trip);
        } else {
            new DriverController()
                .finishTrip(trip.tripReference)
                .then(responseStatusTrip)
                .catch(finishTripOffline);
        }
    });
}

function showChoiceCheckoutTrip(recalculate, tripFromFinish = null) {
    const trip = tripFromFinish || Session.get("tripDriver");
    // Verificar se tem pedágios e calcular o valor total
    const tolls = trip.tolls || [];
    const tollsValue = tolls.reduce((total, toll) => total + parseMonetaryValue(toll.value), 0);
    
    // Texto adicional para pedágios
    const tollText = tollsValue > 0 ? 
        ` + Pedágio (${CityConfig.getTypeCoin()}${Mask.maskMoney(tollsValue)})` : 
        '';

    document.querySelector(
        "#btnCheckoutTripOriginal"
    ).innerHTML = `<p>${getTextTranslate("trip", "text-choice-value-original")}(${parseInt(trip.distance)}km)</p>
        <h4><span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(parseFloat(trip.price))}</h4>
        <label>(${getTextTranslate("trip", "text-choice-flat-rate")}${tollText})</label>`;

    document.querySelector(
        "#btnCheckoutTripRecalculate"
    ).innerHTML = `<p>${getTextTranslate("trip", "text-choice-new-value")}(${parseInt(recalculate.km)}km)</p>
        <h4><span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(parseFloat(recalculate.price))}</h4>
        <label>(${getTextTranslate("trip", "text-choice-recalculate")}${tollText})</label>`;

    viewController.elementProperty.addClass(".container-checkout-trip", "active");

    // Evento para o botão de valor recalculado
    viewController.elementProperty.addEventInElement(
        "#btnCheckoutTripRecalculate",
        "onclick",
        () => {
            viewController.elementProperty.removeClass(
                ".container-checkout-trip",
                "active"
            );

            PreloadRequest.progress(getTextTranslate("trip", "progress-sync-recalculate"));

            const newPrice = parseFloat(recalculate.price);

            // Quando o usuário clica no botão "Valor Recalculado", atualizamos a sessão
            updateSessionWithRecalculatedPrice(trip, newPrice);

            TripController.recalculatePrice({
                tripReference: trip.tripReference,
                newPrice: newPrice,
                oldPrice: parseFloat(trip.price),
                newDistance: getKmRouteTraveled(),
                newTripTime: getMinutesRouteTraveled()
            }).then(({status}) => {
                if (!status) return errorChangeStatus();

                PreloadRequest.progress(getTextTranslate("trip", "success-finish-trip"));

                if (tripFromFinish) {
                    finalizeTrip(trip);
                } else {
                    new DriverController()
                        .finishTrip(trip.tripReference)
                        .then(responseStatusTrip)
                        .catch(finishTripOffline);
                }
            });
        }
    );
    
    // Evento para o botão de valor original
    viewController.elementProperty.addEventInElement(
        "#btnCheckoutTripOriginal",
        "onclick",
        () => {
            viewController.elementProperty.removeClass(
                ".container-checkout-trip",
                "active"
            );

            PreloadRequest.progress(getTextTranslate("trip", "success-finish-trip"));

            if (tripFromFinish) {
                finalizeTrip(trip);
            } else {
                new DriverController()
                    .finishTrip(trip.tripReference)
                    .then(responseStatusTrip)
                    .catch(finishTripOffline);
            }
        }
    );
}

    function emitDriverLocation() {
        const sendWithLastPosition = () => {
            const lastPosition = Session.get("lastPosition");
            let lat;
            let lng;

            if (Array.isArray(lastPosition) || !lastPosition) {
                const lastPositionDriver = Session.get("lastPositionDriver");
                if (Array.isArray(lastPositionDriver) || !lastPositionDriver) {
                    console.warn("Não foi possível obter a localização atual para emitir driver.location");
                    return;
                }

                ({latitude: lat, longitude: lng} = lastPositionDriver);
            } else {
                ({lat, lng} = lastPosition);
            }

            if (socketConnection == null || !socketConnection.connected) {
                startSocket(lat, lng);
                setTimeout(() => {
                    if (socketConnection && socketConnection.connected) {
                        sendPositionSocket(lat, lng);
                    }
                }, 500);
            } else {
                sendPositionSocket(lat, lng);
            }
        };

        if (typeof Position !== "undefined" && typeof Position.getCurrentMap === "function") {
            Position.getCurrentMap().then(({lat, lng}) => {
                Session.set("lastPositionDriver", {latitude: lat, longitude: lng, date: new Date()}, false);
                Session.set("lastPosition", {lat, lng, date: new Date()}, false);
                if (socketConnection == null || !socketConnection.connected) {
                    startSocket(lat, lng);
                    setTimeout(() => {
                        if (socketConnection && socketConnection.connected) {
                            sendPositionSocket(lat, lng);
                        }
                    }, 500);
                } else {
                    sendPositionSocket(lat, lng);
                }
            }).catch(() => {
                sendWithLastPosition();
            });
            return;
        }

        sendWithLastPosition();
    }
