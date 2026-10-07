viewController.setObserver("report-trip", function ({report, tripReference}) {

    const elementProperty = new ElementProperty();

    elementProperty.getElement(".report-motive", element => {
        element.classList.add("active");
        element.innerHTML = `Relate-nos sobre: ${report.name}`;
    });

    window.addEventListener('keyboardDidShow', function () {
        elementProperty.getElement("#buttonKeyboard", element => element.style.display = "block");
        elementProperty.getElement("#buttonSend", element => element.style.display = "none");
    });

    window.addEventListener('keyboardDidHide', function () {
        elementProperty.getElement("#buttonKeyboard", element => element.style.display = "none");
        elementProperty.getElement("#buttonSend", element => element.style.display = "block");
    });

    elementProperty.addEventInElement("#buttonKeyboard", "onclick", sendMessage);

    elementProperty.addEventInElement("#buttonSend", "onclick", sendMessage);

    elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    function sendMessage() {
        const message = document.getElementById("textClient").value;

        if (message.trim().length <= 0) {
            SwalCustom.messageDialog("", "Por favor, informe motivo da ocorrência", undefined, "info");
            return;
        }

        preload(true);

        TripReportController
            .insertByCustomer({tripReportTypeId: report.idTripReportType, tripReference, message})
            .then(({status}) => {
                preload(false);

                if (!status) {
                    SwalCustom.messageDialog("", "Não foi possível registrar sua ocorrência!", undefined, "warning");
                    return;
                }

                document.getElementById("textClient").value = '';

                SwalCustom.messageDialog("Obrigado pelo contato", "Ocorrência registrada com sucesso!", function () {
                    Route.backPage();
                }, "success");
            });
    }

    viewController.onBack(()=>{
        elementProperty.getElement(".report-motive",element=>{
            element.classList.remove("active");
        })
    })
});
