Route.waitView().then(() => {
    EmergencyMonitoringTypeController.findAll().then(({status, data}) => {
        if (!status)
            return;

        viewController.elementProperty.getElement("#listEmergencyMonitoringType", element => {
            element.innerHTML = data.map(item => {
                if(item.id !== '6'){
                return `<li class="waves-effect waves-light option-emergency-monitoring-type" value="${item.id}">
                            <span>${item.name}</span>
                            <i class="material-icons">
                                keyboard_arrow_right
                            </i>
                        </li>`;
                }
            }).join("");


            viewController.elementProperty.addEventInElement(".option-emergency-monitoring-type",
                "onclick", function () {
                    Route.backPage();

                    SwalCustom.messageDialog("", "Problema relatado para central", undefined, "success");

                    const {lat, lng} = Session.get("location");

                    SupportController.sendAlertHelp({
                        lat,
                        lng,
                        emergencyMonitoringTypeId: this.getAttribute("value")
                    }).then(({message}) => {

                    }).finally(() => {
                        this.classList.remove("active");
                    });
                });
        });
    });
});

function showOptionSecurityDriver() {
    Route.startClassesInComponent(
        [{component: ".container-option-security", class: "active"}],
        () => viewController.elementProperty.removeClass(".container-option-security", "active"));


    viewController.elementProperty.addEventInElement("#btnSecurityByPhone", "onclick", () => {

        const {lat, lng} = Session.get("lastPosition");

        SupportController.sendAlertHelp({lat, lng}).then(({message}) => {

        }).finally(() => {
            this.classList.remove("active");
        });

        const {securityContactNumber} = Session.get("cityConfig");

        if (!securityContactNumber)
            return SwalCustom.messageDialog("", "Não foi possível fazer ligação de segurança");

        window.plugins.CallNumber.callNumber((result) => {

        }, (result) => {
            SwalCustom.messageDialog("", "Ops... não foi possível fazer a ligação", undefined, "warning");
        }, securityContactNumber, true);
    });

}