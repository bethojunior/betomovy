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

    TripRepository.cancel(managerTrip.tripCurrent.tripReference)
        .then(function ({status}) {
            if (!status) {
                SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
                return;
            }
            stopProgressTrip();
            managerTrip.isSearch = false;
            Session.deleteLocal('tripReference');
        }).catch(() => {
        SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
    }).finally(()=>{
        // Usa utilitário que verifica o estado do menu antes de alterar o botão
        updateBtnCallTripVisibility();
        viewController.elementProperty.removeClass(".container-preload-main","active");
    });
}