window.managerTrip = {
    zones: null,
    paymentFormIdSelected: null,
    typeTaxi: {
        tripTypeId: null,
        price: null
    },
    tripCurrent: null,
    timeOut: null,
    inTrip: false,
    isSearch: false,
    prices: [],
    recalculatedTrip: null
};
var markerLocalConfirmationOption = null;
var markerPointOrigin = null;
var cancellationReasonsController = new CancellationReasonsController()
Route.waitView().then(function () {
    window.userLogged = Session.get("user");
    window.mapService = new MapService();
    window.searchTripProgress = new Progress();
    window.priceTrip = new PriceTrip();

    const elementProperty = new ElementProperty();

    const socketTrip = new WebSocket(keyTrip);

    socketTrip.setChannel(channelTrip);

    window.trip = {
        origin: null,
        destination: null,
        waypoints: [],
        amountWaypoints: 0,
        typeCustomerInTrip: "forMe"
    };
    Route.pageDynamic();

    getCustomerPlace();

    loadingScriptMap();

    getUpdateTrip();

    updateLocation();

    updateCards();

    verifyScheduledTrip();

    function loadingScriptMap() {
        elementProperty.removeClass(".container-connection-internet", "active");
        initLoadMap();
    }

    function initLoadMap() {
        const position = Session.get("location");

        if (position.length === 0) {
            setTimeout(initLoadMap, 3000);
            return;
        }

        initMap(position);
        getConfigCityByPosition(position);
    }

    function initMap(position) {
        mapService.initMap("mapaClient", position, function () {
            showTab();

            elementProperty.getElement("#preload-return", element => {
                element.style.display = "none";
            });
            priceTrip.getEstates();
            initEvents();
        });
    }

    function initEvents() {
        initEventSearchPlace();

        elementProperty.addEventInElement(
            ".btn-call-trip",
            "onclick",
            toggleCallOrCancel
        );
        elementProperty.addEventInElement(
            "#choicePaymentTrip",
            "onclick",
            openPaymentForm
        );
        elementProperty.addEventInElement(
            ".close-payment-form",
            "onclick",
            closePaymentForm
        );
        elementProperty.addEventInElement(
            ".option-trip",
            "onclick",
            toggleOptionMenu
        );
        elementProperty.addEventInElement(
            ".btn-search-trip",
            "onclick",
            function () {
                preload(true);
                elementProperty.getElement(".footer-container-trip", element => {
                    if (element.classList.contains("knob-trip")) {
                        initTripKnob();
                        return;
                    }
                    initNewTrip();
                });
            }
        );

        elementProperty.addEventInElement(".chat-client", "onclick", function (event) {
            event.stopPropagation();
            openChat(managerTrip.tripCurrent);
        });
        elementProperty.addEventInElement(".phone-client", "onclick", function () {
            callDriver(managerTrip.tripCurrent);
        });

        elementProperty.addEventInElement(".close-cancel-trip", "onclick", () => {
            Route.backPage();
        });

        elementProperty.addEventInElement(".cancel-trip-event", "onclick", async function (event) {
            event.stopPropagation();
            const response = Session.get("timeArrivalDriver");

            /*if ((response.value / 60) <= 5) {
                      cancelTripDriverArrival(response);
                      return;
                  }*/
            preload(true)
            await cancellationReasonsController.GetAll().then(result => {
            preload(false)
                elementProperty.getElement(".options-cancel-default", elementContainer => {
                    elementContainer.innerHTML = "";
        
                    result.data.map(cancellation => {
                        elementContainer.innerHTML += `<li class="option-cancel" 
                            value="${cancellation.idCancellationReasons}">${cancellation.name}</li>`;
                    });
        
                    initEventSelectedCancellation();
                });
            });

            Route.startClassesInComponent([{component: ".container-cancel-trip", class: "active"}], () => {
                viewController.elementProperty.removeClass(".container-cancel-trip", "active");
            });
        });

        elementProperty.addEventInElement(".btn-cancel-trip", "onclick", function () {
            preload(true);
            CustomerController.checkCancellationFee(
                managerTrip.tripCurrent.tripReference
            )
                .then(({status, data}) => {
                    if (data == null) {
                        elementProperty.getElement("#messageCancelTrip", element => {
                            element.innerHTML = getTextTranslate("home", "message-wish-cancel-trip");
                        });
                    } else {
                        elementProperty.getElement("#messageCancelTrip", element => {
                            element.innerHTML = data.type.description;
                        });
                    }
                    cancelSearchTrip();
                })
                .finally(() => {
                    preload(false);
                });
        })

        elementProperty.addEventInElement("#chatClient", "onclick", openChat);
        elementProperty.addEventInElement("#zoomInRoute", "onclick", function () {
            mapService.focusInRoute();
        });

        getPaymentForm(function () {
            elementProperty.addEventInElement(
                ".payment-form-trip",
                "onclick",
                function () {
                    clearCouponApply();
                    managerTrip.paymentFormIdSelected = getPaymentFormSelect(this);
                }
            );
        });
    }

    window.customerOnTripExpired = function () {
        config = Session.get("cityConfig");

        if (config.enableTripSuggestion == false) return;

        selectAnotherTypeDriver(userLogged).then(() => {
            initProcessingCallTrip();
        });
        searchTripProgress.stopProgress();
    };

    function toggleOptionMenu() {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            return;
        }
        this.classList.add("active");
    }

    function updateCards() {
        new CustomerCardController().get().then(({status, data}) => {
            if (!status) return;

            Session.set("cards", data);
        });
    }

    CityController.general().then(({status, data}) => {
        if (!status) return;

        Session.set("configGeneral", data);

        checkOptionMenu();
    });

    Route.pageDynamic(true);

    if (device.platform === "iOS") {
        StatusBar.hide();
        StatusBar.show();
        const number = parseInt(`${getComputedStyle(document.documentElement).getPropertyValue("--ios-area-bottom")}`.replace(/^\D+/g, ''))

        if(number > 0)
            document.body.classList.add("ios-content")
    }
});
