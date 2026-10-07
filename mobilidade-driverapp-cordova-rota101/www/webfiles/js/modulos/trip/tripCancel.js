$(document).ready(function () {
    const userLogged = Session.get("user");

    const cancelTrip = {
        driverId: parseInt(userLogged.idDriver),
        tripReference: "",
        cancellationReasonsId: null
    };

    const elementProperty = new ElementProperty();
    const driverController = new DriverController();
    const cancellationReasonsController = new CancellationReasonsController();

    cancellationReasonsController.GetAll().then(result => {
        elementProperty.getElement(".options-cancel-default", elementContainer => {
            elementContainer.innerHTML = "";

            result.data.map(cancellation => {
                elementContainer.innerHTML += `<li class="option-cancel" 
                    value="${cancellation.idCancellationReasons}">${cancellation.name}</li>`;
            });

            initEventSelectedCancellation();
        });
    });

    function initEventSelectedCancellation() {
        elementProperty.addEventInElement(".option-cancel", "onclick", function () {
            elementProperty.getElement(".option-cancel", element => element.classList.remove("active"));
            this.classList.add("active");
            cancelTrip.cancellationReasonsId = parseInt(this.getAttribute("value"));

        });
    }

    elementProperty.addEventInElement(".btn-cancel-trip", "onclick", () => {

        if (cancelTrip.cancellationReasonsId === null) {
            SwalCustom.messageDialog(getTextTranslate("cancel-trip", "message-reason-required"), getTextTranslate("cancel-trip", "title-reason-required"));
            return;
        }

        const trip = Session.get("tripDriver");

        if (trip.status === STATUS_BOARDING_TRIP && customerWaitTime.calculatePercentTime() >= 100) {
            const cityConfig = Session.get("cityConfig");
            if (!Array.isArray(cityConfig)) {
                if (cityConfig.allowDriverGenerateCancellationFee == true) {
                    SwalCustom.dialogConfirm(getTextTranslate("cancel-trip", "text-cancellation-fee"), "", (status) => {
                        if (status == null)
                            return;
                        cancelTripByDriver(true, status);
                    });
                    return;
                }
            }
            cancelTripByDriver(true);
            return;
        }

        SwalCustom.dialogConfirm(getTextTranslate("cancel-trip", "title-reason-required"), getTextTranslate("cancel-trip", "alert-penalties"), (status) => {
            if (!status)
                return;
            cancelTripByDriver();

        }, {
            yes: {
                text: getTextTranslate("cancel-trip", "btn-continue"),
                value: true,
            },
            no: {
                text: getTextTranslate("cancel-trip", "btn-no"),
                value: false,
            },
        })
    });

    function cancelTripByDriver(getCardToken = false, generateCancellationFee = true) {
        const trip = Session.get("tripDriver");

        cancelTrip.tripReference = trip.tripReference;
        cancelTrip.generateCancellationFee = generateCancellationFee;

        if (Array.isArray(Session.get("paymentInfo")) || !getCardToken) {
            PreloadRequest.progress(getTextTranslate("cancel-trip", "progress-canceling"));
            driverController.cancelTrip(cancelTrip).then(({status}) => {
                if (!status) {
                    PreloadRequest.info(getTextTranslate("cancel-trip", "error-3-cancel-trip"));
                    return;
                }
                PreloadRequest.success(getTextTranslate("cancel-trip", "success-cancel-trip"));
                clearDataTrip();
            });
        } else {
            PreloadRequest.progress(getTextTranslate("cancel-trip", "manager-data-cancel"));
            const paymentCard = new PaymentCard();
            paymentCard.createToken(Session.get("paymentInfo"), (response) => {
                if (!response) {
                    PreloadRequest.info(getTextTranslate("cancel-trip", "error-1-cancel-trip"));
                    return;
                }

                Session.set("mptoken", response.id);

                PreloadRequest.progress(getTextTranslate("cancel-trip", "progress-canceling"));

                driverController.cancelTrip(cancelTrip).then((status) => {
                    if (!status) {
                        PreloadRequest.info(getTextTranslate("cancel-trip", "error-2-cancel-trip"));
                        return;
                    }
                    PreloadRequest.success(getTextTranslate("cancel-trip", "success-cancel-trip"));
                    clearDataTrip();
                }).finally(() => {
                    Session.delete("mptoken");
                });
            });
        }
        Route.backPage();
        elementProperty.visibleElements([".container-info-trip"], false);
        elementProperty.getElement(".option-cancel", element => element.classList.remove("active"));
        cancelTrip.cancellationReasonsId = null;
    }

    elementProperty.addEventInElement(".close-cancel-trip", "onclick", () => {
        Route.backPage();
    });
});
