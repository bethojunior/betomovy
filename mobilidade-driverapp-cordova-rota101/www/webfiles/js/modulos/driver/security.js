Route.waitView().then(() => {

    const elementProperty = new ElementProperty();

    let timeout = null;

    elementProperty.addEventInElement(".btn-security-drive", "onclick", function () {
        clearTimeout(timeout);

        this.classList.add("info");

        timeout = setTimeout(() => {
            this.classList.remove("info");
        }, 2500);
    });

    elementProperty.addEventInElement(".btn-security-drive", "ondblclick", function (event) {
        event.stopPropagation();

        clearTimeout(timeout);

        this.classList.remove("info")

        if (Session.get("configGeneral").find(item => {
            return item.value == true && item.key == "enable_security_button_options";
        }) != null)
            return showOptionSecurityDriver();

        if (this.classList.contains("active"))
            return;

        this.classList.add("active");

        const {lat, lng} = Session.get("lastPosition");

        SupportController.sendAlertHelp({lat, lng}).then(({message}) => {
            Materialize.toast(message, 4000);
        }).finally(() => {
            this.classList.remove("active");
        });
    });

    viewController.elementProperty.addEventInElement("#btnSecurityByPhone", "onclick", () => {

        const {lat, lng} = Session.get("lastPosition");

        SupportController.sendAlertHelp({lat, lng}).then(({message}) => {

        }).finally(() => {
            this.classList.remove("active");
        });

        const {securityContactNumber} = Session.get("cityConfig");

        if (!securityContactNumber) {
            Materialize.Toast.removeAll();
            return Materialize.toast("Não foi possível fazer ligação de segurança", 3000);
        }
        window.plugins.CallNumber.callNumber((result) => {

        }, (result) => {
            SwalCustom.messageDialog("", "Ops... não foi possível fazer a ligação", undefined, "warning");
        }, securityContactNumber.replace(/[^0-9\.]+/g, ''), true);
    });

    EmergencyMonitoringTypeController.findAll().then(({status, data}) => {
        if (!status)
            return;

        viewController.elementProperty.getElement("#listEmergencyMonitoringType", element => {
            element.innerHTML = data.map(item => {
                if(item.id !== '6') {
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

                    Materialize.toast("Problema relatado para central", 3000);

                    const {lat, lng} = Session.get("lastPosition");

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

    ConfigController.general().then(({status, data}) => {
        if (!status)
            return;

        Session.set("configGeneral", data);
    })
});

function showOptionSecurityDriver() {
    Route.startClassesInComponent(
        [{component: ".container-option-security", class: "active"}],
        () => viewController.elementProperty.removeClass(".container-option-security", "active"));
}
