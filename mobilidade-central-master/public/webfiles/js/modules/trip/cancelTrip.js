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

function cancelTripByCustomer(status){
    viewController.elementProperty.addClass(".container-preload-main","active");

    const tripRef = managerTrip?.tripCurrent?.tripReference 
        || Session.getLocal('tripReference')
        || (typeof tripReference !== "undefined" ? tripReference : null);

    if (!tripRef) {
        stopProgressTrip();
        if (typeof managerTrip !== "undefined") {
            managerTrip.isSearch = false;
            managerTrip.tripCurrent = null;
        }
        Session.deleteLocal('tripReference');
        updateBtnCallTripVisibility();
        viewController.elementProperty.removeClass(".container-preload-main","active");
        return;
    }

    TripRepository.cancel(tripRef)
        .then(function (res) {
            const isSuccess = res && (res.status === true || res.status === 'true' || typeof res.status === "undefined" || res.data);
            if (!isSuccess) {
                SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
                return;
            }
            stopProgressTrip();
            if (typeof managerTrip !== "undefined") {
                managerTrip.isSearch = false;
                managerTrip.tripCurrent = null;
            }
            Session.deleteLocal('tripReference');
        }).catch(() => {
            stopProgressTrip();
            if (typeof managerTrip !== "undefined") {
                managerTrip.isSearch = false;
            }
            Session.deleteLocal('tripReference');
            SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
        }).finally(()=>{
            updateBtnCallTripVisibility();
            viewController.elementProperty.removeClass(".container-preload-main","active");
        });
}