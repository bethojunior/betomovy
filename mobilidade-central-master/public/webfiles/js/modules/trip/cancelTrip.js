function cancelTripDriverArrival(response){
    SwalCustom.dialogHTML(
        `O motorista está quase chegando...\n`,
        "",
        "info",
        {
            yes: {
                text: "SIM, CANCELAR",
                value: true,
                className: "confirmation-button",
            },
            no: {
                text: "NÃO!",
                value: false,
                className: "cancel-button",
            }

        },`<h4 style="color:red; font-size: 6vw">
                Proximidade: ${response.text} !
                </h4>`).then(cancelTripByCustomer);
}

function cancelSearchTrip(status = STATUS_CANCELED) {

    viewController.elementProperty.addClass(".container-cancel-request-trip", "active");

    viewController.elementProperty.addEventInElement("#btnCancelModalTripRequest", "onclick", function () {
        viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
    });

    viewController.elementProperty.addEventInElement("#btnCancelTripRequest", "onclick", function () {
        viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
        cancelTripByCustomer(status)

    });
}

function getActiveTripReference() {
    let ref = null;
    if (typeof managerTrip !== "undefined" && managerTrip?.tripCurrent?.tripReference) {
        ref = managerTrip.tripCurrent.tripReference;
    }
    if (!ref || typeof ref !== "string" || ref.trim().length === 0) {
        const stored = Session.getLocal("tripReference");
        if (typeof stored === "string" && stored.trim().length > 0 && stored !== "[]") {
            ref = stored.trim();
        } else if (Array.isArray(stored) && stored.length > 0 && typeof stored[0] === "string" && stored[0].trim().length > 0) {
            ref = stored[0].trim();
        }
    }
    if (!ref || typeof ref !== "string" || ref.trim().length === 0) {
        if (typeof window.tripReference === "string" && window.tripReference.trim().length > 0) {
            ref = window.tripReference.trim();
        }
    }
    return (ref && typeof ref === "string" && ref.trim().length > 0) ? ref.trim() : null;
}

function cancelTripByCustomer(status){
    viewController.elementProperty.addClass(".container-preload-main","active");

    const tripRef = getActiveTripReference();

    const cleanupLocalSearch = () => {
        try {
            stopProgressTrip();
        } catch (e) {}
        try {
            clearDataCar();
        } catch (e) {}
        try {
            viewController.elementProperty.removeClass(".trip-client", "active");
            viewController.elementProperty.removeClass("#mapWrapper", "in-trip");
        } catch (e) {}
        if (typeof initProcessingCallTrip === "function") {
            try {
                initProcessingCallTrip(true, true);
            } catch (e) {}
        }
        if (typeof managerTrip !== "undefined") {
            managerTrip.isSearch = false;
            managerTrip.inTrip = false;
            managerTrip.tripCurrent = null;
        }
        Session.deleteLocal("tripReference");
        try {
            updateBtnCallTripVisibility();
        } catch (e) {}
    };

    if (!tripRef) {
        cleanupLocalSearch();
        viewController.elementProperty.removeClass(".container-preload-main","active");
        return;
    }

    TripRepository.cancel(tripRef)
        .then(function (res) {
            cleanupLocalSearch();
        }).catch((err) => {
            console.warn("Cancel warning / network issue:", err);
            cleanupLocalSearch();
        }).finally(()=>{
            cleanupLocalSearch();
            viewController.elementProperty.removeClass(".container-preload-main","active");
        });
}