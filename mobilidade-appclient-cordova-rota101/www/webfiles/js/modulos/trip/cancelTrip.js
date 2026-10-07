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

const cancelTrip = {
    cancellationReasonsId: null
};

function cancelSearchTrip(status = STATUS_CANCELED) {

    viewController.elementProperty.addClass(".container-cancel-request-trip", "active");

    viewController.elementProperty.addEventInElement("#btnCancelModalTripRequest", "onclick", function () {
        viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
    });

    viewController.elementProperty.addEventInElement("#btnCancelTripRequest", "onclick", function () {
        viewController.elementProperty.removeClass(".container-cancel-request-trip", "active");
        preload(true);
        cancelTripByCustomer(status)

    });
}

function initEventSelectedCancellation() {
    elementProperty.addEventInElement(".option-cancel", "onclick", function () {
        elementProperty.getElement(".option-cancel", element => element.classList.remove("active"));
        this.classList.add("active");
        cancelTrip.cancellationReasonsId = parseInt(this.getAttribute("value"));
    });
}

function cancelTripByCustomer(status){
    const customerController = new CustomerController();
    customerController.actionCancel(
        managerTrip.tripCurrent.tripReference,
        userLogged.idUser, 
        DateCustom.getNow(), 
        status,
        cancelTrip.cancellationReasonsId
    ).then(function ({status, data}) {
            preload(false);
            if (!status) {
                SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
                return;
            }
            cancelTrip.cancellationReasonsId = null
            viewController.elementProperty.removeClass(".container-cancel-trip", "active");
            stopProgressTrip();
        }).catch((error) => {
        preload(false);
        SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");
    });
}