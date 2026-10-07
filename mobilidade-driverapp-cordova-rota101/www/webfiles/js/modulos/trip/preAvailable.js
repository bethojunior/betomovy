const managerPreAvailable = {
    isSearch: false,
    tripReference: null
};

function checkPreAvailable() {
    const elementProperty = new ElementProperty();

    const user = Session.get("user");

    elementProperty.getElement(".option-trip-in-wait", element => {
        const trip = Session.get("preAvailableTripData");
        const tripDriver = Session.get('tripDriver')
        element.onclick = function () {
            viewController.addParams("trip-in-wait", trip.tripReference);
            Route.redirectDynamic("Driver", "TripInWait");
        };

        if (trip.origin) {
            console.log({origin : tripDriver?.origin, destination: trip?.destination})
        mapService.pathPolylinePreAccept = [];
        mapService.addPolyline(
            {
                     lat: Number(tripDriver?.destination?.latitude),
                     lng : Number(tripDriver?.destination?.longitude)
            },

            {
                lat: Number(trip?.origin?.latitude),
                lng : Number(trip?.origin?.longitude)
            },
            trip
                 
                 )
        }

        if (!Array.isArray(trip)) {

            if (trip.tripReference !== managerPreAvailable.tripReference) {
                managerPreAvailable.tripReference = trip.tripReference;
                chatTripWaitRepository.getLastMessageUnread(trip.tripReference, function () {
                    viewController.elementProperty.addClass("#chatTripWait", "notification-chat");
                    viewController.elementProperty.addClass(".option-trip-in-wait", "notification-chat");
                });
            }

            if (!element.classList.contains("active")) {
                element.classList.add("active");

                mapService.pathPolylinePreAccept = [];

                if (trip.origin != null)
                    mapService.updateRouteTripPreAccept(Session.get("lastPosition"), trip);
                verifyTripPreAccepted(trip.tripReference);
            }
            return;
        }

        element.classList.remove("active");
    });

    if ((user.preAvailable === "1" && user.preAvailableTrip === null) && !managerPreAvailable.isSearch) {
        managerPreAvailable.isSearch = true;
        //checkTrip();
        searchTrip();
    }
}

function enablePreAvailable() {
    const user = Session.get("user");

    const trip = Session.get("tripDriver");

    if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER)
        return;

    const existWaypoint = trip.tripWayPoints.filter(waypoint => {
        return waypoint.confirmed === "0"
    }).length > 0;

    if (existWaypoint)
        return;


    if (user.preAvailable === "1") {
        checkPreAvailable();
        return;
    }

    new DriverController().putPreAvailable().then(updateTripDriver);
}