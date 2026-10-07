const managerTripBidOffer = {
    haveObservedTrip: false,
};

const elementProperty = new ElementProperty();

async function getCustumerBlockedMe(result, data) {}

function playNotificatinSound() {
    viewController.elementProperty.getElement("#songNewMessageChat", (element) => {
        if (!element) return;
        element.play();
    });
}

function showTripOfferInBar() {
    if (
        document.querySelector(`#listTripBidOffer`).querySelectorAll(`.item-trip-bid-offer`).length > 0 ||
        parseInt(document.querySelector("#countTripBidList").innerHTML, 10) > 0 ||
        ConfigGeneral().get("travel_only_by_offer") == true
    ) {
        document.querySelector("#openTripBidList").style = "";
    } else {
        document.querySelector("#openTripBidList").style.display = "none";
    }
}

async function handleTripOffer({ data, type }) {
    if (!data) return;

    const userLogged = Session.get("user");
    const refusedDriverController = new RefusedDriverController();
    const conditionOnReceivedTrip = await verifyReceivedTripOffer(data);

    if (!conditionOnReceivedTrip) return;

    if (type === tripRealtime.typeAdded) {
        await refusedDriverController.findCustomersBlockedMe(userLogged.idDriver).then(async (result) => {
            if (result.status) {
                if (result.data.length > 0) {
                    const response = result.data.find(
                        (res) => String(res.idCustomer) == String(data.customer.idCustomer)
                    );

                    if (response) {
                        return;
                    }
                }

                if (!document.querySelector(".content-only-offer-driver-modal").classList.contains("active")) {
                    Route.startClassesInComponent(
                        [
                            {
                                component: ".container-offer-driver-modal",
                                class: "active",
                            },
                        ],
                        () => {
                            viewController.elementProperty.removeClass(".container-offer-driver-modal", "active");
                        }
                    );
                }
            }
        });

        playNotificatinSound();
        incrementOfferTripCount();
        calculateEstimativeDriverToOrigin(data);
        addItemTripBid(data);
    }

    if (type === tripRealtime.typeModified) {
        playNotificatinSound();

        if (!hasItemTripBid(data)) {
            incrementOfferTripCount();
        }
        
        removeItemTripBid(data);
        calculateEstimativeDriverToOrigin(data);
        addItemTripBid(data, type);
    }

    if (type === tripRealtime.typeRemoved) {
        decrementOfferTripCount();
        removeItemTripBid(data);
    }

    showScheduledBar();
    showTripOfferInBar();
    initEventTripBid();
}

function initSearchTripOffer() {
    if (managerTripBidOffer.haveObservedTrip) return;

    managerTripBidOffer.haveObservedTrip = true;
    const sessionUser = Session.get("user");
    const cityId = Session.getValueInSession("cityConfig", "cityId");

    if (!sessionUser || !sessionUser.tripTypes) return;

    if (sessionUser.tripTypes.length < 1) return;

    sessionUser.tripTypes.forEach((item) => {
        tripRealtime.getTripOffer(cityId, item.tripTypeId, handleTripOffer);
    });
}

function initListTripOffers() {
    viewController.elementProperty.addEventInElement("#openTripBidList", "onclick", () => {
        const sessionUser = Session.get("user");
        const cityId = Session.getValueInSession("cityConfig", "cityId");

        loadOfferTrips(sessionUser, cityId);

        Route.startClassesInComponent(
            [
                {
                    component: ".container-offer-driver-modal",
                    class: "active",
                },
            ],
            () => {
                viewController.elementProperty.removeClass(".container-offer-driver-modal", "active");
            }
        );
    });
}

function initEventTripBid() {
    viewController.elementProperty.addEventInElement(".accept-trip-bid-value", "onclick", function () {
        const trip = JSON.parse(atob(this.getAttribute("trip")));
        const user = Session.get("user");
        const config = Session.get("configGeneral");
        const enableOnlyCentral = config.find((item) => {
            return item.key === "enable_only_client_accept_offer";
        });

        if (enableOnlyCentral?.value == "1") {
            TripBidController.create(user?.idDriver, trip?.idTrip, trip?.price);
            return SwalCustom.messageDialog("", "Confirmação enviada, aguardando resposta do cliente!", "success");
        }

        if (pages.length > 1) Route.backPage();

        PreloadRequest.progress("Aceitando viagem");

        TripBidController.accept(user.idDriver, trip.tripReference).then((response) => {
            PreloadRequest.clear();
            response?.status === false && SwalCustom.messageDialog("", response?.message);
        });
    });

    elementProperty.addEventInElement(".cancel-trip-bid-value", "onclick", function () {
        const trip = JSON.parse(atob(this.getAttribute("trip")));
        handleTripRefused(trip);
    });

    viewController.elementProperty.addEventInElement(".offer-trip-bid-value", "onclick", function () {
        const trip = JSON.parse(atob(this.getAttribute("trip")));
        const maximumValue = parseFloat(trip.price) * 2;

        Mask.setMoneyField("#priceOfferTrip");

        document.querySelector("#priceOfferTrip").value = Mask.maskMoney(parseFloat(trip.price));

        calculateSuggestedValues(parseFloat(trip.price), maximumValue);

        viewController.elementProperty.addEventInElement("#decreaseOfferValue", "onclick", function () {
            const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value) - 1;

            if (parseFloat(trip.price) > value) return;

            document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
            calculateSuggestedValues(value, maximumValue);
        });

        viewController.elementProperty.addEventInElement("#increaseOfferValue", "onclick", function () {
            const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value) + 1;

            if (maximumValue < value) return;

            document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
            calculateSuggestedValues(value, maximumValue);
        });

        Route.startClassesInComponent(
            [
                {
                    component: ".price-offer-modal",
                    class: "active",
                },
            ],
            () => {
                viewController.elementProperty.removeClass(".price-offer-modal", "active");
            }
        );

        viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
            Route.backPage();
        });

        viewController.elementProperty.addEventInElement("#btnDecreasePriceTripOffer", "onclick", function () {
            let value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value);
            value = value - value * 0.1;
            document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
        });

        viewController.elementProperty.addEventInElement("#btnIncreasePriceTripOffer", "onclick", function () {
            let value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value);
            value = value + value * 0.1;
            document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
        });

        viewController.elementProperty.addEventInElement("#btnConfirmValueOffer", "onclick", function () {
            const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value);

            if (value === 0) return SwalCustom.messageDialog("", "Informe o valor para continuar!");

            Route.backPage();

            const user = Session.get("user");

            TripBidController.create(user.idDriver, trip.idTrip, value);
            SwalCustom.messageDialog("", "Oferta enviada com sucesso!", "success");
        });
    });
}

function removeItemTripBid(freight) {
    document.querySelectorAll(`.item-trip-bid-offer[tripReference='${freight.tripReference}']`).forEach((element) => {
        if (element != null) element.remove();
    });
}

async function verifyReceivedTripOffer(data) {
    const dataValuesPaymentFormAll = await Promise.all([
        DriverFormOfPaymentController.getAll(),
        DriverFormOfPaymentController.getAllImposition(),
    ]);
    const { data: listPaymentFormAllChoosed } = dataValuesPaymentFormAll?.[0];
    const { data: listPaymentFormImposition } = dataValuesPaymentFormAll?.[1];

    const selectedPaymentFormIds = listPaymentFormAllChoosed.map((item) => String(item?.tripPaymentFormId));
    const impositionPaymentFormIds = listPaymentFormImposition.map((item) => String(item?.tripPaymentFormId));

    const paymentFormIdAsString = String(data?.tripPaymentFormId);

    const conditionOnReceivedTrip =
        selectedPaymentFormIds.length === 0 ||
        selectedPaymentFormIds.includes(paymentFormIdAsString) ||
        impositionPaymentFormIds.includes(paymentFormIdAsString);

    return conditionOnReceivedTrip;
}

function addItemTripBid(trip, type = null) {
    if (Session.get("balanceNegative") == true) {
        return;
    }

    const userLogged = Session.get("user");
    const refusedDriverController = new RefusedDriverController();
    refusedDriverController.findCustomersBlockedMe(userLogged.idDriver).then((result) => {
        if (result.status) {
            if (result.data.length > 0) {
                const response = result.data.find((res) => String(res.idCustomer) == String(trip.customer.idCustomer));

                if (response) {
                    return;
                }
            }
        }
    });

    viewController.elementProperty.getElement(".list-trip-bid-offer", (element) => {
        if (!element) return;

        const liBtnShowMore = element.querySelector(".container-btn-show-more");

        const user = Session.get("user");
        // const tripRefused = Session.get("tripBidRefused") || [];
        let price = trip.price;

        const config = Session.get("configGeneral");
        const picturesLink = config.find((item) => {
            return item.key === "link_storage_pictures";
        });

        const profileImage = trip.customer.profileImage;
        const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;

        const hasTripBid = trip.tripBids
            ? trip.tripBids.some((item) => {
                  return item.driverId == user.idDriver;
              })
            : false;

        if (hasTripBid) {
            trip.tripBids.find((el) => {
                if (el.driverId == user.idDriver) {
                    return (price = el.price);
                }
            });
        }

        const li = document.createElement("li");
        li.className = "item-trip-bid-offer";
        li.setAttribute("tripReference", trip.tripReference);

        li.innerHTML = `
            <div 
                class="profile-customer-trip-offer"  
                style="background-image: url('${finalLink}')"></div>
            <ul>
            <li>${trip.origin.address}</li>
                ${trip.tripWayPoints
                    .map((local) => {
                        return `<li>${local.address}</li>`;
                    })
                    .join("")}
                <li>${trip.destination.name}</li>
            </ul>
                
            ${
                trip.oldPrice
                    ? `<div>
                    <p>
                        <span>${getTextTranslate("trip-bid", "reference-value")}</span>
                    </p>
                    <h4>${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(trip.oldPrice))}</h4>
                </div>`
                    : ""
            }
            <div>
                <p>
                    <span>${getTextTranslate("trip-bid", "bid-value")}</span>
                </p>
                <h3>${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(price))}</h3>
            </div>
            <div>
                <p>
                    <span>${getTextTranslate("trip-bid", "label-name-customer")}</span><span>${
            trip.customer.name
        }</span>
                </p>
            </div>
            <div>
                <p>
                    <i class="material-icons">star</i>
                    <span>${trip.customer.rating}</span>
                </p>
            </div>
            <div>
                <p>
                    <span>${getTextTranslate("trip-bid", "label-distance-to-customer")}</span>
                     <span>${(
                         plugin.google.maps.geometry.spherical.computeDistanceBetween(
                             {
                                 lat: parseFloat(trip.origin.latitude),
                                 lng: parseFloat(trip.origin.longitude),
                             },
                             mapService.positionDriver.getPosition()
                         ) / 1000
                     ).toFixed(0)}km
                    </span>
                </p>
            </div>
            <div>
                 <p>
                    <span>${getTextTranslate("trip-bid", "label-distance-to-destination")}</span>
                    <span>${parseInt(trip.distance)}km/${trip.estimatedTripTime}min</span>
                </p>
            </div>
            <div>
                <p>
                    <span>${getTextTranslate("trip-bid", "label-type")}</span>
                    <span>${trip.tripType}</span>
                </p>
                <p>
                    <span>${getTextTranslate("trip-bid", "label-start")}</span>
                    <span>${
                        trip.schedule == null
                            ? getTextTranslate("trip-bid", "start-now")
                            : new Date(trip.schedule?.schedule).toLocaleString()
                    }</span>
                </p>
            </div>
            <div>
                <p>
                    <span>${getTextTranslate("trip-bid", "label-payment-form")}</span>
                    <span>${trip.tripPaymentForm}</span>
                </p>
            </div>
            <div class="option-trip-bid-offer" style="${hasTripBid ? "display:none;" : ""}">
                <button type="button" class="cancel-trip-bid-value" trip='${btoa(
                    JSON.stringify(trip)
                )}'>${getTextTranslate("trip-bid", "cancel-bid")}</button>           
                <button type="button" class="offer-trip-bid-value" trip='${btoa(
                    JSON.stringify(trip)
                )}'>${getTextTranslate("trip-bid", "button-bid")}</button>
            </div>
            <p  style="${!hasTripBid ? "display:none;" : ""}">${getTextTranslate("trip-bid", "p-request-bid")}</p>
            <div class="option-trip-bid-offer">
            <button type="button" class="accept-trip-bid-value" trip='${btoa(JSON.stringify(trip))}'>${getTextTranslate(
            "trip-bid",
            "button-accept"
        )}</button>
            </div>
        `;

        if (liBtnShowMore) {
            element.insertBefore(li, liBtnShowMore);
        } else {
            element.appendChild(li);
        }
    });
}

function showModuleOnlyBid() {
    if (ConfigGeneral().get("travel_only_by_offer") == true) {
        const userLogged = Session.get("user");

        if (userLogged.status === "corrida") {
            viewController.elementProperty.removeClass(".content-only-offer-driver-modal", "active");
        } else {
            viewController.elementProperty.addClass(".content-only-offer-driver-modal", "active");
        }
    }
}

function calculateSuggestedValues(value, maximumValue = null) {
    function calculateWithPercent(value, percent) {
        return value + value * percent;
    }

    viewController.elementProperty.getElement("#suggestedValues", (element) => {
        element.innerHTML = [0.1, 0.2, 0.3]
            .map((percent) => {
                const suggestedValue = calculateWithPercent(value, percent);
                if (suggestedValue < maximumValue)
                    return `<li class="item-suggested-value" value="${suggestedValue}">${Mask.maskMoney(
                        suggestedValue
                    )}</li>`;
            })
            .join("");
        viewController.elementProperty.addEventInElement(".item-suggested-value", "onclick", function () {
            const value = parseFloat(this.getAttribute("value"));
            document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
            calculateSuggestedValues(value, maximumValue);
        });
    });
}

function calculateEstimativeDriverToOrigin(trip) {
    const origin = mapService.positionDriver.getPosition();
    const localDistance = (
        plugin.google.maps.geometry.spherical.computeDistanceBetween(
            {
                lat: parseFloat(trip.destination.latitude),
                lng: parseFloat(trip.destination.longitude),
            },
            mapService.positionDriver.getPosition()
        ) / 1000
    ).toFixed(0);

    DirectionController.search(`${origin.lat},${origin.lng}`, `${trip.origin.latitude},${trip.origin.longitude}`)
        .then((result) => {
            trip.tripEstimative = `${(result.data.distance / 1000).toFixed(0)}km/${(result.data.duration / 60).toFixed(
                0
            )}min`;
        })
        .catch((error) => {
            trip.tripEstimative = `${localDistance}km`;
        });
}

function incrementOfferTripCount(value = 1) {
    viewController.elementProperty.getElement("#countTripBidList", (element) => {
        const current = parseInt(element.textContent, 10) || 0;
        element.textContent = current + value;
    });
}

function decrementOfferTripCount(value = 1) {
    viewController.elementProperty.getElement("#countTripBidList", (element) => {
        const current = parseInt(element.textContent, 10) || 0;
        const newValue = Math.max(0, current - value);
        element.textContent = newValue;
    });
}

function clearOfferList() {
    const list = document.querySelector(".list-trip-bid-offer");
    if (!list) return;

    const btn = list.querySelector(".container-btn-show-more");
    list.innerHTML = "";
    if (btn) list.appendChild(btn);
}

function setLoadingOffer(state = false) {
    requestAnimationFrame(() => {
        if (state) {
            document.getElementById("preloadOffer").classList.add("active");
        } else {
            document.getElementById("preloadOffer").classList.remove("active");
        }
    });
}

const toggleShowMoreButtonOffer = (page, lastPage) => {
    if (page < lastPage) {
        document.getElementById("liShowMoreOffer").classList.add("active");
    } else {
        document.getElementById("liShowMoreOffer").classList.remove("active");
    }
};

async function loadOfferTrips(user, cityId) {
    if (!user || !user?.tripTypes?.length) return;

    let page = 1;
    let lastPageList = 1;

    const tripTypeIds = user.tripTypes.map((item) => item.tripTypeId);
    const params = {
        tripTypeIds,
        cityId,
        status: STATUS_GET_BID_BY_DRIVERS,
        driverId: user.idDriver,
        tripWithoutRefusal: true,
    };

    const fetchTrips = async (pageNum, clean = false) => {
        setLoadingOffer(true);

        try {
            const { data, status } = await DriverController.getTripsAvailable(pageNum, params);
            if (!status || !data?.trips?.length) return;
            lastPageList = data.paginate.lastPage;

            if (clean) clearOfferList();
            data.trips.forEach((trip) => addItemTripBid(trip, tripRealtime.typeAdded));
            toggleShowMoreButtonOffer(pageNum, lastPageList);

            initEventTripBid();
        } catch (error) {
            console.error("Erro ao carregar viagens por oferta:", error);
        } finally {
            setLoadingOffer(false);
        }
    };

    await fetchTrips(page, true);

    elementProperty.addEventInElement("#btnShowMoreOffer", "onclick", async () => {
        if (page >= lastPageList) {
            SwalCustom.messageDialog(getTextTranslate("list-trips", "dont-have-races-anymore"), "");
            return;
        }

        page += 1;
        await fetchTrips(page);
    });
}

async function handleTripRefused(trip) {
    const user = Session.get("user");

    TripRefusedController.create(user?.idDriver, trip?.idTrip).then(({ status, message }) => {
        if (status) {
            removeItemTripBid(trip);
            decrementOfferTripCount();
            showScheduledBar();
            showTripOfferInBar();
    
            SwalCustom.messageDialog("", "Viagem recusada com sucesso!", null, "success");
        } else {
            SwalCustom.messageDialog("", message);
        }
    });
}

function hasItemTripBid(freight) {
    const selector = `.item-trip-bid-offer[tripReference='${freight.tripReference}']`;
    return document.querySelectorAll(selector).length > 0;
}
