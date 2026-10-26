const managerTripViewCurrent = {
    isVisible: true,
    request: null
};

let searchStatusPollIntervalId = null;

function startSearchStatusPoll(tripReference) {
    stopSearchStatusPoll();

    searchStatusPollIntervalId = setInterval(() => {
        TripRepository.get(tripReference).then(({ status, response }) => {
            if (!status || !response) return;
            if (response.status === STATUS_SEARCHING || response.status === STATUS_SEARCHING_FAVORITE) return;

            checkStatusTrip(response, tripRealtime.typeModified);
        });
    }, 8000);
}

function stopSearchStatusPoll() {
    if (searchStatusPollIntervalId) {
        clearInterval(searchStatusPollIntervalId);
        searchStatusPollIntervalId = null;
    }
}

function verifyTrip(initialTrip) {
    Route.removeGroupComponent(COMPONENT_CREATE_TRIP);

    const tripReference = Session.getLocal("tripReference");
    if (!tripReference || (typeof tripReference === 'string' && tripReference.trim().length === 0) || (Array.isArray(tripReference) && tripReference.length === 0)) return;

    if (!unsubscribeIds.has(tripReference)) {
        subscribeToTrip(tripReference);
    }

    if (initialTrip) {
        handleInitialTrip(initialTrip);
    }
}

function subscribeToTrip(tripReference) {
    const unsubscribeId = tripRealtime.getTrip(tripReference, checkStatusTrip);
    unsubscribeIds.set(tripReference, unsubscribeId);
}

function handleInitialTrip(trip) {
    checkStatusTrip(trip, tripRealtime.typeAdded);
}

function initRace(trip) {
    // managerTrip.timeOut = setTimeout(verifyTrip, 3000);

    stopProgressTrip();
    clearDataCar();

    managerTrip.inTrip = true;

    managerTrip.tripCurrent = trip;

    viewController.elementProperty.getElement(".info-trip", element => {
        if (trip.status !== STATUS_ACCEPTED || trip.status !== STATUS_PRE_ACCEPTED) {
            element.style.display = "none";
            return;
        }
        element.style.display = "block";
    });

    if (trip.status === STATUS_IN_PROGRESS) {
        viewController.elementProperty.getElement("#cancelTrip", element => {
            element.style.display = "none"
        })
    } else {
        viewController.elementProperty.getElement("#cancelTrip", element => {
            element.style.display = "flex"
        })
    }


    viewController.elementProperty.addEventInElement("#dataTripInfo", "onclick", function () {
        //  InfoTrip.showDataClientTrip(trip);
    });

    // viewController.elementProperty.getElement(".footer-container-trip", element => {
    //     element.classList.remove("active");
    // });
    viewController.elementProperty.getElement(".trip-client", element => {
        element.classList.add("active");
    });
    // viewController.elementProperty.getElement(".footer-container-trip", element => {
    //     element.classList.remove("active");
    // });
    viewController.elementProperty.getElement("#mapWrapper", element => {
        element.classList.remove("active");
        element.classList.add("in-trip");
    });
    updateBtnCallTripVisibility();
    scheduleMapResize();
    viewController.elementProperty.getElement(".footer-payment-form", element =>
        element.classList.remove("active"));

    const driver = trip.driver || {};
    const driverName = driver.nickname || driver.name || "Motorista";
    viewController.elementProperty.getElement(".name-driver-trip", element => {
        element.innerHTML = driverName;
    });

    const car = Array.isArray(driver.car) ? (driver.car[0] || {}) : (driver.car || {});
    viewController.elementProperty.getElement(".car-plate-driver", element => {
        element.innerHTML = car.plate || "";
    });
    viewController.elementProperty.getElement(".car-brand-driver", element => {
        const brand = car.brand ? `<span>Marca: ${car.brand}</span>` : "";
        const model = car.model ? `<span>Modelo: ${car.model}</span>` : "";
        const color = car.color ? `<span>Cor: ${car.color}</span>` : "";
        element.innerHTML = `${brand} ${model} ${color}`.trim();
    });
    viewController.elementProperty.getElement(".image-profile-driver", element => {
        if (driver.profileImage) {
            element.style.backgroundImage = `url('${environment.hosts.hostImageDriver + driver.profileImage}')`;
        } else {
            element.style.backgroundImage = `url('/webfiles/img/icon/default.png')`;
        }
    });
    mapService.removeRoute();

    //const positionWait = getDestination(trip);

    showStatusTrip(managerTrip.tripCurrent.status);

    /*if (mapService.isImportMap) {
        mapService.addPointClientWait(positionWait);
        getCurrentPositionDriver(trip);
        //updateMapTripDriver();
    }*/
    // driverInDriver.progressTime(3,checkStatusTrip);
}

function updateMapTripDriver(trip, latitude, longitude) {

    const positionDriver = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
    };

    const positionWait = getDestination(managerTrip.tripCurrent);

    let waypoint = [];

    if (trip.status === STATUS_IN_PROGRESS) {
        waypoint = trip.tripWayPoints.filter((waypoint) => {
            return waypoint.confirmed === "0";
        }).map(({latitude: lat, longitude: lng}) => {
            return {lat: parseFloat(lat), lng: parseFloat(lng)};
        })
    }

    mapService.updateRouteInMap(positionWait, positionDriver, waypoint);
}

function stopProgressTrip() {
    stopSearchStatusPoll();
    searchTripProgress.stopProgress();

    viewController.elementProperty.getElement(".preloader-search-trip", element => {
        element.classList.remove("active");
    });

    viewController.elementProperty.removeClass(".search-driver-in-trip", "active");
    updateBtnCallTripVisibility();

    if (mapService.pointCustomer != null)
        mapService.pointCustomer.setMap(mapService.map)

    mapService.map.setOptions({styles: mapService.getStyleMapDefault()});

    if (mapService.infoSearch !== null)
        mapService.infoSearch.setMap(null);
}

function clearDataCar() {
    viewController.elementProperty.getElement(".name-driver-trip", element => {
        element.innerHTML = "";
    });
    viewController.elementProperty.getElement(".car-plate-driver", element => {
        element.innerHTML = ""
    });
    viewController.elementProperty.getElement(".car-brand-driver", element => {
        element.innerHTML = "";
    });
}

function initCloseTrip() {
    viewController.elementProperty.addClass(".menu-close", "open");
}

function closeAddressTrip(event) {
    if (event)
        event.stopPropagation();
    initProcessingCallTrip();
    verifyListTripActivePartner();
    managerTripViewCurrent.isVisible = true;
    Route.backPage();
}

function closePaymentFormKey() {
    viewController.elementProperty.removeClass(".type-cars", "trip-type-selected");
    document.querySelector(".footer-payment-form").classList.remove("active");
}


function getTaxiType() {
    const object = JSON.parse(this.getAttribute("value"));

    managerTrip.typeTaxi.priceId = object.idPrice;
    managerTrip.typeTaxi.price = parseFloat(object.price);
    managerTrip.typeTaxi.tripTypeId = object.tripTypeId;
    managerTrip.typeTaxi.priceName = object.priceName || object.name;
    managerTrip.typeTaxi.tripType = object.tripType;
    managerTrip.typeTaxi.picture = object.picture || (object.tripType && object.tripType.picture);
    managerTrip.typeTaxi.priceDynamicValue = object.priceDynamicValue;
    if (object.centralNeighborhoodId) {
        managerTrip.typeTaxi.centralNeighborhoodId = object.centralNeighborhoodId;
        managerTrip.typeTaxi.nameNeighborhood = object.nameNeighborhood;
    } else {
        managerTrip.typeTaxi.centralNeighborhoodId = null;
        managerTrip.typeTaxi.nameNeighborhood = null;
    }

    viewController.elementProperty.getElement(".trip-type", element => element.classList.remove("active"));

    this.classList.add("active");
}

function populateSearchDriverCard(data) {
    try {
        const typeTaxi = managerTrip?.typeTaxi || {};
        const rawCategoryName = typeTaxi.priceName || typeTaxi.name || "Movy";
        const isMoto = /\bmoto\b|mototaxi|motocicleta|motoboy/i.test(rawCategoryName) || 
                       /\bmoto\b/i.test(String(typeTaxi.picture || '')) ||
                       /\bmoto\b/i.test(String(data?.tripTypeId || ''));
        const phraseEl = document.getElementById("pharseTrip");
        if (phraseEl) {
            phraseEl.innerText = isMoto 
                ? "Procurando uma moto ideal para você" 
                : "Procurando um carro ideal para você";
        }
    } catch (e) {
        console.error("Erro ao atualizar frase de busca:", e);
    }
}

function initSearchTrip(data) {
    window.isCreatingTrip = true;
    managerTripViewCurrent.isVisible = true;
    managerTrip.tripCurrent = data;

    mapService.removeRoute();

    viewController.elementProperty.removeClass(".footer-container-trip", "active");
    updateBtnCallTripVisibility();
    viewController.elementProperty.getElement("#mapWrapper", (element) => { 
        element.classList.remove("active"); 
    });
    scheduleMapResize();

    viewController.elementProperty.getElement(".container-simple-delivery", (element) => {
            element.classList.remove("active");
    });

    viewController.elementProperty.getElement(".footer-payment-form",(element) => 
        element.classList.remove("active")
    );

    activeMenu();

    handleSearchTrip(data);
    handleScheduledTrip(data);
    window.isCreatingTrip = false;
}

function handleSearchTrip(data) {
    populateSearchDriverCard(data);
    mapService.searchDriver(data);

    if (data?.status !== STATUS_SCHEDULED) {
        viewController.elementProperty.addClass(
            ".search-driver-in-trip",
            "active"
        );
        updateBtnCallTripVisibility();

        const tripReference = Session.getLocal("tripReference");
        if (tripReference && (typeof tripReference === 'string' ? tripReference.length > 0 : true)) {
            startSearchStatusPoll(typeof tripReference === 'string' ? tripReference : String(tripReference));
        }
    }

    viewController.elementProperty.getElement(".car-return", (element) => {
        element.src = `webfiles/img/logo/return-${data.tripTypeId}-d.png`;
    });

    const dateInitTrip = Session.getLocal("dateInitTrip");
    if (!dateInitTrip || (Array.isArray(dateInitTrip) && dateInitTrip.length === 0)) {
        Session.setLocal("dateInitTrip", DateCustom.getNow());
    }

    const timePhrase = Session.getLocal("timePhrase");
    if (!timePhrase || (Array.isArray(timePhrase) && timePhrase.length === 0) || (typeof timePhrase === 'object' && Object.keys(timePhrase).length === 0)) {
        sortTimePhrase();
    }

    initEventSearch();

    managerTrip.isSearch = true;

    verifyTrip();
}

function handleScheduledTrip(data) {
    // Usa utilitário que verifica o estado do menu antes de alterar o botão
    updateBtnCallTripVisibility();
    
    if (data?.status === STATUS_SCHEDULED && !data?.driver) {
        SwalCustom.messageDialog(
            "Agendamento de viagem realizado com sucesso.",
            "Viagem registrada",
            null,
            "success"
        );
    }
}

function initEventSearch() {
    viewController.elementProperty.addEventInElement(".cancel-search-trip", "onclick", function () {
        viewController.elementProperty.getElement("#messageCancelTrip", element => {
            element.innerHTML = "Estamos quase encontrando sua viagem.";
        });
        cancelSearchTrip(STATUS_BACK_OFF)
    });
}
