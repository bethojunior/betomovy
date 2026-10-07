const managerScheduleTripAccepted = {
    haveObservedScheduleTrip: false,
};

// const { show } = require("../../../../../plugins/cordova-plugin-ionic-keyboard/www/android/keyboard");

function addScheduledAcceptedTrip(trip) {
    const liquidPrice = Session.get("cityConfig").showNetValueForDriverOnCall;
    const totalValue = TripUtils.applyDiscount(trip, liquidPrice);

    viewController.elementProperty.getElement("#listFreightAccepted", (element) => {
        if (!element) return;

        const liBtnShowMore = element.querySelector(".container-btn-show-more");

        const li = document.createElement("li");
        li.className = "item-schedule-trip schedule-trip-accepted";
        li.setAttribute("tripReference", trip.tripReference);

        li.innerHTML = `
            ${verifyExistSchedule(trip)}
            <p><span>Origem: </span><span>${trip.origin.address}</span></p>
            <p><span>Destino: </span><span>${trip.destination.name}</span></p>
            <p><span>Valor: </span><span class="value-freight-item">${CityConfig.getTypeCoin()}${Mask.maskMoney(
            parseFloat(totalValue)
        )}</span>
            </p>
            <div>
                <div><span>Tipo: </span><span>${trip.tripType.toUpperCase()}</span></div>
                <div class="content-option-trip">
                    ${checkTypeEventByTrip(trip)}
                    <button type="button" class="btn-schedule-trip-cancel" tripReference="${
                        trip.tripReference
                    }">Cancelar</button>
                </div>
            </div>`;

        if (liBtnShowMore) {
            element.insertBefore(li, liBtnShowMore);
        } else {
            element.appendChild(li);
        }
    });
}

function removeScheduledAcceptedTrip(tripReference) {
    const element = document.querySelector(`.item-schedule-trip[tripReference='${tripReference}']`);

    if (element != null) element.remove();
}

function handleFreightScheduledAccepted({ data: trip, type }) {
    if (type === tripRealtime.typeRemoved) {
        if (trip && trip.tripReference) {
            decrementScheduledAcceptedTripCount();
            removeScheduledAcceptedTrip(trip.tripReference);
        }
    }

    if (type === tripRealtime.typeAdded || type === tripRealtime.typeModified) {
        if (trip && trip.tripReference) {
            incrementScheduledAcceptedTripCount();
            addScheduledAcceptedTrip(trip);
        }
    }

    showScheduledBar();
    initEventDetailFreight();
}

function verifyFreightAcceptedReady({ data, type }) {
    if (data && type === tripRealtime.typeAdded) {
        Route.goHomeBack();

        updateInfoHomeDriver(data);

        navigator.notification.beep();
    }
}

function incrementScheduledAcceptedTripCount(value = 1) {
    viewController.elementProperty.getElement("#countScheduleTripAccepted", (element) => {
        const current = parseInt(element.textContent, 10) || 0;
        element.textContent = current + value;
    });
}

function decrementScheduledAcceptedTripCount(value = 1) {
    viewController.elementProperty.getElement("#countScheduleTripAccepted", (element) => {
        const current = parseInt(element.textContent, 10) || 0;
        const newValue = Math.max(0, current - value);
        element.textContent = newValue;
    });
}

function updateInfoHomeDriver(trip) {
    if (trip.schedule != null) {
        viewController.elementProperty.addClass(".container-notification-scheduled-trip", "active");

        viewController.elementProperty.getElement("#nameDriverScheduledTrip", (element) => {
            element.innerHTML = Session.getValueInSession("user", "nickname");
        });

        viewController.elementProperty.addEventInElement("#btnCloseNotificationScheduledTrip", "onclick", () => {
            viewController.elementProperty.removeClass(".container-notification-scheduled-trip", "active");
        });

        viewController.elementProperty.getElement("#songClientCancelTrip", (element) => {
            element.play();
        });

        showScheduledBar();
    }

    updateTripDriver();
}

function initListFreightAccepted() {
    if (managerScheduleTripAccepted.haveObservedScheduleTrip) return;

    const driverId = Session.getValueInSession("user", "idDriver");
    managerScheduleTripAccepted.haveObservedScheduleTrip = true;

    viewController.elementProperty.addEventInElement("#openScheduleTripAccepted", "onclick", () => {
        loadScheduledAcceptedTrips(driverId);

        Route.startClassesInComponent(
            [
                {
                    component: "#containerListScheduleTripAccepted",
                    class: "active",
                },
            ],
            () => {
                viewController.elementProperty.removeClass("#containerListScheduleTripAccepted", "active");
            }
        );
    });

    tripRealtime.getTripScheduledAccepted(driverId, handleFreightScheduledAccepted);
    tripRealtime.getTripScheduledAcceptedReady(driverId, verifyFreightAcceptedReady);
    tripRealtime.checkTripAccepted(driverId, verifyFreightAcceptedReady);
}

function clearScheduledAcceptedList() {
    const list = document.querySelector("#listFreightAccepted");
    if (!list) return;

    const btn = list.querySelector(".container-btn-show-more");
    list.innerHTML = "";
    if (btn) list.appendChild(btn);
}

function setLoadingScheduledAccepted(state = false) {
    requestAnimationFrame(() => {
        if (state) {
            document.getElementById("preloadFreightAccepted").classList.add("active");
        } else {
            document.getElementById("preloadFreightAccepted").classList.remove("active");
        }
    });
}

const toggleShowMoreButtonScheduledAccepted = (page, lastPage) => {
    if (page < lastPage) {
        document.getElementById("liShowMoreFreightAccepted").classList.add("active");
    } else {
        document.getElementById("liShowMoreFreightAccepted").classList.remove("active");
    }
};

async function loadScheduledAcceptedTrips(driverId) {
    if (!driverId) return;

    let page = 1;
    let lastPageList = 1;

    const params = {
        driverId,
        status: STATUS_SCHEDULED,
    };

    const fetchTrips = async (pageNum, clean = false) => {
        setLoadingScheduledAccepted(true);

        try {
            const { data, status } = await DriverController.getTripsAccepted(pageNum, params);
            if (!status || !data?.trips?.length) return;
            lastPageList = data.paginate.lastPage;

            if (clean) clearScheduledAcceptedList();
            data.trips.forEach((trip) => addScheduledAcceptedTrip(trip));
            toggleShowMoreButtonScheduledAccepted(pageNum, lastPageList);

            initEventDetailFreight();
        } catch (error) {
            console.error("Erro ao carregar viagens agendadas aceitas:", error);
        } finally {
            setLoadingScheduledAccepted(false);
        }
    };

    await fetchTrips(page, true);

    elementProperty.addEventInElement("#btnShowMoreFreightAccepted", "onclick", async () => {
        if (page >= lastPageList) {
            SwalCustom.messageDialog(getTextTranslate("list-trips", "dont-have-races-anymore"), "");
            return;
        }

        page += 1;
        await fetchTrips(page);
    });
}
