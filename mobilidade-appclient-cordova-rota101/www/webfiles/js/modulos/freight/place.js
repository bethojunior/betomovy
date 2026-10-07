const positionFreight = {
    originFreight: null,
    destinationFreight: null
};

function initEventSearchPlaceFreight() {
    viewController.elementProperty.getElement(
        ".search-address-location-freight",
        element => {
            globalFreight.mapService.addSearchInInput(
                element,
                ({data}) => {
                    if (data == null)
                        return viewController.elementProperty.addClass(
                            "#containerCustomerPlacesFreight",
                            "empty"
                        );

                    showCustomerBySearchingFreight({data});
                },
                () => {
                    positionFreight[Session.get("currentInputAddress")] = null;
                    viewController.elementProperty.removeClass(
                        "#containerCustomerPlacesFreight",
                        "empty"
                    );
                    document.getElementById("containerCustomerPlacesFreight").innerHTML = "";
                }
            );
        }
    );


    viewController.elementProperty.addEventInElement(
        "clear-input-freight",
        "onclick",
        ({srcElement}) => {
            clearFieldAddressFreightById(srcElement.getAttribute("for"));
        }
    );
    //viewController.elementProperty.addEventInElement(".search-address-location", "oninput", verifyFieldAddress);
    viewController.elementProperty.addEventInElement(
        ".search-address-location-freight",
        "onfocus",
        showPanelHistoryFreight
    );
}

function showPanelHistoryFreight() {

    if (this.select)
        this.select();

    if (this.getAttribute)
        Session.set("currentInputAddress", this.getAttribute("id"));

   // updateInfoPlaces();

    viewController.elementProperty.getElement(".menu-close", element => {
        if (element.classList.contains("open")) {

            viewController.elementProperty.addEventInElement(".search-address-location-freight", "onblur", (e) => {
                Session.set("lastInputSearch", e.srcElement.getAttribute("id"));
            });

            viewController.elementProperty.getElement(".history-trips-freight", element => {
                element.classList.add("active");
            });

            //return;
        }
    });
}

function clearFieldAddressFreightById(id) {

    viewController.elementProperty.getElement("#" + id, element => {
        const pathTrip = element.getAttribute("id");

        element.value = "";
        element.focus();
    });
}



function showCustomerBySearchingFreight({data}) {
    viewController.elementProperty.getElement(
        "#containerCustomerPlacesFreight",
        element => {
            element.innerHTML = data
                .map(place => {
                    return `<li class="local-trip-customer customer-place"
                        place='${JSON.stringify(place)}'>
                            <i class="material-icons">place</i>
                            <div>
                                <span>${place.address}</span>
                                <label>${place.neighborhood || ""}</label>
                            </div>
                        </li>`;
                })
                .join("");

            viewController.elementProperty.addEventInElement(
                ".customer-place",
                "onclick",
                function () {
                    const placeSelected = JSON.parse(this.getAttribute("place"));

                    document.getElementById(Session.get("lastInputSearch")).value =
                        placeSelected.address;

                    if (placeSelected.latitude && placeSelected.longitude) {
                        Session.set(
                            `neighborhood-${Session.get("lastInputSearch")}`,
                            placeSelected.neighborhood || ""
                        );
                        return getPositionFreight(placeSelected, Session.get("lastInputSearch"));
                    }

                    globalFreight.mapService
                        .getDetailPlace(placeSelected.address)
                        .then(({data: placeDetail, status, message}) => {
                            if (!status)
                                return SwalCustom.messageDialog(
                                    "",
                                    message,
                                    () => {
                                        let input = document.querySelector(
                                            `#${Session.get("lastInputSearch")}`
                                        );
                                        input.select();
                                        input.focus();
                                    },
                                    "info"
                                );

                            Session.set(
                                `neighborhood-${Session.get("lastInputSearch")}`,
                                placeDetail.neighborhood || ""
                            );

                            placeSelected.neighborhood = placeDetail.neighborhood;

                            placeSelected.latitude = placeDetail.latitude;
                            placeSelected.longitude = placeDetail.longitude;

                            getPositionFreight(placeSelected, Session.get("lastInputSearch"));
                        });
                }
            );
        }
    );
}


function getPositionFreight(place, pathTrip) {
    const position = {
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude)
    };

    if (positionFreight[pathTrip] !== undefined) positionFreight[pathTrip] = position;

    switch (pathTrip) {
        case "originFreight": {
            globalFreight.priceTrip.setPlace(place);
            globalFreight.mapService.addPointClient(position);
            break;
        }
        case "destinationFreight": {
            globalFreight.mapService.addPointDestination(position);
            break;
        }
    }

    validateLocalesFreight(pathTrip);
}


function validateLocalesFreight(lastInputId) {
    if (!validateAddressFreightWayPoints()) {
        SwalCustom.messageDialog(
            "Endereço já foi informado em sequências",
            "Ops...",
            () => {
                clearFieldAddressById(lastInputId);
            },
            "info"
        );
        return;
    }

    if (positionFreight.originFreight == null) return document.getElementById("originFreight").focus();

    if (positionFreight.destinationFreight == null)
        return document.getElementById("destinationFreight").focus();

    setTimeout(verifyTypeFreight, 500);
}


function validateAddressFreightWayPoints() {
    let address = document.getElementById("originFreight").value;

    const destination = document.getElementById("destinationFreight").value;

    return !(destination === address && address);
}



function showRouteFreight(waypoints, dataRoute) {
    if (globalFreight.mapService.map != null)
        globalFreight.mapService.map.setPadding(70, 20, 300, 20);

    Session.set("findPolylineSearch", dataRoute.overview_polyline.points);

    globalFreight.mapService.showRoute(
        positionFreight.originFreight,
        positionFreight.destinationFreight,
        waypoints,
        dataRoute.overview_polyline.points
    );

    const km = dataRoute.distance.toFixed(1).replace(".", ",");

    Session.set("distanceTrip", dataRoute.distance);
    Session.set("estimatedTripTime", dataRoute.duration);

    viewController.elementProperty.getElement(".container-km-trip", element => {
        element.innerHTML = km + " km";
    });

    //createInfoPrices(dataRoute.prices, dataRoute.label_info);

    //  viewController.elementProperty.getElement("#labelTitlePrice", element => {
    //      element.innerHTML = dataRoute.label_info.title_trip_types;
    //  });

    const addressOrigin = document.getElementById("originFreight").value;
    const addressDestination = document.getElementById("destinationFreight").value;

    // globalFreight.mapService.addLegends(addressOrigin, addressDestination, dataRoute.duration).then(() => {
    //   /*  globalFreight.mapService.infoOrigin.on(plugin.google.maps.event.MARKER_CLICK, function () {
    //         globalFreight.mapService.removePointClient();
    //         positionFreight.originFreight = null;
    //         changeOrigin();
    //         initCloseTrip();
    //         mapService.polylineRoute.remove();
    //         mapService.polylineRoute = null;
    //         mapService.removeOnlyRoute();
    //         managerTrip.recalculatedTrip = null;
    //         viewController.elementProperty.removeClass(
    //             ".container-info-details-price",
    //             "active"
    //         );
    //         viewController.elementProperty.removeClass(".edit-price", "active");
    //
    //     });
    //     mapService.infoDestination.on(plugin.google.maps.event.MARKER_CLICK, function () {
    //         mapService.removePointDestination();
    //         trip.destination = null;
    //         changeDestination();
    //         initCloseTrip();
    //         mapService.polylineRoute.remove();
    //         mapService.polylineRoute = null;
    //         mapService.removeOnlyRoute();
    //         managerTrip.recalculatedTrip = null;
    //         viewController.elementProperty.removeClass(
    //             ".container-info-details-price",
    //             "active"
    //         );
    //         viewController.elementProperty.removeClass(".edit-price", "active");
    //     });*/
    // });
}
