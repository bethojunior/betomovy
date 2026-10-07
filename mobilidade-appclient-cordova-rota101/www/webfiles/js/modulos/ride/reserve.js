const managerPassengersRoute = {
    elementRideChosen: null,
    passengers: [],
    mapService: null
};

function openScreenReserveTrip(route) {
    TripController.get(route.ride.tripReference).then(({data: trip}) => {
        let boarding = "";
        let landing = "";

        trip.tripWayPoints.filter(item => {
            return item.confirmed == false;
        }).map(item => {
            if (item.pitStopTypeName === "DESEMBARQUE") {
                landing += `<label>
                        <input type="radio" name="unloading" value='${JSON.stringify(item)}'>
                        ${item.tag}<i class="material-icons show-address-info" address="${item.address}">info</i>
                    </label>`;
            } else {
                boarding += `<label>
                        <input type="radio" name="boarding" value='${JSON.stringify(item)}'>
                        ${item.tag}<i class="material-icons  show-address-info" address="${item.address}">info</i>
                    </label>`;
            }
        });

        document.querySelector("#optionBoarding").innerHTML = trip.status === STATUS_IN_PROGRESS ? boarding :
            `<label>
           <input type="radio" name="boarding" value='${JSON.stringify(route.origin)}'>
            ${route.origin.tag}<i class="material-icons show-address-info" address="${route.origin.address}">info</i>
        </label>` + boarding;


        if (route.allowCustomerStops == true)
            document.querySelector("#optionBoarding").innerHTML += `<label class="another-boarding-place">Embarcar em outro local</label>`;

        document.querySelector("#optionUnloading").innerHTML =
            landing + `<label>
           <input type="radio" name="unloading" value='${JSON.stringify(route.destination)}'>
            ${route.destination.tag}<i class="material-icons show-address-info" address="${route.destination.address}">info</i>
        </label>`;

        viewController.elementProperty.addEventInElement(".show-address-info", "onclick", function (event) {
            event.stopPropagation();
            navigator.notification.alert(this.getAttribute("address"), () => {
            }, "Informações sobre endereço")
        });

        initAnotherBoardingPlace(trip, route);
    });

    if (!managerPassengersRoute.mapService) {
        managerPassengersRoute.mapService = new MapService();
        setTimeout(() => {
            managerPassengersRoute.mapService.initMap("showMapRoute", {
                lat: route.origin.latitude,
                lng: route.origin.longitude
            }, () => {
                initEventMaps();
            });
        }, 1000);
    } else {
        initEventMaps();
    }


    Route.startClassesInComponent(
        [
            {component: ".container-home-routes", class: "hide"},
            {component: ".another-views", class: "active"},
            {component: ".container-detail-travel", class: "active"}
        ],
        () => {
            if (updateListRoutes)
                updateListRoutes();
            managerPassengersRoute.mapService.map.clear();
            viewController.elementProperty.removeClass(
                ".container-home-routes",
                "hide"
            );
            viewController.elementProperty.removeClass(
                ".another-views",
                "active"
            );
            viewController.elementProperty.removeClass(
                ".container-detail-travel",
                "active"
            );
        },
        REQUEST_ROUTE
    );

    function initEventMaps() {
        const pointPolyline = managerPassengersRoute.mapService.map.addPolyline({
            'points': plugin.google.maps.geometry.encoding.decodePath(route.defaultLayout),
            'color': '#000000',
            'width': 5,
            'geodesic': true,
            'clickable': false
        });

        managerPassengersRoute.mapService.map.setMyLocationEnabled(false);
        managerPassengersRoute.mapService.map.setClickable(false);
        managerPassengersRoute.mapService.map.setPadding(10, 10, 200, 10);

        managerPassengersRoute.mapService.makeMarker({
            lat: route.origin.latitude,
            lng: route.origin.longitude
        }, managerPassengersRoute.mapService.map, {
            url: "webfiles/img/icon/place-origin.png",
            size: {width: 20, height: 20}
        });

        managerPassengersRoute.mapService.makeMarker({
            lat: route.destination.latitude,
            lng: route.destination.longitude
        }, managerPassengersRoute.mapService.map, {
            url: "webfiles/img/icon/place-destination.png",
            size: {width: 20, height: 20}
        });

        route.routeWayPoints.map(item => {
            managerPassengersRoute.mapService.makeMarker({
                lat: item.latitude,
                lng: item.longitude
            }, managerPassengersRoute.mapService.map, {
                url: item.routePitStopTypeId == "1" ? "webfiles/img/icon/place-origin.png" : "webfiles/img/icon/place-destination.png",
                size: {width: 20, height: 20}
            });
        });

        setTimeout(() => {
            managerPassengersRoute.mapService.map.animateCamera({
                target: pointPolyline.getPoints().getArray(),
                duration: 1000,
                padding: 60,
            });
        }, 3000);
    }

    Mask.setMaskCpf("#documentAnotherRide");
    document.querySelector("#valueRouteSchedule").innerHTML = Mask.maskMoney(parseFloat(route.ride.price));
    document.querySelector(".type-coin").innerHTML = CityConfig.getTypeCoin();
    document.querySelector("#nameRoute").innerHTML = route.name;

    let boarding = "";
    let landing = "";

    route.routeWayPoints.map(item => {
        if (item.routePitStopType === "DESEMBARQUE") {
            landing += `<label>
                        <input type="radio" name="unloading" value='${JSON.stringify(item)}'>
                        ${item.tag}<i class="material-icons show-address-info" address="${item.address}">info</i>
                    </label>`;
        } else {
            boarding += `<label>
                        <input type="radio" name="boarding" value='${JSON.stringify(item)}'>
                        ${item.tag}<i class="material-icons  show-address-info" address="${item.address}">info</i>
                    </label>`;
        }
    });


    document.querySelector("#optionBoarding").innerHTML =
        `<label>
           <input type="radio" name="boarding" value='${JSON.stringify(route.origin)}'>
            ${route.origin.tag}<i class="material-icons show-address-info" address="${route.origin.address}">info</i>
        </label>` + boarding;

    document.querySelector("#optionUnloading").innerHTML =
        `<label>
           <input type="radio" name="unloading" value='${JSON.stringify(route.destination)}'>
            ${route.destination.tag}<i class="material-icons show-address-info" address="${route.destination.address}">info</i>
        </label>` + landing;

    viewController.elementProperty.addEventInElement(".show-address-info", "onclick", function (event) {
        event.stopPropagation();
        navigator.notification.alert(this.getAttribute("address"), () => {
        }, "Informações sobre endereço")
    });

    document.querySelector("#nameRoute").innerHTML = route.name;


    viewController.elementProperty.addEventInElement(".dispatch-something", "onclick", () => {
        Route.startClassesInComponent(
            [
                {component: ".container-passenger-travel", class: "hide"},
            ], () => {
                viewController.elementProperty.removeClass(".container-passenger-travel", "hide");
            }, REQUEST_ROUTE
        );
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement("#btnAmountPeopleConfirmation", "onclick", () => checkAmountPeople(route));

    viewController.elementProperty.addEventInElement("#btnNextPaymentFormRoute", "onclick", function () {
        if (managerPassengersRoute.passengers.filter((item) => {
            if (item.userId == null) {
                return item.name.trim().length === 0;
            }

            return false;
        }).length > 0)
            return SwalCustom.messageDialog("", "Informe os dados do passageiros");

        initSelectPaymentFormRoute(route);
    });

    initEventAmountPeople(route);

}

function initEventSearchLocalCustomerStop(callback) {
    document.querySelector("#listAddressCustomerLocal").innerHTML = "";
    document.querySelector("#addressCustomerStop").value = "";

    Route.startClassesInComponent(
        [{component: ".container-local-customer-stop", class: "active"}],
        () => {
            viewController.elementProperty.removeClass(".container-local-customer-stop", "active")
        });

    const element = document.querySelector("#addressCustomerStop");

    element.focus();

    MapService.searchInInput(element, (response) => {
        document.querySelector("#listAddressCustomerLocal").innerHTML = response.data.map(item => {
            return `<li class="select-place-customer-stop" value='${JSON.stringify(item)}'>
                        <img src="webfiles/img/svg/local.svg">
                        <span>${item.address}</span>
                    </li>`;
        }).join("");

        viewController.elementProperty.addEventInElement(".select-place-customer-stop", "onclick", function () {
            callback(JSON.parse(this.getAttribute("value")));
            Route.backPage();
        });
    });
}

function optionCustomerStops(route, className, type) {
    //if (route.allowCustomerStops == false)
    //    return ``;
    return `<label class="local-customer-stop ${className}">
                <input type="radio" name="${type}" value="">
                <span id="descriptionPlace${type}">Meu Local</span>
                <span>&nbsp;</span>
            </label>`;
}

function initEventAmountPeople(route) {
    let amountPeople = document.querySelector("#amountPeople");

    let elementValueTravel = document.querySelector(".value-travel");

    const value = parseFloat(route.ride.price);

    viewController.elementProperty.addEventInElement(".remove-person-reserve", "onclick", () => {
        if (amountPeople.value <= 1)
            return;

        amountPeople.value = parseInt(amountPeople.value) - 1;

        elementValueTravel.innerHTML = Mask.maskMoney(amountPeople.value * value);
    });

    viewController.elementProperty.addEventInElement(".add-person-reserve", "onclick", () => {
        if (amountPeople.value >= (parseInt(route.ride.seatsAvailable) - route.ride.riders.length))
            return;

        amountPeople.value = parseInt(amountPeople.value) + 1;

        elementValueTravel.innerHTML = Mask.maskMoney(amountPeople.value * value);
    });
}

function justOneCustomer(route) {
    choiceTypeRide(route);
}

function checkAmountPeople(route) {
    managerPassengersRoute.passengers = [];
    managerPassengersRoute.elementRideChosen = null;

    let amountPeople = parseInt(document.querySelector("#amountPeople").value);

    let list = '';

    for (let i = 0; i < amountPeople; i++) {
        managerPassengersRoute.passengers.push({name: "", waypoints: [], anotherPlace: null});
        const passenger = managerPassengersRoute.passengers[i];
        list += `<li class="add-ride-info" index="${i}">
                    <div class="picture-image-ride"></div>
                    <div>
                        <span>${passenger.userId ? Session.getValueInSession("user", "nameUser") : passenger.name}</span>
                        <span>${passenger.waypoints[0] ? passenger.waypoints[0].address : ""}</span>
                        <span>${passenger.waypoints[1] ? passenger.waypoints[1].address : ""}</span>
                    </div>
                    <i class="material-icons">keyboard_arrow_right</i>
                </li>`;
    }

    document.querySelector("#listRidesRoute").innerHTML = list;

    viewController.elementProperty.addEventInElement(".add-ride-info", "onclick", function () {
        managerPassengersRoute.elementRideChosen = this;
        choiceTypeRide(route);
    });

    showListRides();
}

function choiceTypeRide(route) {
    viewController.elementProperty.addClass(".choice-type-customer", "active");
    viewController.elementProperty.removeClass(".another-name-customer", "active");
    viewController.elementProperty.removeClass(".type-ride-chosen", "active");

    Route.startClassesInComponent(
        [
            {component: ".container-list-ride", class: "minimize"},
            {component: ".container-add-ride", class: "active"},
        ], () => {
            viewController.elementProperty.removeClass(".container-list-ride", "minimize");
            viewController.elementProperty.removeClass(".container-add-ride", "active");
        },
        ADD_DATA_RIDE_ROUTE
    );

    viewController.elementProperty.addEventInElement(".type-ride-chosen", "onclick", function () {
        viewController.elementProperty.removeClass(".type-ride-chosen", "active");
        this.classList.add("active");
    });

    viewController.elementProperty.addEventInElement("#btnNextTypeChoice", "onclick", () => {
        const element = document.querySelector(".type-ride-chosen.active");

        if (element == null)
            return SwalCustom.messageDialog("", "Informe para quem é essa viagem");

        if (element.getAttribute("type") === "another") {
            const content = document.querySelector(".another-name-customer");
            if (content.classList.contains("active")) {
                if (document.querySelector("#nameAnotherRide").value.length <= 0)
                    return SwalCustom.messageDialog("", "Informe o nome do passageiro");
                if (!ValidateForm.validateCpf(document.querySelector("#documentAnotherRide").value.replace(/\D/g, '')))
                    return SwalCustom.messageDialog("", "CPF está inválido");
            } else {
                document.querySelector("#nameAnotherRide").value = "";
                document.querySelector("#documentAnotherRide").value = "";
                viewController.elementProperty.removeClass(".choice-type-customer", "active");
                Route.startClassesInComponent(
                    [
                        {component: ".another-name-customer", class: "active"},
                    ], () => {
                        viewController.elementProperty.addClass(".choice-type-customer", "active");
                        viewController.elementProperty.removeClass(".another-name-customer", "active");
                    },
                    REQUEST_ROUTE
                );
                return;
            }
        } else {
            document.querySelector("#nameAnotherRide").value = Session.getValueInSession("user", "nameUser");
            document.querySelector("#documentAnotherRide").value = Session.getValueInSession("user", "document");
        }

        getLocalBoardingAndLanding(route);
    });
}

function showListRides() {
    Route.startClassesInComponent(
        [
            {component: ".container-list-ride", class: "active"},
        ], () => {
            viewController.elementProperty.removeClass(".container-passenger-travel", "hide-active");
            viewController.elementProperty.removeClass(".container-list-ride", "active");
            viewController.elementProperty.removeClass(".count-passenger-travel", "active");
        },
        REQUEST_ROUTE
    );
}


function getLocalBoardingAndLanding(route) {
    viewController.elementProperty.removeClass(".animation-images-boarding", "active");
    viewController.elementProperty.removeClass("#optionUnloading", "active");
    viewController.elementProperty.addClass("#optionBoarding", "active");

    document.querySelector("#typeLocalReserve").innerHTML = "Embarque";

    viewController.elementProperty.addEventInElement(".boarding-stop", "onclick", () => {
        initEventSearchLocalCustomerStop((place) => {
            document.querySelector("input[name='boarding']").checked = true;
            document.querySelector("#descriptionPlaceboarding").innerHTML = place.address;
        });
    });

    viewController.elementProperty.addEventInElement(".unloading-stop", "onclick", () => {
        initEventSearchLocalCustomerStop((place) => {
            document.querySelector("input[name='unloading']").checked = true;
            document.querySelector("#descriptionPlaceunloading").innerHTML = place.address;
        });
    });


    Route.startClassesInComponent(
        [
            {component: ".container-add-ride", class: "minimize"},
            {component: ".container-passenger-travel", class: "hide-active"},
            {component: ".container-boarding-unloading", class: "active"},
        ], () => {
            viewController.elementProperty.removeClass(".container-passenger-travel", "hide-active");
            viewController.elementProperty.removeClass(".container-boarding-unloading", "active");
            viewController.elementProperty.removeClass(".container-add-ride", "minimize");
        },
        ADD_DATA_RIDE_ROUTE
    );

    viewController.elementProperty.addEventInElement("#btnNextLocal", "onclick", () => {
        if (!document.querySelector("input[name='boarding']:checked"))
            return SwalCustom.messageDialog("", "Selecione um endereço de embarque", undefined, "info");
        initUnloadingReserve();
    });
}

function initUnloadingReserve(anotherBoardingPlace = null) {
    document.querySelector("#typeLocalReserve").innerHTML = "Desembarque";
    document.querySelector("#optionBoarding").classList.remove("active");

    Route.startClassesInComponent(
        [
            {component: ".animation-images-boarding", class: "active"},
            {component: "#optionUnloading", class: "active"},
        ], () => {
            viewController.elementProperty.removeClass(".animation-images-boarding", "active");
            viewController.elementProperty.removeClass("#optionUnloading", "active");
            viewController.elementProperty.addClass("#optionBoarding", "active");

            document.querySelector("#typeLocalReserve").innerHTML = "Embarque";

            viewController.elementProperty.addEventInElement("#btnNextLocal", "onclick", () => {
                if (!document.querySelector("input[name='boarding']:checked"))
                    return SwalCustom.messageDialog("", "Selecione um endereço de embarque", undefined, "info");
                initUnloadingReserve();
            });
        },
        ADD_DATA_RIDE_ROUTE
    );

    viewController.elementProperty.addEventInElement("#btnNextLocal", "onclick", () => {

        if (!document.querySelector("input[name='unloading']:checked"))
            return SwalCustom.messageDialog("", "Selecione um endereço de desembarque", undefined, "info");

        let amountPeople = parseInt(document.querySelector("#amountPeople").value);

        Route.removeGroupComponent(ADD_DATA_RIDE_ROUTE);
        viewController.elementProperty.addClass("#optionBoarding", "active");
        viewController.elementProperty.removeClass(".animation-images-boarding", "active");
        viewController.elementProperty.removeClass(".container-add-ride", "minimize", "active");
        viewController.elementProperty.removeClass("#optionUnloading", "active");
        viewController.elementProperty.removeClass(".container-list-ride", "minimize");
        viewController.elementProperty.removeClass(".container-boarding-unloading", "active");

        //if (amountPeople === 1)
        //    return initSelectPaymentFormRoute(route);

        viewController.elementProperty.removeClass(".container-passenger-travel", "hide-active");

        const item = managerPassengersRoute.passengers[managerPassengersRoute.elementRideChosen.getAttribute("index")];

        const boarding = anotherBoardingPlace ? null : JSON.parse(document.querySelector("input[name='boarding']:checked").value);
        const landing = JSON.parse(document.querySelector("input[name='unloading']:checked").value);

        item.waypoints = [
            {
                address: anotherBoardingPlace ? anotherBoardingPlace.place.address : boarding.address,
                latitude: anotherBoardingPlace ? parseFloat(anotherBoardingPlace.place.latitude) : parseFloat(boarding.latitude),
                longitude: anotherBoardingPlace ? parseFloat(anotherBoardingPlace.place.longitude) : parseFloat(boarding.longitude),
                routePitStopTypeId: anotherBoardingPlace ? 1 : boarding.routePitStopTypeId || 1
            },
            {
                address: landing.address,
                latitude: parseFloat(landing.latitude),
                longitude: parseFloat(landing.longitude),
                routePitStopTypeId: landing.routePitStopTypeId || 2
            }
        ];

        if (anotherBoardingPlace) {
            item.waypoints[0].tag = anotherBoardingPlace.tag;
            item.afterPlace = anotherBoardingPlace.afterPlace;
        }

        const element = document.querySelector(".type-ride-chosen.active");


        if (element.getAttribute("type") === "another") {
            delete item.userId;
            item.name = document.querySelector("#nameAnotherRide").value;
            item.document = document.querySelector("#documentAnotherRide").value;
        } else {
            item.userId = Session.getValueInSession("user", "idUser");
            delete item.name;
        }

        managerPassengersRoute.elementRideChosen.classList.add("active");

        managerPassengersRoute.elementRideChosen.innerHTML = `<div class="picture-image-ride"></div>
                    <div>
                        <span>${item.userId ? Session.getValueInSession("user", "nameUser") : item.name}</span>
                        <span>${anotherBoardingPlace ? anotherBoardingPlace.place.address : item.waypoints[0].address}</span>
                        <span>${item.waypoints[1].address}</span>
                    </div>
                    <i class="material-icons">keyboard_arrow_right</i>`
    });

}

function initSelectPaymentFormRoute(route) {
    document.querySelector("#typeLocalReserve").innerHTML = "Forma de pagamento";

    document.querySelector("#optionBoarding").classList.remove("active");
    document.querySelector("#optionUnloading").classList.remove("active");
    Route.startClassesInComponent([
        {component: ".container-list-ride", class: "minimize"},
        {component: ".container-passenger-travel", class: "hide-active"},
        {component: ".container-boarding-unloading", class: "active"},
        {component: ".container-payment-form-route", class: "active"},
        {component: ".animation-images-boarding", class: "hidden"}
    ], () => {
        document.querySelector("#optionBoarding").classList.add("active");
        viewController.elementProperty.removeClass(".container-list-ride", "minimize");
        viewController.elementProperty.removeClass(".animation-images-boarding", "active");
        viewController.elementProperty.removeClass(".container-payment-form-route", "active");
        viewController.elementProperty.removeClass(".container-boarding-unloading", "active");
        viewController.elementProperty.removeClass(".container-passenger-travel", "hide-active");

    }, REQUEST_ROUTE);

    viewController.elementProperty.addEventInElement(".remove-ticket-screen", "onclick", clearRequestRoute);

    viewController.elementProperty.addEventInElement("#btnNextLocal", "onclick", () => {
        if (document.querySelector(".item-payment-route.active") == null)
            return SwalCustom.messageDialog("", "Informe a forma de pagamento");
        preload(true);

        CustomerRideController.request({
            tripReference: route.ride.tripReference,
            value: parseFloat(route.ride.price) * managerPassengersRoute.passengers.length,
            tripPaymentFormId: document.querySelector(".item-payment-route.active").getAttribute("value"),
            riderTripCustomers: managerPassengersRoute.passengers
        }).then(({status, message, data}) => {
            if (!status)
                return SwalCustom.messageDialog("", message, () => {
                }, status ? "success" : "info");

            if (updateListRoutes)
                updateListRoutes();

            showTicketRoute(route, data);
        }).finally(() => {
            preload(false);
        })
    });
}

function clearRequestRoute() {
    Route.removeGroupComponent(REQUEST_ROUTE);
    viewController.elementProperty.removeClass(".container-ticket-trip", "active");
    viewController.elementProperty.removeClass(".container-boarding-unloading", "active");
    viewController.elementProperty.removeClass(".container-payment-form-route", "active");
    viewController.elementProperty.removeClass(".animation-images-boarding", "hidden", "active");
    viewController.elementProperty.addClass("#optionBoarding", "active");
    viewController.elementProperty.removeClass(".container-passenger-travel", "active", "hide-active");
    viewController.elementProperty.removeClass(".count-passenger-travel", "active");
    viewController.elementProperty.removeClass(".container-home-routes", "hide");
    viewController.elementProperty.removeClass(".another-views", "active");
    viewController.elementProperty.removeClass(".container-detail-travel", "active");
    viewController.elementProperty.removeClass(".container-list-ride", "active", "minimize");
    viewController.elementProperty.removeClass(".container-add-ride", "active", "minimize");
    document.querySelector("#amountPeople").value = "1"
}


function getMonthRoute(index) {
    const listMonth = [
        "Jan.", "Fev.", "Març.", "Abri.", "Mai.", "Jun.", "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."
    ];

    return listMonth[index];
}

function getWeekDay(index) {
    const listDay = [
        "Domingo", "Senguda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
    ];

    return listDay[index];
}


function showTicketRoute(route, data) {
    document.querySelector("#listTicketUser").innerHTML = managerPassengersRoute.passengers.map((item) => {
        return `<li class="content-ticket">
            <div class="header-ticket">
                <p>
                    <i class="material-icons">calendar_today</i>
                    <small>${new Date(route.ride.schedule).toLocaleString()}</small>
                </p>
                <ul>
                    ${item.waypoints.map((point, index) => {
            let type = point.routePitStopTypeId === "1" ? "Embarque" : "Desembarque";
            return `<li>
                                    <small>${type}</small>
                                    <h4>${point.address}</h4>
                                </li>`;
        }).join("")}
                </ul>
            </div>
            <div class="divider-ticket"></div>
            <div class="collapsible-ticket">
                <div class="body-ticket">
                    <ul>
                        <li>
                            <small>Horário Inicial</small>
                            <p>${new Date(route.ride.schedule).toLocaleTimeString()}</p>
                        </li>
                        <li>
                            <small>Valor</small>
                            <p>${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(route.price))}</p>
                        </li>
                    </ul>
                </div>
                <div class="footer-ticket">
                    <small>Passageiro</small>
                    <div>
                        <div></div>
                        <p>${item.name != null ? item.name : Session.getValueInSession("user", "name")}</p>
                    </div>
                </div>
            </div>
        </li>`
    }).join("");

    viewController.elementProperty.addEventInElement(".content-ticket", "onclick", function () {
        if (this.classList.contains("active")) {
            this.classList.remove("active")
        } else {
            this.classList.add("active")
        }
    })

    Route.startClassesInComponent(
        [
            {component: ".container-ticket-trip", class: "active"},
        ], () => {
            clearRequestRoute();
        },
        REQUEST_ROUTE
    );
}
