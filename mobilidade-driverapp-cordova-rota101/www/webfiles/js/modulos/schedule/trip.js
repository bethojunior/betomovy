const managerScheduleTrip = {
    haveObservedScheduleTrip: false,
    haveObservedPreAcceptedTrip: false,
};

function initEventScheduleTrip() {
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#openScheduleTrip", "onclick", () => {
        const user = Session.get("user");
        const cityId = Session.getValueInSession("cityConfig", "cityId");

        loadScheduledTrips(user, cityId);

        Route.startClassesInComponent([{ component: "#containerListScheduleTrip", class: "active" }], () => {
            elementProperty.removeClass("#containerListScheduleTrip", "active");
        });
    });

    viewController.elementProperty.addEventInElement(".go-back-schedule-trip", "onclick", () => {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", () => {
        Route.backPage();
    });
}

function handleTripPreAccepted({ data, type }) {
    if (!data) return;

    if (type === tripRealtime.typeRemoved) {
        Session.delete("preAvailableTripData");
    } else {
        Session.set("preAvailableTripData", data);
        checkPreAvailable();
    }
}

function checkTripPreAcceptedByDriver() {
    if (managerScheduleTrip.haveObservedPreAcceptedTrip) return;

    managerScheduleTrip.haveObservedPreAcceptedTrip = true;

    tripRealtime.checkTripPreAcceptedByDriver(Session.get("user").idDriver, handleTripPreAccepted);
}

function incrementScheduledTripCount(value = 1) {
    viewController.elementProperty.getElement("#countNewScheduleTrip", (element) => {
        const current = parseInt(element.textContent, 10) || 0;
        element.textContent = current + value;
    });
}

function decrementScheduledTripCount(value = 1) {
    viewController.elementProperty.getElement("#countNewScheduleTrip", (element) => {
        const current = parseInt(element.textContent, 10) || 0;
        const newValue = Math.max(0, current - value);
        element.textContent = newValue;
    });
}

async function createListScheduleTrip() {
    const user = Session.get("user");
    if (managerScheduleTrip.haveObservedScheduleTrip || !user?.tripTypes) {
        return;
    }

    managerScheduleTrip.haveObservedScheduleTrip = true;

    const config = Session.get("configGeneral");
    const cityId = Session.getValueInSession("cityConfig", "cityId");

    const refusedDriverCustomer = await new RefusedDriverController()
        .driversBlockedByCustomer(Session.get("user").idDriver)
        .then((result) => {
            return result.data;
        });

    const dataVerify = await verifyReceivedTripSchedule();
    
    const isSoundInitialEnabled = config?.find((item) => item.key === "enable_sound_initial_app_driver")?.value === "1";

    const playSound = () => {
        viewController.elementProperty.getElement("#scheduledTrip", (element) => {
            if (!element) return;
            element.play();
        });
    };

    const handleTripScheduled = async ({ data: freight, type }) => {
        const { customer, tripPaymentFormId } = freight || {};

        if (isSoundInitialEnabled){
            playSound();
        }

        if (type === tripRealtime.typeAdded) {
            const isBlocked = refusedDriverCustomer?.some((blocked) => blocked.customerId === customer.idCustomer);
            if (isBlocked) return;

            const { selectedPaymentFormIds, impositionPaymentFormIds } = dataVerify;
            const isAllowedPayment =
                selectedPaymentFormIds.length === 0 ||
                selectedPaymentFormIds.includes(String(tripPaymentFormId)) ||
                impositionPaymentFormIds.includes(String(tripPaymentFormId));

            if (!isAllowedPayment) return;

            incrementScheduledTripCount();
            playSound();
            addItemTrip(freight);
        }

        if (type === tripRealtime.typeRemoved) {
            decrementScheduledTripCount();
            removeItemTrip(freight.tripReference);
        }

        showScheduledBar();
        initEventDetailFreight();
    };

    user?.tripTypes.forEach(({ tripTypeId }) => {
        tripRealtime.getTripScheduled(cityId, tripTypeId, handleTripScheduled);
    });
}

function showScheduledBar() {
    const userLogged = Session.get("user");

    const countScheduleTripAccepted = parseInt(document.querySelector("#countScheduleTripAccepted").innerHTML, 10) || 0;
    const countTripBidList = parseInt(document.querySelector("#countTripBidList").innerHTML, 10) || 0;
    const countNewScheduleTrip = parseInt(document.querySelector("#countNewScheduleTrip").innerHTML, 10) || 0;

    if (
        (countScheduleTripAccepted <= 0 &&
            countTripBidList <= 0 &&
            countNewScheduleTrip <= 0 &&
            ConfigGeneral().get("travel_only_by_offer") == false) ||
        userLogged.status === "corrida"
    ) {
        viewController.elementProperty.removeClass(".footer-race", "active-schedule");
        viewController.elementProperty.removeClass(".container-qrcode-driver", "active-schedule");
        viewController.elementProperty.addClass(".schedule-bar", "hidden");
    } else {
        viewController.elementProperty.addClass(".footer-race", "active-schedule");
        viewController.elementProperty.addClass(".container-qrcode-driver", "active-schedule");
        viewController.elementProperty.removeClass(".schedule-bar", "hidden");
    }

    showModuleOnlyBid();
}

function removeItemTrip(tripReference) {
    const element = document.querySelector(`.item-schedule-trip[tripReference='${tripReference}']`);

    if (element != null) element.remove();
}

async function verifyReceivedTripSchedule() {
    const dataValuesPaymentFormAll = await Promise.all([
        DriverFormOfPaymentController.getAll(),
        DriverFormOfPaymentController.getAllImposition(),
    ]);
    const { data: listPaymentFormAllChoosed } = dataValuesPaymentFormAll?.[0];
    const { data: listPaymentFormImposition } = dataValuesPaymentFormAll?.[1];

    const selectedPaymentFormIds = listPaymentFormAllChoosed.map((item) => String(item?.tripPaymentFormId));
    const impositionPaymentFormIds = listPaymentFormImposition.map((item) => String(item?.tripPaymentFormId));

    return { selectedPaymentFormIds, impositionPaymentFormIds };
}

function addItemTrip(trip) {
    const liquidPrice = Session.get("cityConfig").showNetValueForDriverOnCall;
    const totalValue = TripUtils.applyDiscount(trip, liquidPrice);

    viewController.elementProperty.getElement("#listScheduledTrip", (element) => {
        if (!element) return;

        const liBtnShowMore = element.querySelector(".container-btn-show-more");

        const li = document.createElement("li");
        li.className = "item-schedule-trip new-scheduled-trip";
        li.setAttribute("tripReference", trip.tripReference);

        const loadingDistance = `
            <span class="distance-loading">
                <span class="spinner"></span>
            </span>
        `;

        li.innerHTML = `
            ${verifyExistSchedule(trip)}
            <p><span>Origem: </span><span>${trip.origin.address}</span></p>
            <p><span>Destino: </span><span>${trip.destination.name}</span></p>
            <p>
                <span>Distância estimada: </span>
                <span id="estimatedDistanceScheduled-${trip.tripReference}">${loadingDistance}</span>
            </p>
            <p><span>Valor: </span><span class="value-freight-item">${CityConfig.getTypeCoin()}${Mask.maskMoney(
            parseFloat(totalValue)
        )}</span></p>
            <div>
                <div><span>Tipo: </span><span>${trip.tripType.toUpperCase()}</span></div>
                <div class="content-option-trip">
                    ${checkTypeEventByTrip(trip)}
                    <button type="button" class="btn-schedule-trip-accept" tripReference="${
                        trip.tripReference
                    }">ACEITAR</button>
                </div>
            </div>
        `;

        if (liBtnShowMore) {
            element.insertBefore(li, liBtnShowMore);
        } else {
            element.appendChild(li);
        }
    });

    DirectionController.search(
        `${trip.origin.latitude},${trip.origin.longitude}`,
        `${trip.destination.latitude},${trip.destination.longitude}`
    )
        .then((result) => {
            viewController.elementProperty.getElement(
                `#estimatedDistanceScheduled-${trip.tripReference}`,
                (element) => {
                    element.innerHTML = `${(result.data.distance / 1000).toFixed(0)} km / ${(
                        result.data.duration / 60
                    ).toFixed(0)} min`;
                }
            );
        })
        .catch(() => "não disponível");
}

function checkTypeEventByTrip(trip) {
    switch (trip.tripCallTypeId) {
        case TRIP_FREIGHT: {
            return `<button type="button" class="btn-schedule-freight-detail" trip='${JSON.stringify(
                trip
            )}'>Detalhes do frete</button>`;
        }
        case TRIP_CALL_RIDE: {
            return `<button type="button" class="btn-schedule-riders-chats" trip='${JSON.stringify(
                trip
            )}'>Mensagens</button>
                    <button type="button" class="btn-schedule-riders-detail" trip='${JSON.stringify(
                        trip
                    )}'>Passageiros</button>`;
        }
        default: {
            return "";
        }
    }
}

function verifyExistSchedule(freight) {
    if (freight.schedule == null) return ``;

    return `<p>
                <span>Data da viagem: </span>
                <span>${new Date(freight.schedule.schedule).toLocaleString()}</span>
            </p>`;
}

function initEventDetailFreight() {
    viewController.elementProperty.addEventInElement(".btn-schedule-trip-accept", "onclick", function () {
        SwalCustom.dialogConfirm("Deseja aceitar essa corrida ?", "", (status) => {
            if (!status) return;
            acceptScheduleTrip(this.getAttribute("tripReference"));
        });
    });

    viewController.elementProperty.addEventInElement(".btn-schedule-riders-detail", "onclick", function () {
        const trip = JSON.parse(this.getAttribute("trip"));
        window.plugins.spinnerDialog.show();
        TripController.actionGet(trip.tripReference).then(({ data }) => {
            window.plugins.spinnerDialog.hide();
            showListCustomerRide(data);
        });
    });

    viewController.elementProperty.addEventInElement(".btn-schedule-riders-chats", "onclick", function () {
        const trip = JSON.parse(this.getAttribute("trip"));
        viewController.addParams("multiple-chat", trip);
        Route.redirectDynamic("Driver", "MultipleChat");
    });

    viewController.elementProperty.addEventInElement(".btn-schedule-freight-detail", "onclick", function () {
        const data = JSON.parse(this.getAttribute("trip"));
        TripController.actionGet(data.tripReference).then((response) => {
            Route.startClassesInComponent(
                [
                    {
                        component: ".container-detail-freight",
                        class: "active",
                    },
                ],
                () => {
                    viewController.elementProperty.removeClass(".container-detail-freight", "active");
                }
            );
            showDetailFreight(response.data);
        });
    });

    viewController.elementProperty.addEventInElement(".btn-schedule-trip-cancel", "onclick", function () {
        SwalCustom.dialogConfirm("Deseja cancelar essa corrida ?", "", (status) => {
            if (!status) return;

            Route.backPage();

            const userLogged = Session.get("user");

            new DriverController()
                .cancelTrip({
                    tripReference: this.getAttribute("tripReference"),
                    driverId: userLogged.idDriver,
                    cancellationReasonsId: 4,
                })
                .then(({ status, message }) => {
                    if (!status) return SwalCustom.messageDialog("", message, undefined, "info");

                    SwalCustom.messageDialog("", message, undefined, "success");
                });
        });
    });
}

function acceptScheduleTrip(tripReference) {
    DriverController.acceptScheduled(tripReference, Session.getValueInSession("user", "idDriver")).then(
        ({ status, data, message }) => {
            if (!status) return SwalCustom.messageDialog("", message);

            SwalCustom.messageDialog(
                "",
                message,
                () => {
                    Route.backPage();
                },
                "success"
            );
        }
    );
}

function clearScheduledList() {
    const list = document.querySelector("#listScheduledTrip");
    if (!list) return;

    const btn = list.querySelector(".container-btn-show-more");
    list.innerHTML = "";
    if (btn) list.appendChild(btn);
}

function setLoadingScheduled(state = false) {
    requestAnimationFrame(() => {
        if (state) {
            document.getElementById("preloadScheduled").classList.add("active");
        } else {
            document.getElementById("preloadScheduled").classList.remove("active");
        }
    });
}

const toggleShowMoreButtonScheduled = (page, lastPage) => {
    if (page < lastPage) {
        document.getElementById("liShowMoreScheduled").classList.add("active");
    } else {
        document.getElementById("liShowMoreScheduled").classList.remove("active");
    }
};

async function loadScheduledTrips(user, cityId) {
    if (!user?.tripTypes?.length) return;

    let page = 1;
    let lastPageList = 1;

    const tripTypeIds = user.tripTypes.map((item) => item.tripTypeId);
    const params = {
        tripTypeIds,
        cityId,
        status: STATUS_SCHEDULED,
    };

    const fetchTrips = async (pageNum, clean = false) => {
        setLoadingScheduled(true);

        try {
            const { data, status } = await DriverController.getTripsAvailable(pageNum, params);
            if (!status || !data?.trips?.length) return;
            lastPageList = data.paginate.lastPage;

            if (clean) clearScheduledList();
            data.trips.forEach((trip) => addItemTrip(trip));
            toggleShowMoreButtonScheduled(pageNum, lastPageList);

            initEventDetailFreight();
        } catch (error) {
            console.error("Erro ao carregar viagens agendadas:", error);
        } finally {
            setLoadingScheduled(false);
        }
    };

    await fetchTrips(page, true);

    elementProperty.addEventInElement("#btnShowMoreScheduled", "onclick", async () => {
        if (page >= lastPageList) {
            SwalCustom.messageDialog(getTextTranslate("list-trips", "dont-have-races-anymore"), "");
            return;
        }

        page += 1;
        await fetchTrips(page);
    });
}
