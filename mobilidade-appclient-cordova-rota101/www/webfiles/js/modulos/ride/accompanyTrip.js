viewController.setObserver("accompany-trip", () => {
    const mapService = new MapService();
    const tripRepository = new TripRepository();
    let socket = null;
    let trip = null;

    setTimeout(() => {
        getInfoTrip();
        tripRepository.getTrip(Session.get("tripReferenceRide"), () => {
            getInfoTrip();
        })
    }, 2000);

    function getInfoTrip() {
        TripController.get(Session.get("tripReferenceRide")).then(({data}) => {
            updateInfoTrip(data);
        })
    }

    mapService.initMap("mapAccompanyTrip", {lat: 0, lng: 0}, () => {
        mapService.map.setMyLocationEnabled(false);
        mapService.map.setPadding(50, 20, 350, 20);
    });

    Position.getCurrentPosition((position) => {
        getConfigCityByPosition({lat: position.coords.latitude, lng: position.coords.longitude});
    });

    viewController.elementProperty.addEventInElement("#backMoreRoute", "onclick", function () {
        Route.backPage();
    });


    function updateInfoTrip(data) {
        viewController.elementProperty.getElement(".profile-driver-ride", element => {
            element.style.backgroundImage = `url(${data.driver.profilePicture})`
        });

        document.querySelector("#nameDriverRide").innerHTML = data.driver.name;

        viewController.elementProperty.addClass(".content-info-accompany-trip", "active");

        let init = !(data.status === STATUS_ACCEPTED || data.status === STATUS_BOARDING);

        let locations = `<li class="${init ? "done" : "active"}"><p>${data.origin.address}</p></li>`;

        let isLastPlace = true;

        let isFindWayPoint = false;

        locations += data.tripWayPoints.map(item => {
            isLastPlace = item.confirmed;

            if (item.confirmed == false) {
                if (!isFindWayPoint) {
                    isFindWayPoint = true;
                    return `<li class="${init && (item.confirmed == true ? "done" : "active")}"><p>${item.address}</p></li>`;
                }
            }

            return `<li class="${init && (item.confirmed == true ? "done" : "")}"><p>${item.address}</p></li>`;
        }).join("");

        locations += `<li class="${isLastPlace == true && "active"}"><p>${data.destination.name}</p></li>`;

        locations += ` <li class="view-more-route"><p>Ver mais</p></li>`;

        document.querySelector("#ridePlaces").innerHTML = locations;

        viewController.elementProperty.addEventInElement(".view-more-route", "onclick", function () {
            Route.startClassesInComponent([{component: ".content-info-accompany-trip", class: "open"}],
                () => {
                    viewController.elementProperty.removeClass(".content-info-accompany-trip", "open");
                })
        });

        viewController.elementProperty.addEventInElement("#openChatRide", "onclick", () => {
            viewController.elementProperty.removeClass("#openChatRide", "active");
            viewController.elementProperty.removeClass(".option-item-tab", "active");
            viewController.elementProperty.addClass("#enableShareTripApp", "active");

            viewController.addParams("chat-trip-selected-rider", {
                userId: Session.getValueInSession("user", "idUser"),
                driver: data.driver,
                trip: data
            });
            Route.redirectDynamic("Ride", "ChatSelected");
        });

        trip = data;

        (new ChatRepository()).getCurrentMessagesRider(trip.tripReference, Session.getValueInSession("user", "idUser"), (result) => {
            result.filter(({item}) => {
                return item.customerUserId == Session.getValueInSession("user", "idUser");
            }).map(({item}) => {
                if (!item.viewed && item.userId != Session.getValueInSession("user", "idUser"))
                    viewController.elementProperty.addClass("#openChatRide", "active");
            })
        });

        const positionWait = getDestination(trip);

        mapService.checkMapLoad(() => {
            mapService.addPointClientWait(positionWait);
            updateMapTripDriver();
        });

        if (trip.status === STATUS_FINISHED) {
            showReceiptFinished(trip);
            /*SwalCustom.messageDialog("", "Viagem finalizada com sucesso", () => {
                viewController.elementProperty.removeClass(".btn-accompany-trip", "active");
                Session.delete("tripReference");
                Route.backPage();
            }, "success")*/
        }
    }

    viewController.onBack(() => {
        viewController.elementProperty.removeClass(".content-info-accompany-trip", "active");

        tripRepository.close();

        if (socket)
            socket.disconnect();
    });

    function showReceiptFinished(trip) {
        viewController.elementProperty.removeClass(".btn-accompany-trip", "active");
        Session.delete("tripReferenceRide");
        let total = 0;

        document.querySelector("#listRidersTravel").innerHTML = trip.ride.riders.filter((rider) => {
            return rider.userId == Session.getValueInSession("user", "idUser");
        }).map(rider => {
            total += parseFloat(trip.price);

            return `<li>
            <p>
                <span>Nome:</span>
                <span>${rider.name}</span>
            </p>
            <p>
                <span>Embarque:</span>
                <span>${rider.waypoints[0].address}</span>
            </p>
            <p>
                <span>Desembarque:</span>
                <span>${rider.waypoints[1].address}</span>
            </p>
        </li>`;
        });

        viewController.elementProperty.addEventInElement("#closeTravelReceipt", "onclick", function () {
            Route.backPage();
            viewController.elementProperty.removeClass(".container-shared-travel-receipt", "active");
        });

        document.querySelector("#totalTravelRide").innerHTML = `${CityConfig.getTypeCoin()} ${Mask.maskMoney(total)}`;

        viewController.elementProperty.addClass(".container-shared-travel-receipt", "active");
    }

    function getConfigCityByPosition(position) {
        CityController.getConfigByPosition(position).then(({status, data}) => {
            if (!status)
                return;

            Session.set("cityConfig", data);
        });
    }


    function updateMapTripDriver() {
        const cityConfig = Session.get("cityConfig");

        if (socket != null)
            socket.disconnect();

        socket = io.connect(`${environment.hosts.hostSocket}${cityConfig.configDriverLocation.port_url}`,
            {query: `tripReference=${Session.get("tripReferenceRide")}`});

        if (!Array.isArray(Session.get("positionDriverTripRide")))
            drawerDriverInMap(Session.get("positionDriverTripRide"));

        socket.on(`location-${Session.get("tripReferenceRide")}`, function (result) {
            if (!result)
                return;

            if (Array.isArray(Session.get("tripReferenceRide")))
                return;

            Session.set("positionDriverTripRide", result);

            drawerDriverInMap(result);
        });
    }

    function drawerDriverInMap(result) {
        mapService.runEventForeground("update_map_trip_driver", () => {

            const {position, polyline} = result;

            const positionWait = getDestination(trip);

            if (trip.status === STATUS_PRE_ACCEPTED) {
                if (result.waypoint)
                    mapService.createWaypointInfoPreAccepted(result.waypoint);
            } else {
                mapService.clearWaypointInfoPreAccepted();
            }

            mapService.showTimeArrival(positionWait, result.time);

            mapService.updateRouteInMap(positionWait, position, polyline, trip.driver.iconMapDriver);

            setTimeout(() => {
                mapService.zoomBetweenPoints(false);
            }, 1000)
        });
    }

    function getDestination(trip) {
        if (
            trip.status === STATUS_ACCEPTED ||
            trip.status === STATUS_BOARDING ||
            trip.status === STATUS_PRE_ACCEPTED
        )
            return {
                lat: parseFloat(trip.origin.latitude),
                lng: parseFloat(trip.origin.longitude)
            };
        if (trip.status === STATUS_IN_PROGRESS) {
            let waypoint = trip.tripWayPoints.find((waypoint) => {
                return waypoint.confirmed == false;
            });

            if (waypoint != null)
                return {lat: parseFloat(waypoint.latitude), lng: parseFloat(waypoint.longitude)};

            return {
                lat: parseFloat(trip.destination.latitude),
                lng: parseFloat(trip.destination.longitude)
            };
        }
    }
});
