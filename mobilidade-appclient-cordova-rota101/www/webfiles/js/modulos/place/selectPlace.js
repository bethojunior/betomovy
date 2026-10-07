let timeOutUpdatePrice = null;

function clearFieldAddressById(id) {
    if (trip[id]) trip[id] = null;

    viewController.elementProperty.getElement("#" + id, element => {
        const pathTrip = element.getAttribute("id");

        element.value = "";
        element.focus();

        switch (pathTrip) {
            case "origin": {
                trip[pathTrip] = null;
                mapService.removePointClient();
                break;
            }
            case "destination": {
                trip[pathTrip] = null;
                mapService.removePointDestination();
                break;
            }
            default: {
                const code = pathTrip.split("-")[1];
                trip.waypoints[code] = null;
            }
        }
    });
}

function sortTimePhrase() {
    const pharses = [
        "Localizando o motorista mais próximo de você",
        "Estamos quase encontrando seu motorista",
        "Calculando melhor rota"
    ];

    const pharse = {};

    pharse[Math.floor(Math.random() * 20 + 50)] = pharses[0];
    pharse[Math.floor(Math.random() * 20 + 100)] = pharses[1];
    pharse[Math.floor(Math.random() * 20 + 160)] = pharses[2];

    Session.set("timePhrase", pharse);
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
        waypoint = trip.tripWayPoints.find((waypoint) => {
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

window.setPlaceSelect = (place, path) => {
    viewController.elementProperty.getElement(`#${path}`, element => {
        element.value = place.address;
    });

    place.latitude = parseFloat(place.latitude);
    place.longitude = parseFloat(place.longitude);

    getPoint(place, path);
};

function updateLocation() {
    Position.getPosition(position => {
        Session.set(
            "location",
            {lat: position.coords.latitude, lng: position.coords.longitude}
        );
    });
}

function createPointCustomer(position) {
    mapService.pointCustomer = mapService.makeMarker(
        {lat: position.coords.latitude, lng: position.coords.longitude},
        mapService.map,
        {
            url: "webfiles/img/svg/customer.png",
            size: {
                width: 20,
                height: 20
            }
        }
    );

    if (!mapService.inRoute)
        setZoomInPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
}

function setZoomInPosition(position) {
    if (mapService.map != null) {
        mapService.map.animateCamera({
            target: position,
            zoom: 18,
            duration: 500
        });
    }
}

function getPoint(place, pathTrip) {
    const position = {
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude),
        type: place.type
    };

    if (trip[pathTrip] !== undefined) trip[pathTrip] = position;

    switch (pathTrip) {
        case "origin": {
            priceTrip.setPlace(place);
            mapService.addPointClient(position);
            break;
        }
        case "destination": {
            mapService.addPointDestination(position);
            break;
        }
        default: {
            const code = pathTrip.split("-")[1];

            trip.waypoints[code] = {
                lat: position.lat,
                lng: position.lng,
                neighborhood: place.neighborhood,
                address: document.getElementById(pathTrip).value
            };
        }
    }

    validateLocales(pathTrip);
}

function validateLocales(lastInputId) {
    if (!validateAddressWayPoints()) {
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

    if (trip.origin == null) return document.getElementById("origin").focus();

    let emptyWaypoint = null;

    const isWaypointsFill =
        Object.keys(trip.waypoints).filter(item => {
            if (trip.waypoints[item] === null && emptyWaypoint == null)
                emptyWaypoint = item;

            return trip.waypoints[item] === null;
        }).length === 0;

    if (emptyWaypoint != null)
        return viewController.elementProperty.getElement(
            `#waypoint-${emptyWaypoint}`,
            element => {
                element.focus();
            }
        );

    if (trip.destination == null)
        return document.getElementById("destination").focus();

    if (isWaypointsFill) {
        const user = Session.get("user");

        if (
            user.idPartner == null ||
            user.partnerRegisterStatusId !== STATUS_ACTIVE
        ) {
            calculatePriceCustomer();
            return;
        }

        whatIsTheTypeOfCustomer();
    }
}

function whatIsTheTypeOfCustomer() {
    viewController.elementProperty.removeClass(".container-logo", "active");
    viewController.elementProperty.removeClass(".history-trips", "active");
    viewController.elementProperty.addClass(".modal-type-customer", "active");

    viewController.elementProperty.addEventInElement(
        ".option-type-customer",
        "onclick",
        function () {
            const value = this.getAttribute("value");

            trip.typeCustomerInTrip = value;

            if (value === "forMe") {
                calculatePriceCustomer();
            }

            if (value === "forAnother") {
                document.getElementById("nameAnotherCustomer").value = "";
                document.getElementById("phoneAnotherCustomer").value = "";

                Mask.setMaskPhone("#phoneAnotherCustomer");

                viewController.elementProperty.addClass(
                    ".modal-type-customer",
                    "form-customer"
                );
                viewController.elementProperty.addClass(".edit-price", "active");
                viewController.elementProperty.addEventInElement(
                    "#nextCalculatePriceAnotherCustomer",
                    "onclick",
                    calculatePriceAnotherCustomer
                );
                viewController.elementProperty.addEventInElement(
                    "#btnEditPrice",
                    "onclick",
                    openEditPrice
                );

                document.getElementById("nameAnotherCustomer").focus();
            }
        }
    );

    viewController.elementProperty.addEventInElement(
        ".modal-type-customer",
        "onclick",
        function () {
            verifyListTripActivePartner();
            initProcessingCallTrip();
            managerTripViewCurrent.isVisible = true;
        }
    );

    viewController.elementProperty.addEventInElement(
        ".container-modal-type-customer",
        "onclick",
        function (event) {
            event.stopPropagation();
        }
    );
}

function calculatePriceAnotherCustomer() {
    const nameAnotherCustomer = document.getElementById("nameAnotherCustomer");
    const phoneAnotherCustomer = document.getElementById("phoneAnotherCustomer");

    if (nameAnotherCustomer.value.trim().length === 0) {
        SwalCustom.messageDialog(
            "",
            "Informe o nome do cliente",
            () => {
                nameAnotherCustomer.focus();
            },
            "info"
        );
        return;
    }

    if (phoneAnotherCustomer.value.trim().length === 0) {
        SwalCustom.messageDialog(
            "",
            "Informe o telefone do cliente",
            () => {
                phoneAnotherCustomer.focus();
            },
            "info"
        );
        return;
    }

    if (!validatePhoneAnotherCustomerTrip(phoneAnotherCustomer.value)) {
        SwalCustom.messageDialog(
            "",
            "Numero informado está inválido!",
            () => {
                phoneAnotherCustomer.focus();
            },
            "info"
        );
        return;
    }

    calculatePriceCustomer("forAnother");
}

function validatePhoneAnotherCustomerTrip(phone) {
    const regex = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
    return regex.test(phone);
}

function calculatePriceCustomer(typeCalculatePrice = "forMe", noDestination = false) {
    viewController.elementProperty.removeClass(".modal-type-customer", "active");
    viewController.elementProperty.removeClass(
        ".modal-type-customer",
        "form-customer"
    );

    const waypoints = Object.keys(trip.waypoints).map(item => {
        return trip.waypoints[item];
    });

    Keyboard.hide();

    removePanelHistoryTrip();

    document.getElementById("origin").disabled = true;
    document.getElementById("destination").disabled = true;
    viewController.elementProperty.removeClass(".container-logo", "active");

    managerTrip.paymentFormIdSelected = showPaymentForm();

    priceTrip.typeDriverSelected = null;

    clearTimeout(timeOutUpdatePrice);

    Session.set("typeCalculatePrice", typeCalculatePrice);

    viewController.elementProperty.removeClass(".text-cancellation-fee", "active");

    (function calculatePrice() {
        priceTrip
            .showPriceTrip(trip.origin, trip.destination, waypoints, typeCalculatePrice, noDestination)
            .then(data => {
                checkOptionDefaultActive(data);

                managerTrip.prices = data.prices;

                viewController.elementProperty.addEventInElement(
                    ".trip-type",
                    "onclick",
                    getTaxiType
                );

                showRoute(waypoints, data);

                timeOutUpdatePrice = setTimeout(() => {
                    if (document.querySelector(".footer-container-trip").classList.contains("active"))
                        calculatePrice();
                }, 2000 * 60);
            });
    })();
}

function checkOptionDefaultActive(data) {
    data.prices.map((object, index) => {
        if (index === 0) {
            if (document.querySelector(".trip-type") != null)
                document.querySelector(".trip-type").classList.add("active");

            managerTrip.typeTaxi.tripTypeId = object.tripTypeId;
            managerTrip.typeTaxi.priceId = object.idPrice;
            managerTrip.typeTaxi.price = object.price;
            managerTrip.typeTaxi.priceName = object.priceName;
            managerTrip.typeTaxi.cashback = object.cashback;
            managerTrip.typeTaxi.multiplierPriceDynamic = object.priceDynamicValue;
            managerTrip.typeTaxi.tripType = object.tripType;
        }
    });
}

function showRoute(waypoints, dataRoute) {
    initCloseTrip();

    viewController.elementProperty.getElement(".container-logo", element => {
        element.classList.add("remove");
    });

    if (mapService.map != null)
        mapService.map.setPadding(70, 20, 320, 20);

    viewController.elementProperty.getElement(
        ".btn-cancel-processing-trip",
        element => {
            element.classList.add("active");
        });

    viewController.elementProperty.getElement(
        ".footer-container-trip",
        element => {
            element.classList.add("active");
        });

    mapService.showRoute(
        trip.origin,
        trip.destination,
        waypoints,
        dataRoute.overview_polyline.points
    );

    setTimeout(() => {
        managerUpdateTrip.searchingCars.map((point) => {
            point.setVisible(false);
        });
    }, 2000);

    const km = dataRoute.distance.toFixed(1).replace(".", ",");

    Session.set("distanceTrip", dataRoute.distance);
    Session.set("estimatedTripTime", dataRoute.duration);

    viewController.elementProperty.getElement(".container-km-trip", element => {
        element.innerHTML = km + " km";
    });

    createInfoPrices(dataRoute.prices, dataRoute.label_info);

    viewController.elementProperty.getElement("#labelTitlePrice", element => {
        element.innerHTML = dataRoute.label_info.title_trip_types;
    });

    const addressOrigin = document.getElementById("origin").value;
    const addressDestination = document.getElementById("destination").value;

    mapService.addLegends(addressOrigin, addressDestination, dataRoute.duration).then(() => {
        if (mapService.infoOrigin)
            mapService.infoOrigin.on(plugin.google.maps.event.MARKER_CLICK, function () {
                editLocalOriginSelected();
            });
        if (mapService.infoDestination)
            mapService.infoDestination.on(plugin.google.maps.event.MARKER_CLICK, function () {
                mapService.removePointDestination();
                trip.destination = null;
                changeDestination();
                initCloseTrip();
                mapService.polylineRoute.remove();
                mapService.polylineRoute = null;
                mapService.removeOnlyRoute();
                managerTrip.recalculatedTrip = null;
                viewController.elementProperty.removeClass(
                    ".container-info-details-price",
                    "active"
                );
                viewController.elementProperty.removeClass(".edit-price", "active");
            });
    });
}

function editLocalOriginSelected(){
    mapService.removePointClient();
    trip.origin = null;
    changeOrigin();
    initCloseTrip();
    mapService.polylineRoute.remove();
    mapService.polylineRoute = null;
    mapService.removeOnlyRoute();
    managerTrip.recalculatedTrip = null;
    viewController.elementProperty.removeClass(
        ".container-info-details-price",
        "active"
    );
    viewController.elementProperty.removeClass(".edit-price", "active");
}

function getPositions(element) {
    const $element = element.getBoundingClientRect();
    const width = $element.width;
    const height = $element.height;
    return [
        [$element.x, $element.x + width],
        [$element.y, $element.y + height]
    ];
}

function comparePositions(p1, p2) {
    let x1 = p1[0] < p2[0] ? p1 : p2;
    let x2 = p1[0] < p2[0] ? p2 : p1;
    return x1[1] > x2[0] || x1[0] === x2[0];
}

function checkCollisionsLegends() {
    let elementDestination = document.querySelector(".container-destination");
    let positionDestination = getPositions(elementDestination);

    const positionOrigin = getPositions(
        document.querySelector(".container-origin")
    );
    const horizontalMatch = comparePositions(
        positionOrigin[0],
        positionDestination[0]
    );
    const verticalMatch = comparePositions(
        positionOrigin[1],
        positionDestination[1]
    );
    const match = horizontalMatch && verticalMatch;

    if (match) {
        viewController.elementProperty.addClass(".container-destination", "active");
        viewController.elementProperty.addClass(".container-origin", "active");
    } else {
        viewController.elementProperty.removeClass(
            ".container-destination",
            "active"
        );
        viewController.elementProperty.removeClass(".container-origin", "active");
    }
}

function createInfoPrices(prices, labelInfo) {
    viewController.elementProperty.addEventInElement(
        "#openInfoReturn",
        "onclick",
        function () {
            viewController.elementProperty.addClass("", "active");
            Route.startClassesInComponent(
                [{component: ".container-info-details-price", class: "active"}],
                () => {
                    viewController.elementProperty.removeClass(
                        ".container-info-details-price",
                        "active"
                    );
                },
                COMPONENT_CREATE_TRIP
            );
        }
    );

    viewController.elementProperty.addEventInElement(
        ".close-detail-price",
        "onclick",
        function () {
            Route.backPage();
        }
    );

    viewController.elementProperty.getElement("#infoLabelReturn", element => {
        element.innerHTML = `<p>${labelInfo.title_trip_types}</p>
            <span>${labelInfo.description_trip_types}</span>`;
    });

    viewController.elementProperty.getElement("#listDetailPrice", element => {
        element.innerHTML = prices
            .map(price => {
                return `<li>
                <div class="logo-price" style="background-image: url('${price.picture}')"></div>
                <div class="info-price">
                    <p>${price.priceName}</p>
                    <span>${price.description}</span>
                </div>
            </li>`;
            })
            .join("");
    });
}

function localSelected(place, input) {
    getPoint(place, input.getAttribute("id"));
}

function localCurrent() {
    trip.origin = Session.get("location");

    mapService.addPointClient(trip.origin);

    mapService.getAddressByLatLng(trip.origin).then(getAddressCurrent);

    viewController.elementProperty.addEventInElement(
        "#origin",
        "onblur",
        function () {
            setTimeout(function () {
                if (trip.origin === null) return;

                mapService.getAddressByLatLng(trip.origin).then(getAddressCurrent);
            }, 1500);
        }
    );
}

const managerPlaceStop = {
    amount: 0
};

viewController.elementProperty.addEventInElement(
    ".add-place-stop",
    "onclick",
    function () {
        if (managerPlaceStop.amount === trip.amountWaypoints) return;

        const code = new Date().getTime();

        trip.waypoints[code] = null;

        trip.amountWaypoints++;

        if (managerPlaceStop.amount === trip.amountWaypoints)
            this.style.display = "none";

        $("#containerInputDestination")
            .before(`<div id="place${code}" class="container-waypoint-search">
                    <input type="text" id="waypoint-${code}"
                           class="col s12 input-custom validate-phone search-address-location"
                           placeholder="${getTextTranslate("home", "placeholder-where-to")}">
                    <label for="waypoint-${code}"></label>
                    <i class="material-icons clear-input" for="waypoint-${code}">cancel</i>
                    <i class="material-icons remove-place" value="${code}">close</i>
                </div>`);

        initEventSearchPlace();

        viewController.elementProperty.getElement("#formPassenger",element=>{
            element.scrollTo(0,element.scrollHeight);
        });
    }
);

function showCustomerBySearching({data}) {
    viewController.elementProperty.getElement(
        "#containerCustomerPlaces",
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
                        //Session.set(`city-${Session.get("lastInputSearch")}`, placeSelected.cityId);
                        return getPoint(placeSelected, Session.get("lastInputSearch"));
                    }

                    mapService
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
                            placeSelected.type = placeDetail.type;

                            getPoint(placeSelected, Session.get("lastInputSearch"));
                        });
                }
            );
        }
    );
}

function initEventSearchPlace() {
    viewController.elementProperty.getElement(
        ".search-address-location",
        element => {
            mapService.addSearchInInput(
                element,
                ({data}) => {
                    if (data == null)
                        return viewController.elementProperty.addClass(
                            "#containerCustomerPlaces",
                            "empty"
                        );

                    if (data.length === 0) return updateInfoPlaces();

                    showCustomerBySearching({data});
                },
                () => {
                    trip[Session.get("currentInputAddress")] = null;
                    viewController.elementProperty.removeClass(
                        "#containerCustomerPlaces",
                        "empty"
                    );
                    document.getElementById("containerCustomerPlaces").innerHTML = "";
                },
                trip.origin
            );
        }
    );

    viewController.elementProperty.addEventInElement(
        ".remove-place",
        "onclick",
        function () {
            const code = this.getAttribute("value");

            viewController.elementProperty.getElement(`#place${code}`, element => {
                element.remove();
                delete trip.waypoints[code];
                trip.amountWaypoints--;
                viewController.elementProperty.getElement(
                    ".add-place-stop",
                    element => {
                        element.style = "";
                    }
                );
            });
        }
    );

    viewController.elementProperty.addEventInElement(
        ".clear-input",
        "onclick",
        ({srcElement}) => {
            clearFieldAddressById(srcElement.getAttribute("for"));
        }
    );
    //viewController.elementProperty.addEventInElement(".search-address-location", "oninput", verifyFieldAddress);
    viewController.elementProperty.addEventInElement(
        ".search-address-location",
        "onfocus",
        showPanelHistoryTrip
    );
}

function validateAddressWayPoints() {
    let address = document.getElementById("origin").value;

    for (let index in trip.waypoints) {
        const waypoint = trip.waypoints[index];

        if (waypoint === null) {
            address = false;
            continue;
        }

        if (address === waypoint.address && address) return false;

        address = waypoint.address;
    }

    const destination = document.getElementById("destination").value;

    return !(destination === address && address);
}

let timeoutAnimation = null;
let makesAnimation = {
    origin: null,
    destination: null,
    route: null,
    infoOrigin: null,
    infoDestination: null,
    isActive: false,
};

function animationPlacesMap(enable, trip = null) {

    if (mapService.isBackground)
        return mapService.runEventForeground("animation_map_searching", () => animationPlacesMap(enable, trip));

    if (makesAnimation.isActive && enable)
        return;

    makesAnimation.isActive = enable;

    clearValuesAnimationSearching();

    if (!enable || trip == null)
        return;

    const positionOrigin = {lat: parseFloat(trip.origin.latitude), lng: parseFloat(trip.origin.longitude)};
    const positionDestination = {
        lat: parseFloat(trip.destination.latitude),
        lng: parseFloat(trip.destination.longitude)
    };

    makesAnimation.origin = mapService.makeMarker(positionOrigin, mapService.map);

    makesAnimation.destination = mapService.makeMarker(positionDestination, mapService.map);

    const points = plugin.google.maps.geometry.encoding.decodePath(Session.get("findPolylineSearch"));

    if (!mapService.isBackground)
        makesAnimation.route = mapService.map.addPolyline({
            'points': points,
            'color': '#000000',
            'width': 2,
            'geodesic': true,
            'clickable': false
        });

    createInfoPopUpSearching(trip.origin.address, positionOrigin, "origin-searching-animation").then(marker => {
        makesAnimation.infoOrigin = marker;
    });

    createInfoPopUpSearching(trip.destination.name, positionDestination, "destiny-searching-animation").then(marker => {
        makesAnimation.infoDestination = marker;
    });

    mapService.map.setPadding(70, 20, 230, 20);

    (function loopAnimation(index) {
        if (mapService.isBackground)
            return;

        if (!makesAnimation.isActive)
            return;

        const positions = [];

        const element = document.querySelector("#iconFindDriver");

        switch (index) {
            case 1: {
                document.querySelector("#pharseTrip").innerHTML = getTextTranslate("home", "text-boarding");
                element.style.backgroundImage = `url('webfiles/img/svg/find-1.svg')`;
                positions.push(positionOrigin);
                index++;
                break;
            }

            case 2: {
                document.querySelector("#pharseTrip").innerHTML = getTextTranslate("home", "text-your-route");
                element.style.backgroundImage = `url('webfiles/img/svg/find-2.svg')`;
                positions.push(positionOrigin);
                positions.push(...positions);
                positions.push(positionDestination);
                index++;
                break;
            }

            case 3: {
                document.querySelector("#pharseTrip").innerHTML = getTextTranslate("home", "text-landing");
                element.style.backgroundImage = `url('webfiles/img/svg/find-3.svg')`;
                positions.push(positionDestination);
                index++;
                break;
            }

            case 4: {
                document.querySelector("#pharseTrip").innerHTML = getTextTranslate("home", "text-find-driver");
                element.style.backgroundImage = `url('webfiles/img/svg/find-4.svg')`;
                positions.push(positionOrigin);
                positions.push(...positions);
                positions.push(positionDestination);
                index++;
                break;
            }
        }

        mapService.map.animateCamera({
            target: positions,
            duration: 2500,
            padding: 60,
        });

        if (index > 4)
            return;

        timeoutAnimation = setTimeout(() => loopAnimation(index), 5500);
    })(1);
}

function clearValuesAnimationSearching() {
    clearTimeout(timeoutAnimation);

    timeoutAnimation = null;
    mapService.inRoute = true;

    mapService.removeRoute();

    mapService.map.setPadding(50, 20, 20, 20);

    makesAnimation.origin = removeMarkerMapSearching(makesAnimation.origin);
    makesAnimation.destination = removeMarkerMapSearching(makesAnimation.destination);
    makesAnimation.route = removeMarkerMapSearching(makesAnimation.route);
    makesAnimation.infoOrigin = removeMarkerMapSearching(makesAnimation.infoOrigin);
    makesAnimation.infoDestination = removeMarkerMapSearching(makesAnimation.infoDestination);
}

function removeMarkerMapSearching(marker) {
    if (marker != null) {
        marker.setVisible(false);
        marker = null;
    }

    return null;
}

function createInfoPopUpSearching(label, position, className) {
    return new Promise(resolve => {
            mapService.createPopupCustom(`<div class="popup-custom-origin ${className}">
                                <span>${label}</span>
                            </div>`, {query: `.${className}`},
                (url) => {
                    resolve(mapService.makeMarker(position, mapService.map, {
                        url,
                        size: {width: 150, height: 40},
                        anchor: [75, 90]
                    }, 1));

                    document.querySelector(`.${className}`).remove();
                });
        }
    )
}
