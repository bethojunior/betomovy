viewController.setObserver("add-corporate-route", () => {
    document.querySelector("#dateScheduleTripSelected").innerHTML =
        new Date(`${document.querySelector("#dateScheduleCorporateRoute").value}T00:00:00`).toLocaleDateString();

    viewController.elementProperty.addEventInElement(".go-back", "onclick", () => {
        Route.backPage();
    });

    viewController.onBack(() => {
        document.querySelector("#dateScheduleCorporateRoute").value = null;
    });

    viewController.elementProperty.getElement("#listScheduleAvailable", element => {
        element.innerHTML = ``;
        element.classList.remove("empty");
        ScheduleCorporateRouteController.availableOnDate(document.querySelector("#dateScheduleCorporateRoute").value).then(({data}) => {
            if (data.length === 0) {
                element.classList.add("empty");
            } else {
                element.innerHTML = data.map(item => {
                    return `<li>
                            <p><b>${getTextTranslate("corporate","text-route")}</b> <span>${item.title}</span></p>
                            <p><b>${getTextTranslate("corporate","text-schedule-time")}</b><span>${item.schedule}</span></p>
                            <button type="button" class="btn-schedule-corporate-route" item="${btoa(JSON.stringify(item))}">${getTextTranslate("corporate", "btn-schedule-corporate-route")}</button>
                        </li>`;
                }).join("");

                viewController.elementProperty.addEventInElement(".btn-schedule-corporate-route", "onclick", function () {
                    const item = JSON.parse(atob(this.getAttribute("item")));

                    SwalCustom.dialogConfirm(getTextTranslate("corporate", "confirm-scheduled-route"), "", (status) => {
                        if (status) {
                            preload(true);
                            ScheduleCorporateRouteController.createSchedule(item.id, document.querySelector("#dateScheduleCorporateRoute").value).then(({status}) => {
                                preload(false);
                                if (!status) {
                                    SwalCustom.messageDialog(getTextTranslate("corporate","message-error-request-schedule"), "")
                                } else {
                                    SwalCustom.messageDialog(getTextTranslate("corporate","message-success-request-schedule"), "", () => {
                                        Route.backPage();
                                    }, "success")
                                }
                            })
                        }
                    })
                })
            }
        });
    });

    function preload(status) {
        if (status) {
            window.plugins.spinnerDialog.show();
        } else {
            window.plugins.spinnerDialog.hide();
        }
    }
});
