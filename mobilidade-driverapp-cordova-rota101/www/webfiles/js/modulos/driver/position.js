const positionLocation = new Position();

const initTripStatus = "in_progress";

const controllerMeter = {
    isRequestPosition: false,
    gpsIsActive: false,
    getMetersMove: () => {
        const userLogged = Session.get("user");

        return userLogged.status === "desligado" ? 10 : 3;
    }, minMetersMove: 3,
    lastDateTime: new Date()
};

function getPositionDriver() {
    let lastPosition = null;

    let isActiveBackground = false;

    let timeout = null;

    let countErrorGps = 0;

    navigator.geolocation.watchPosition(({coords}) => {
        const {latitude: lat, longitude: lng} = coords;

        if (verifyPositionCurrent({lat, lng})) {
            executeCallback(() => drawerNavigationMap({lat, lng}));
            executeCallback(() => verifyCapturePosition({lat, lng}));
            executeCallback(() => trackValueTaximetro({lat, lng}));
        }

        executeCallback(() => getNewPositionDriver({lat, lng}));

    }, (error) => console.log(error), {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
    });

    /*BackgroundGeolocation.on('background', function () {
        isActiveBackground = true;
        clearTimeout(timeout);
        //getBackgroundPosition();
    });

    BackgroundGeolocation.on('foreground', function () {
        isActiveBackground = false;
        clearTimeout(timeout);
    });*/

    function verifyPositionCurrent({lat, lng}) {
        if (lastPosition == null) {
            lastPosition = {lat, lng};
            return true;
        }

        if (plugin.google.maps.geometry.spherical.computeDistanceBetween({
            lat,
            lng
        }, lastPosition) > 99 && countErrorGps < 3) {
            countErrorGps++;
            lastPosition = {lat, lng};
            return false;
        }

        countErrorGps = 0;

        return true;
    }
}


function executeCallback(callback) {
    try {
        callback();
    } catch (e) {
        console.log(e);
    }
}

function getConfigByCity(position) {
    if (Array.isArray(position))
        return Promise.resolve();

    return CityController.getConfig(position || {}).then(({status, data}) => {
        if (!status || !data)
            return;
        Session.set("cityConfig", data);
        const cityId = data.cityId ?? data.idCity;
        if (cityId != null) Session.set("cityId", cityId);
        verifyFunctionsDriver();
        createListScheduleTrip();
        checkTripPreAcceptedByDriver();
    }).catch(() => {});
}

function checkFunctionByCity(data) {
    if (data.enableDriverDataSheet == true)
        viewController.elementProperty.removeClass(".button-float-datasheet", "hidden");

    if (data.enableKnobTrip == true) {
        viewController.elementProperty.removeClass(".container-qrcode-driver", "hidden");
    } else {
        viewController.elementProperty.addClass(".container-qrcode-driver", "hidden");
    }

    const configBtnSecurity = Session.get("configGeneral").find(item => {
        return item.key === "enable_security_button_options"
    });

    if (configBtnSecurity) {
        if (configBtnSecurity.value == false) {
            document.querySelector("#btnSecurityDriver").classList.remove("show");
        } else {
            document.querySelector("#btnSecurityDriver").classList.add("show");
        }
    }

    viewController.elementProperty.getElement(".btn-taximetro", element => {
        const user = Session.get("user");
        const config = ConfigGeneral().get("enable_taximeter");
        if (config != null) {
            if (config == true && user.isDeliveryMan != true) {
                element.classList.remove("hidden");
            } else {
                element.classList.add("hidden");
            }
        }
    });
}

function verifyCapturePosition({lat, lng}) {
    capturePosition({lat, lng});
    veirifyPosition({lat, lng})
}

function drawerNavigationMap({lat, lng}) {
    mapService.setPositionDriver({lat, lng});
}

function getNewPositionDriver({lat, lng}) {
    if (!isTimeGetPosition())
        return;

    Session.set("lastPosition", {lat, lng, date: new Date()}, false);

    //updateLocationDriverServer(lat, lng);

    const trip = Session.get("tripDriver");

    if (trip.length === 0 && mapService != null)
        mapService.removeRoute();
}


function isTimeGetPosition() {
    const now = new Date();

    const time = (now.getTime() - controllerMeter.lastDateTime.getTime());

    const timeLimit = !getTimeLocation() ? getTimeLocation() : 5000;

    if (time < timeLimit)
        return false;

    controllerMeter.lastDateTime = now;

    return true;
}

function verifyPositionPreAvailable() {
    const trip = Session.get("tripDriver");

    if (!Array.isArray(trip))
        if (!managerPreAvailable.isSearch) {
            if (trip.status === initTripStatus) {
                const cityConfig = Session.get("cityConfig");
                const meter = plugin.google.maps.geometry.spherical.computeDistanceBetween(Session.get("lastPosition"),
                    {lat: parseFloat(trip.destination.latitude), lng: parseFloat(trip.destination.longitude)});

                const meterMax = parseInt(cityConfig.kmRemainingToPutDriverPreAvailable) * 1000;

                if (meterMax >= meter)
                    enablePreAvailable();

            }
        }
}

function updateNavigateRoute(position) {

    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".apps-route", "onclick", function (e) {
        e.preventDefault();
        initRoute();
    });

    elementProperty.addEventInElement("#openDirection", "onclick", function () {
        initRoute();
    });

    elementProperty.addEventInElement("#showRouteInApp", "onclick", function () {
        elementProperty.getElement(".footer-race",element=>{
            if(element.classList.contains("show-route")){
                element.classList.remove("show-route");
            }else{
                element.classList.add("show-route");
            }
        })
    });

    function initRoute() {
        if (Array.isArray(Session.get("navigationBy"))) {
            elementProperty.addClass(".container-option-navigator", "active");
        } else {
            selectNavigationBy(Session.get("navigationBy"));
        }
    }


    elementProperty.addEventInElement(".close-modal-navigator", "onclick", function (e) {
        elementProperty.addClass(".container-option-navigator", "active");
    });

    elementProperty.addEventInElement(".container-option-navigator", "onclick", function (e) {
        e.stopPropagation();
        elementProperty.removeClass(".container-option-navigator", "active");
    });

    elementProperty.addEventInElement(".close-modal-navigator", "onclick", function (e) {
        e.stopPropagation();
        e.preventDefault();

        elementProperty.removeClass(".container-option-navigator", "active");

        selectNavigationBy(this.getAttribute("id"));
    });
}

function selectNavigationBy(navigationBy) {

    Session.set("navigationBy", navigationBy);

    const position = Session.get("lastPosition");

    const endPosition = getLastPosition();

    const trip = Session.get("tripDriver");

    let waypoints = [];

    if (trip.status === initTripStatus)
        waypoints = trip.tripWayPoints.filter((waypoint) => {
            return waypoint.confirmed === "0";
        }).map(({latitude: lat, longitude: lng}) => {
            return {lat, lng};
        });

    if (waypoints.length > 0) {
        endPosition.lat = waypoints[0].lat;
        endPosition.lng = waypoints[0].lng;
    }

    switch (navigationBy) {
        case "navigatorByGoogle": {
            window.open(`https://www.google.com/maps/dir/?api=1&origin=${position.lat},${position.lng}&destination=${endPosition.lat},${endPosition.lng}&travelmode=driving`, "_system");
            break;
        }
        case "navigatorByWaze": {
            window.open(`https://www.waze.com/ul?ll=${endPosition.lat},${endPosition.lng}&navigate=yes&zoom=17`, "_system");
            break;
        }
    }
}

function showDetails(position) {
    const elementProperty = new ElementProperty();

    elementProperty.getElement("#gps", element => {
        element.innerHTML = `
                    Longitude = ${position.lat} </br>
                    Latitude = ${position.lng} </br>
                    Velocidade (M/s) = ${position.speed === null ? 0 : position.speed} </br>
                    Angulo = ${position.heading === null ? 0 : position.heading} deg</br>
             `;
    });
}

function getLastPosition() {
    const trip = Session.get("tripDriver");

    if (trip.length === 0) {
        return {};
    }

    const isStartTrip = (trip.status === initTripStatus);

    const endPosition = {
        lat: parseFloat(trip.origin.latitude),
        lng: parseFloat(trip.origin.longitude)
    };

    if (isStartTrip) {
        endPosition.lat = parseFloat(trip.destination.latitude);
        endPosition.lng = parseFloat(trip.destination.longitude);
    }

    return endPosition;
}


function getTimeLocation() {
    const config = Session.get("configLocation");

    if (Array.isArray(config))
        return false;

    const isDisabled = Session.get("user").status === "desligado";

    return isDisabled ? config.timeOff :
        config.timeOn;
}


function updateLocationDriverServer(latitude, longitude) {

    const config = Session.get("configLocation");

    const isDisabled = Session.get("user").status === "desligado";

    const time = isDisabled ? config.timeOff :
        config.timeOn;

    if (!Array.isArray(Session.get("lastPositionDriver"))) {

        const {latitude: lat, longitude: lng} = Session.get("lastPositionDriver");

        const meter = new Position().getDistanceLocation({lat: latitude, lng: longitude}, {lat, lng});

        if (!verifyMinTimeLocation(time))
            return;
    }

    Session.set("lastPositionDriver", {latitude, longitude, date: new Date()}, false);

    const userLogged = Session.get("user");

    const locationController = new LocationController();

    const objectLocation = {
        latitude: latitude,
        longitude: longitude,
        deviceId: device.uuid,
        deviceModel: device.model,
        created_at: DateCustom.getNow(),
        driverId: parseInt(userLogged.idDriver),
        tripReference: !Array.isArray(Session.get("tripDriver")) ? Session.get("tripDriver").tripReference : null
    };

    locationController.insert(objectLocation);
}

function verifyMinTimeLocation(time) {
    const now = new Date;

    const last = new Date(Session.get("lastPositionDriver").date);

    const seconds = now.getTime() - last.getTime();

    return seconds >= time;
}

function requestPermissionLocation() {
    if (!controllerMeter.isRequestPosition)
        cordova.plugins.locationAccuracy.isRequesting(function (requesting) {
            if (!requesting)
                cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
                    if (canRequest) {
                        cordova.plugins.locationAccuracy.request(function (success) {
                            controllerMeter.isRequestPosition = true;
                        }, function (error) {
                            console.error("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
                            if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                                if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                                    cordova.plugins.diagnostic.switchToLocationSettings();
                                }
                            }
                        }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                    } else {
                        // request location permission and try again
                    }
                });
        });
}

function enableMapController(controller) {
    const elementProperty = new ElementProperty();
    if (controller) {
        //mapService.positionDriver.setRotation(mapService.map.getCameraBearing());
        //mapService.map.setCameraBearing(0);
        mapService.setControllerMap(controller);
        elementProperty.addClass(".move-map", "active");
        elementProperty.addClass(".footer-race", "controller-map");

    } else {
        const rotation = mapService.positionDriver.getRotation() === 0 ?
            mapService.map.getCameraBearing() :
            (mapService.positionDriver.getRotation() + mapService.map.getCameraBearing());

        mapService.setControllerMap(controller);
        elementProperty.removeClass(".move-map", "active");
        elementProperty.removeClass(".footer-race", "controller-map");
        mapService.map.moveCamera({
            target: mapService.positionDriver.getPosition(),
            bearing: rotation,
            zoom: mapService.zoom,
        }, () => {
        });

        mapService.positionDriver.setRotation(0);
    }
}

(function verifyGPSActive() {
    if (window.mapService)
        if (mapService.isStartMap)
            positionLocation.verifyGps().catch(() => {
                SwalCustom.messageDialog("", "Por favor, habilite o seu gps !");
                //setTimeout(verifyGPSActive, 10000);
            });
})();