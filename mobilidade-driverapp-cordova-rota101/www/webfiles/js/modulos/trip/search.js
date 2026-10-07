const searchTripProgress = new Progress();

const tripQuestion = new TripQuestion();

function handleSearchTrip({ data, type }) {
    if (!tripRealtime) return;
    if (type === tripRealtime.typeAdded || type === tripRealtime.typeModified) {
        if (tripQuestion.isActive) return;

        const userLogged = Session.get("user");
        const lastPosition = Session.get("lastPosition");

        const driverId = parseInt(userLogged.idDriver);

        const location = !Array.isArray(lastPosition)
            ? locationIsUpdated(lastPosition.date)
                ? null
                : {
                      latitude: lastPosition.lat,
                      longitude: lastPosition.lng,
                      date: lastPosition.date,
                  }
            : null;

        const driverController = new DriverController();

        const listTripsDenied = getTripDenied();

        driverController.searchTrip(driverId, listTripsDenied, location).then((result) => {
            if (!result.status) {
                updateTripDriver();
                return;
            }

            if (result.data.length > 0) {
                openAppForeground();

                let object = result.data[0];
                Session.set("trip", object);

                tripQuestion.setDetail(getDetailDriver);
            }
        });
    }

    if (type === tripRealtime.typeRemoved) {
        if (tripQuestion.tripReference === data.tripReference) {
            tripQuestion.closeQuestion();
        }
    }
}

function searchTripByRealtime() {
    if (!tripRealtime) {
        searchTripByRequest();
        return;
    }
    const userLogged = Session.get("user");
    searchTripProgress.stopProgress();
    tripRealtime.searchTrip(userLogged.idDriver, handleSearchTrip);
}

function searchTripByRequest() {
    if (searchTripProgress.isRun) return;

    if (tripQuestion.isActive) return;

    searchTripProgress.stopProgress();

    let isSearchTrip = false;

    searchTripProgress.progressUndefined(
        (time) => {
            // TODO: Remover este comentario definitivamente.
            // Viagem em tempo real definidao fora do looping.
            //
            // const cityConfig = Session.get("cityConfig");

            // if (cityConfig.status_realtime_database) {
            //     searchTrip();
            //     searchTripProgress.stopProgress();
            //     return;
            // }

            const userLogged = Session.get("user");
            const driverController = new DriverController();

            if (isSearchTrip) return;

            const listTripsDenied = getTripDenied();

            if (userLogged.status !== "disponivel" && userLogged.preAvailable === "0") {
                searchTripProgress.stopProgress();
                return;
            }

            const lastPosition = Session.get("lastPosition");

            const location = !Array.isArray(lastPosition)
                ? locationIsUpdated(lastPosition.date)
                    ? null
                    : {
                          latitude: lastPosition.lat,
                          longitude: lastPosition.lng,
                          date: lastPosition.date,
                      }
                : null;

            /*if(location != null) {
            Session.set("lastPositionDriver",location);
        }*/

            isSearchTrip = true;

            driverController
                .searchTrip(parseInt(userLogged.idDriver), listTripsDenied, location)
                .then((result) => {
                    isSearchTrip = false;

                    if (!result.status) {
                        searchTripProgress.stopProgress();
                        //SwalCustom.messageDialog(result.message,"Atenção",()=>{},"info");
                        updateTripDriver();
                        return;
                    }

                    if (result.data.length > 0) {
                        openAppForeground();

                        let object = result.data[0];

                        Session.set("trip", object);

                        tripQuestion.setDetail(getDetailDriver);

                        searchTripProgress.stopProgress();
                    }
                })
                .catch((error) => {
                    isSearchTrip = false;
                    searchTripProgress.stopProgress();
                    setTimeout(searchTripByRequest, 1000);
                });
        },
        null,
        3000
    );
}

function locationIsUpdated(date) {
    const last = new Date(Session.getValueInSession("lastPositionDriver", "date"));
    const now = new Date(date);

    const time = (now.getTime() - last.getTime()) / 1000;

    return time < 30;
}

function getTripDenied() {
    const SECONDS_MAX = 90;

    if (Session.get("tripsDeniedDriver").length === 0) return [];

    const list = Session.get("tripsDeniedDriver").filter((trip) => {
        const dateReject = new Date(trip.date);
        const dateNow = new Date();

        return Math.abs((dateReject.getTime() - dateNow.getTime()) / 1000) < SECONDS_MAX;
    });

    Session.set("tripsDeniedDriver", list);

    return list.map((trip) => {
        return trip.tripReference;
    });
}

/**
 * Função de busca de viagem em tempo real ou por request.
 */
function searchTrip() {
    const cityConfig = Session.get("cityConfig");

    if (!Array.isArray(cityConfig)) {
        if (cityConfig.status_realtime_database && tripRealtime) {
            searchTripByRealtime();
        } else {
            searchTripByRequest();
        }
    }
}
