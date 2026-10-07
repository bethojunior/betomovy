const managerBackground = {
    isBackground: false,
    timeoutBackgroundLocation: null,
};

let pendingWidgetOpenAfterOverlayPermission = false;

const SHIPPING_TYPE_SOCKET = "socket";
const SHIPPING_TYPE_HTTP = "http";

function registerResumeListenerForWidget() {
    document.removeEventListener("resume", onResumeWidgetOpen);
    document.addEventListener("resume", onResumeWidgetOpen);
}

function onResumeWidgetOpen() {
    if (!pendingWidgetOpenAfterOverlayPermission)
        return;
    const user = Session.get("user");
    if (Array.isArray(user) || !user || user.status !== "disponivel")
        return;
    pendingWidgetOpenAfterOverlayPermission = false;
    setTimeout(() => {
        executeOpenWidgetFloating();
    }, 500);
}

function clearPendingWidgetOpenAfterOverlayPermission() {
    pendingWidgetOpenAfterOverlayPermission = false;
}


function initConfigLocation() {
    const user = Session.get("user");

    FloatingWidget.stopLocationService();

    if (user.status === "desligado") {
        return;
    }

    const idDriver = parseInt(Session.getValueInSession("user", "idDriver"));

    const objectHTTP = getHTTPSend();

    FloatingWidget.onListenerLocation((location) => {
        const {latitude: lat, longitude: lng} = location;

        Session.set("lastPositionDriver", {latitude: lat, longitude: lng, date: new Date()}, false);
        
        verifyShippingTypeSocket({lat, lng, idDriver});

        trackValueTaximetro({lat, lng});
        Session.set("lastPosition", {lat, lng});

        if (!Array.isArray(Session.get("tripDriver"))) {
            executeCallback(() => {
                const trip = Session.get("tripDriver");
                if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER && trip.status === STATUS_IN_PROGRESS)
                    return;

                if (trip.tripCallTypeId === TRIP_CALL_CORPORATE)
                    return;
                mapService.verifyRoute({lat, lng})
            });
            executeCallback(() => verifyCapturePosition({lat, lng}));
            executeCallback(() => verifyPositionPreAvailable());
        } else {
            setMonitoring(false);
        }
    })

    FloatingWidget.getPermissionLocation(
        () => {
            setTimeout(() => {
                FloatingWidget.startLocationService(objectHTTP);
            },2000)
        }, () => {
        });
}


function executeOpenWidgetFloating() {
    const userLogged = Session.get("user");
    if (Array.isArray(userLogged) || !userLogged)
        return;
    FloatingWidget.open(
        {
            userId: userLogged.idUser,
            driverId: userLogged.idDriver,
            token: userLogged.api_token,
            url: API_HOST
        }, () => {
        }, () => {
        });
}

function openWidgetFloating() {
    const userLogged = Session.get("user");
    if (Array.isArray(userLogged) || !userLogged)
        return;
    pendingWidgetOpenAfterOverlayPermission = true;
    registerResumeListenerForWidget();
    if (typeof FloatingWidget.checkSystemOverlayPermission === "function") {
        FloatingWidget.checkSystemOverlayPermission(({status}) => {
            if (status) {
                pendingWidgetOpenAfterOverlayPermission = false;
                executeOpenWidgetFloating();
                return;
            }
            if (typeof FloatingWidget.getPermission === "function")
                FloatingWidget.getPermission();
            else
                executeOpenWidgetFloating();
        });
        return;
    }
    executeOpenWidgetFloating();
}

function verifyShippingTypeSocket({lat, lng, idDriver}) {

    if (verifyShippingType() !== SHIPPING_TYPE_SOCKET)
        return;

    socketConnection.emit("sendPosition", {
        latitude: lat,
        longitude: lng,
        driverId: idDriver,
        deviceModel: 'fabrica-socket',
        deviceId: "704",
        created_at: DateCustom.getNow(),
        tripReference: !Array.isArray(Session.get("tripDriver")) ? Session.get("tripDriver").tripReference : null
    });
}

function verifyShippingType() {
    const configLocation = Session.get("configLocation");

    if (!Array.isArray(configLocation))
        return configLocation.shippingType || SHIPPING_TYPE_HTTP;

    return SHIPPING_TYPE_HTTP;
}

function getHTTPSend() {
    if (verifyShippingType() !== SHIPPING_TYPE_HTTP)
        return {};

    const idDriver = parseInt(Session.getValueInSession("user", "idDriver"));

    const configLocation = Session.get("configLocation");

    const port = Session.get("configLocation")?.port_url;

    const baseUrl = UrlBuilder.resolveWithPort(API_HOST_LOCATION, port);

    return {
        url: `${baseUrl}${configLocation.path_url || ""}`,
        data: JSON.stringify({
            api_token: Session.getValueInSession('user', 'api_token'),
            deviceModel: 'fabrica',
            deviceId: "704",
            created_at: DateCustom.getNow(),
            driverId: idDriver,
            tripReference: !Array.isArray(Session.get("tripDriver")) ? Session.get("tripDriver").tripReference : null,
        }),
        interval: configLocation.interval,
        fastestInterval: configLocation.fastestInterval
    }
}

function getTimeLocation() {
    const configLocation = Session.get("configLocation");
    const user = Session.get("user");

    if (Array.isArray(configLocation))
        return 10000;

    return user.status === "disponivel" ? configLocation.timeOn : configLocation.timeoff;
}

function changePostTemplate() {
    FloatingWidget.stopLocationService();

    /* setTimeout(() => {
         const objectHTTP = getHTTPSend();

         BackgroundGeolocation.configure({
             ...objectHTTP
         });
         FloatingWidget.getPermissionLocation(
             () => {
                 BackgroundGeolocation.checkStatus(function (status) {
                     // you don't need to check status before start (this is just the example)
                     if (!status.isRunning) {
                         BackgroundGeolocation.start(); //triggers start on start event
                     }
                 });
             }, () => {
             });

     }, 3000)*/
}
