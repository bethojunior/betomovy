viewController.setObserver("cancel-another-trip", (tripReference) => {
    const userLogged = Session.get("user");

    const cancelTrip = {
        driverId: parseInt(userLogged.idDriver),
        tripReference: tripReference,
        cancellationReasonsId: null
    };

    const elementProperty = new ElementProperty();

    const cancellationReasonsController = new CancellationReasonsController();
    const driverController = new DriverController();

    cancellationReasonsController.GetAll().then(result => {
        elementProperty.getElement(".options-cancel-another-default", elementContainer => {
            elementContainer.innerHTML = "";

            result.data.map(cancellation => {
                elementContainer.innerHTML += `<li class="option-cancel-wait" 
                    value="${cancellation.idCancellationReasons}">${cancellation.name}</li>`;
            });

            initEventSelectedCancellation();
        });
    }).catch(error => {
    });

    function initEventSelectedCancellation() {
        elementProperty.addEventInElement(".option-cancel-wait", "onclick", function () {
            elementProperty.getElement(".option-cancel-wait", element => element.classList.remove("active"));
            this.classList.add("active");
            cancelTrip.cancellationReasonsId = parseInt(this.getAttribute("value"));

        });
    }

    elementProperty.addEventInElement(".btn-cancel-another-trip", "onclick", () => {

        if (cancelTrip.cancellationReasonsId === null) {
            SwalCustom.messageDialog("Selecione um motivo do cancelamento", "Atenção");
            return;
        }

        SwalCustom.dialogConfirm("Atenção", "Cancelamentos pode lhe causar penalidades ! ", (status) => {
            if (!status)
                return;

            driverController.cancelTrip(cancelTrip).then(()=>{
                Route.goHomeBack();
            });

            cancelTrip.cancellationReasonsId = null;

        }, {
            yes: {
                text: "CONTINUAR!",
                value: true,
            },
            no: {
                text: "NÃO!",
                value: false,
            },
        })
    });
    elementProperty.addEventInElement(".go-back", "onclick", () => {
        Route.backPage();
    });
});
