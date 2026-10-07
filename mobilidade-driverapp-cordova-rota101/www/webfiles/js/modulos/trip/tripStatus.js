function checkStatusTrip(trip) {

    switch (trip.status) {
        case "accepted": {
            return {
                callback: informArrival,
                message: getTextTranslate("trip", "message-status-trip-accepted"),
                status: getTextTranslate("trip", "status-trip-accepted")
            };
        }
        case "boarding": {
            return {
                callback: initTrip,
                message: getTextTranslate("trip", "message-status-trip-boarding"),
                status: getTextTranslate("trip", "status-trip-boarding")
            };
        }
        case "in_progress": {
            const waypoints = trip.tripWayPoints.filter(waypoint => {
                return waypoint.confirmed == "0"
            });

            if (waypoints.length > 0) {
                return {
                    callback: confirmStop,
                    message: getTextTranslate("trip", "message-status-trip-in-progress-waypoint"),
                    status: getTextTranslate("trip", "status-trip-in-progress-waypoint")
                }
            }


            return {
                callback: finishTrip,
                message: getTextTranslate("trip", "message-status-trip-in-progress"),
                status: getTextTranslate("trip", "status-trip-in-progress")
            };
        }
        case "finished" : {
            return {callback: false, message: false};
        }
        default: {
            return null;
        }
    }
}

function emitDriverLocationOnStatusChange() {
    if (typeof emitDriverLocation === "function") {
        emitDriverLocation();
        return;
    }

    if (typeof Position === "undefined" || typeof Position.getCurrentMap !== "function") {
        return;
    }

    Position.getCurrentMap().then(({lat, lng}) => {
        Session.set("lastPositionDriver", {latitude: lat, longitude: lng, date: new Date()}, false);
        Session.set("lastPosition", {lat, lng, date: new Date()}, false);

        if (typeof socketConnection === "undefined" || socketConnection == null) {
            return;
        }

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
            driverId: parseInt(Session.getValueInSession("user", "idDriver")),
            userTypeId: userTypeId || null,
            cityId: cityId || null,
            status: status || null,
        });
    }).catch(() => {
        // Sem ação: evita quebrar fluxo caso falhe a leitura do GPS.
    });
}

function informArrival(trip) {

    const meter = new Position().getDistanceLocation(Session.get("lastPosition"),
        {lat: parseFloat(trip.origin.latitude), lng: parseFloat(trip.origin.longitude)})

    if (meter > 100) {
        SwalCustom.dialogConfirm(getTextTranslate("trip","out-of-fate-inform-arrival"), "",
            status => {
                if (!status) {
                    errorChangeStatus(false);
                    return;
                }
                showArrivalDriver(trip);
            });
        return;
    }
    showArrivalDriver(trip);

}

function showArrivalDriver(trip) {
    const driverController = new DriverController();

    PreloadRequest.progress(getTextTranslate("trip","progress-confirm-arrival-driver"));

    driverController.informArrival(trip.tripReference).then((result) => {
        if (!result.status)
            throw result.message;

        PreloadRequest.success(getTextTranslate("trip","success-customer-arrival"));

        //InfoClientTrip.showArrivalClient(trip);
        responseStatusTrip(result);

        if (result.data.paymentInfo !== undefined) {
            Session.set("paymentInfo", result.data.paymentInfo);
            return;
        }

        Session.delete("paymentInfo");

    }).catch(errorChangeStatus);
}

function initTrip(trip) {
    const driverController = new DriverController();

    PreloadRequest.progress(getTextTranslate("trip","progress-init-trip"));

    driverController.initTrip(trip.tripReference).then((data) => {
        if (!data.status)
            throw data.message;

        PreloadRequest.success(getTextTranslate("trip","success-init-trip"));
        responseStatusTrip(data);

        customerWaitTime.stop();

        const elementProperty = new ElementProperty();

        const trip = data.data;

        if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER && trip.status === STATUS_IN_PROGRESS) {
            createLayoutInTrip(true);
        }

        if (trip.tripCallTypeId === TRIP_CALL_CORPORATE || trip.tripCallTypeId === TRIP_CALL_RIDE)
            return;

        if (ConfigGeneral().get("lite_map_option") == false)
            elementProperty.addClass(".footer-race", "minimize");

        verifyPositionPreAvailable()
    }).catch(errorChangeStatus);
}

function finishTrip(trip) {
  if (trip.deliveryInfo != null)
    if (!Array.isArray(trip.deliveryInfo))
      showInfoDeliveryPlace(trip.deliveryInfo.obsDestination);

  if (trip.centralId) {
    if (trip.haveReturn == true)
      if (ConfigGeneral().get("end_trip_only_by_central") == true) {
        return SwalCustom.messageDialog(
          "Viagem só pode ser finalizar pela central de origem",
          "Atenção",
          () => {
            document
              .querySelector("#btnChangeStatusTrip")
              .classList.remove("active");
          }
        );
      }
  }

  const recalculate = verifyRecalculateFare();

  if (recalculate != null && trip.isOffer == "0") {
    const cityConfig = Session.get("cityConfig");

    if (cityConfig.enableChoicePriceTripRecalculation == true) {
      return showChoiceCheckoutTrip(recalculate, trip);
    } else {
      return applyTravelCalculation(recalculate, trip);
    }
  }

  finalizeTrip(trip);
}

function finalizeTrip(trip) {
  const driverController = new DriverController();
  const tripReference = trip.tripReference;

  // Sincroniza o objeto trip com o que está na sessão antes de abrir o modal
  // Isso evita que o modal apareça com preço antigo se abrir antes do FinishTrip responder
  try {
    const sessionTrip = Session.get("tripDriver");
    if (!Array.isArray(sessionTrip)) {
      if (sessionTrip?.price && parseFloat(sessionTrip.price) !== parseFloat(trip.price)) {
        trip.price = String(sessionTrip.price);
      }
      if (sessionTrip?.recalculatedPrice) {
        trip.recalculatedPrice = Object.assign({}, trip.recalculatedPrice || {}, sessionTrip.recalculatedPrice);
      }
    }
  } catch (e) {
    console.error("Falha ao sincronizar preço no finalizeTrip", e);
  }

  PreloadRequest.progress(getTextTranslate("trip", "progress-finish-trip"));

  try {
    return driverController
      .finishTrip(tripReference)
      .then((result) => {
        if (!result.status) {
          PreloadRequest.clear();
          return SwalCustom.messageDialog(
            result.message,
            "Atenção",
            clearDataTrip
          );
        }

        return IfoodController.verify(tripReference)
          .then((ifoodResult) => {
            return { tripResult: result, ifoodResult };
          })
          .catch((err) => {
            return { tripResult: result, ifoodResult: { code: false } };
          });
      })
      .then(({ tripResult, ifoodResult }) => {
        if (ifoodResult?.code) {
          localStorage.setItem("deliveryModalVisible", "true");
          localStorage.setItem("tripReference", tripReference);

          const ifoodCode = new IfoodCode();
          ifoodCode.onCodeValidated = () => {
            responseStatusTrip(tripResult);
            const userLogged = Session.get("user");
            const refusedDriverController = new RefusedDriverController();
            refusedDriverController
              .findCustomersBlockedMe(userLogged.idDriver)
              .then((customerResult) => {
                if (customerResult?.status) {
                  Session.set("customersBlockedMe", customerResult.data);
                }
              });
          };
          ifoodCode.setDetail(tripReference);

          return Promise.resolve();
        } else {
          responseStatusTrip(tripResult);
          const userLogged = Session.get("user");
          const refusedDriverController = new RefusedDriverController();
          return refusedDriverController
            .findCustomersBlockedMe(userLogged.idDriver)
            .then((r) => {
              if (r?.status) Session.set("customersBlockedMe", r.data);
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        finishTripOffline();
      });
  } catch (e) {
    console.error("Error", e);
    finishTripOffline();
  }
}

function confirmStop() {
    const trip = Session.get("tripDriver");

    const waypoints = trip.tripWayPoints.filter(waypoint => {
        return waypoint.confirmed === "0"
    });

    PreloadRequest.progress(getTextTranslate("trip","progress-confirm-stop"));

    const waypoint = waypoints[0];

    if (waypoint.obs)
        showInfoDeliveryPlace(waypoint.obs);

    DriverController.confirmWaypoint(waypoint.id).then((data) => {
        if (!data.status) {
            SwalCustom.messageDialog(data.message, "Atenção", clearDataTrip);
            return
        }

        PreloadRequest.success(getTextTranslate("trip","success-confirm-stop"));
        responseStatusTrip(data);
        showDataTrip();
        // updateTripDriver();
        initConfigLocation();

    }).catch(errorChangeStatus);
}

function showInfoDeliveryPlace(obs) {
    if (obs == null)
        return;

    const element = document.querySelector("#obsDeliveryCurrent");

    if (element)
        element.innerHTML = obs;

    Route.startClassesInComponent([{component: ".container-observation-delivery", class: "active"}], () => {
        viewController.elementProperty.removeClass(".container-observation-delivery", "active");
    });

    viewController.elementProperty.addEventInElement("#btnNextObservationDelivery", "onclick", () => {
        Route.backPage();
    })
}

function finishTripOffline() {
    const trip = Session.get("tripDriver");

    trip.status = STATUS_FINISH_TRIP;

    trip.position = Session.get("lastPositionDriver");

    trip.dateFinish = DateCustom.getNow();

    Session.set("tripFinish", trip);

    modalFinishTrip(trip);
}

const responseStatusTrip = result => {
    if (!result.status)
        return SwalCustom.messageDialog(result.message, "Atenção", clearDataTrip);


    Session.set("tripDriver", result.data);

    const trip = Session.get("tripDriver");

    if (trip.status === STATUS_FINISH_TRIP) {
        const userLogged = Session.get("user");
        userLogged.status = "disponivel";
        Session.set("user", userLogged);
        emitDriverLocationOnStatusChange();
    } else {
        emitDriverLocationOnStatusChange();
    }

    mapService.removeRoute();

    updateRoute(true);

    const objectStatus = checkStatusTrip(trip, true);

    if (objectStatus.callback == null)
        if (errorStatusTrip(objectStatus))
            return;

    updateWaypoints();

    if (!objectStatus.callback)
        return modalFinishTrip(trip);

    changeStatusNameTrip(objectStatus.message, objectStatus.status);
};

function modalFinishTrip(trip) {

    const userLogged = Session.get("user");

    TripController.removeTripRoute(trip.tripReference).then(result => console.log(result));

    FinishTrip.show(trip, clearDataTrip).then(() => {
        backInitZoom();

        changeStatusNameTrip("", getTextTranslate("trip","success-finish-trip"));

        userLogged.status = "disponivel";

        Session.set("user", userLogged);
    });
}

let updateRouteTimeOut = null;

function updateRoute(initTrip = false) {
    clearTimeout(updateRouteTimeOut);

    if (Array.isArray(Session.get("lastPosition")))
        return updateRouteTimeOut = setTimeout(() => updateRoute(), 1500);

    const userLogged = Session.get("user");

    if (userLogged.status !== "corrida")
        return;

    if (!Array.isArray(Session.get("tripFinish")))
        return;

    const endPosition = getLastPosition(initTrip);
    const startPosition = Session.get("lastPosition");

    updateNavigateRoute(startPosition, initTrip);

    let waypoints = [];

    const trip = Session.get("tripDriver");

    if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER && trip.status === STATUS_IN_PROGRESS)
        return;

    if (trip.status === initTripStatus)
        waypoints = trip.tripWayPoints.filter((waypoint) => {
            return waypoint.confirmed === "0";
        }).map(({latitude: lat, longitude: lng}) => {
            return {lat, lng};
        });

    if (initTrip)
        mapService.removeRoute();

    if (waypoints.length > 0) {
        endPosition.lat = waypoints[0].lat;
        endPosition.lng = waypoints[0].lng;
    }

    mapService.setOrigin(startPosition);
    mapService.setDestination(endPosition);
    mapService.setWaypoints(waypoints);
    mapService.pathPolyline = [];

    clearTimeout(mapService.timeErrorCalcRoute);

    mapService.calculateAndDisplayRoute();

    if (userLogged.preAvailableTrip != null) {
        updateDataPreAccept();
    } else {
        Session.delete("preAvailableTrip");
    }
}

function updateDataPreAccept() {
    const user = Session.get("user");

    TripController.actionGet(user.preAvailableTrip.tripReference).then(({data}) => {
        Session.set("preAvailableTrip", data);
        mapService.updateRouteTripPreAccept(Session.get("lastPosition"), data);
    });
}

function errorChangeStatus(message = true) {
    const trip = Session.get("tripDriver");

    const objectStatus = checkStatusTrip(trip);

    if (errorStatusTrip(objectStatus))
        return;

    mapService.notUpdatePolyline = false;

    PreloadRequest.clear();

    if (!message)
        return changeStatusNameTrip(objectStatus.message, objectStatus.status);

    SwalCustom.messageDialog('', `${getTextTranslate("trip","message-change-status-error")} '${objectStatus.message}'`, () => {
        changeStatusNameTrip(objectStatus.message, objectStatus.status);
    }, "info");
}

function openAppForeground() {
    cordova.plugins.backgroundMode.disable();

    cordova.plugins.backgroundMode.wakeUp();
    cordova.plugins.backgroundMode.unlock();

    if (cordova.plugins.backgroundMode.isActive())
       cordova.plugins.backgroundMode.moveToBackground();

    window.plugins.bringtofront();
    cordova.plugins.backgroundMode.moveToForeground();
}
