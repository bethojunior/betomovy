viewController.setObserver("vehicle-driver", () => {
    const user = Session.get("user");

    document.querySelector("#brandDriverActive").innerHTML = user.car.brand || getTextTranslate('change-vehicle', 'text-uninformed');
    document.querySelector("#modelDriverActive").innerHTML = user.car.model || getTextTranslate('change-vehicle', 'text-uninformed');
    document.querySelector("#plateLicenseDriverActive").innerHTML = user.car.plate || getTextTranslate('change-vehicle', 'text-uninformed');
    document.querySelector("#yearDriverActive").innerHTML = user.car.year || getTextTranslate('change-vehicle', 'text-uninformed');
    document.querySelector("#colorDriverActive").innerHTML = user.car.color || getTextTranslate('change-vehicle', 'text-uninformed');
    document.querySelector("#renavamDriverActive").innerHTML = user.car.renavam || getTextTranslate('change-vehicle', 'text-uninformed');

    $("#plateLicenseEdit").inputmask({mask: ['AAA-9999', 'AAA9A99']});

    viewController.elementProperty.addEventInElement("#btnRequestChangeVehicle", "onclick", function () {
        updatePending();
        Route.startClassesInComponent([{
            component: ".modal-change-vehicle",
            class: "active"
        }], () => {
            viewController.elementProperty.removeClass(".modal-change-vehicle", "active");
            clearForm();
        })
    });

    viewController.elementProperty.addEventInElement("#btnSaveCarInsert", "onclick", () => {
        const request = {
            year: document.querySelector("#yearLicenseEdit").value,
            plate: document.querySelector("#plateLicenseEdit").value,
            model: document.querySelector("#modelDriverEdit").value,
            color: document.querySelector("#colorLicenseEdit").value,
            brand: document.querySelector("#brandDriverEdit").value,
            renavam: document.querySelector("#renavamLicenseEdit").value,
            driverId: user.idDriver
        };

        if (request.brand.length === 0)
            return SwalCustom.messageDialog("", getTextTranslate("change-vehicle","mark-required"));

        if (request.model.length === 0)
            return SwalCustom.messageDialog("", getTextTranslate("change-vehicle","model-required"));

        if (request.plate.length === 0)
            return SwalCustom.messageDialog("", getTextTranslate("change-vehicle","plate-required"));

        if (request.renavam.length === 0)
            return SwalCustom.messageDialog("", getTextTranslate("change-vehicle","renavam-required"));

        let regex = /^[a-zA-Z]{3}[0-9]{4}\b/;
        let newRegex = /^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}\b/;

        if (!regex.test(request.plate.replace("-", "")) && !newRegex.test(request.plate.replace("-", "")))
            return SwalCustom.messageDialog("", getTextTranslate("change-vehicle","plate-invalid"));

        if (request.year.length === 0)
            return SwalCustom.messageDialog("", getTextTranslate("change-vehicle","year-required"));

        if (request.color.length === 0)
            return SwalCustom.messageDialog("", getTextTranslate("change-vehicle","color-required"));

        viewController.elementProperty.addClass(".container-preload-vehicle", "active");

        CarController.insertSecondCar(request)
            .then(({status}) => {
                if (status) {
                    SwalCustom.messageDialog("", getTextTranslate("change-vehicle","success-change-car"),
                        () => {
                            Route.backPage();
                        }, "success");
                } else {
                    SwalCustom.messageDialog("", getTextTranslate("change-vehicle","error-change-car"), null,
                        "info");
                }
            })
            .finally(() => {
                viewController.elementProperty.removeClass(".container-preload-vehicle", "active");
            });
    });

    function clearForm() {
        document.querySelector("#yearLicenseEdit").value = "";
        document.querySelector("#plateLicenseEdit").value = "";
        document.querySelector("#modelDriverEdit").value = "";
        document.querySelector("#colorLicenseEdit").value = "";
        document.querySelector("#brandDriverEdit").value = "";
        document.querySelector("#renavamLicenseEdit").value = "";
        document.querySelector("#btnSaveCarInsert").innerText = getTextTranslate("change-vehicle","btn-send-new-data-car");
        document.querySelector("#btnSaveCarInsert").disabled = false;
    }


    function updatePending() {
        CarController.findAllPendingByDriver(user.idDriver).then(({data}) => {
            if (data != null) {
                document.querySelector("#yearLicenseEdit").value = data.year;
                document.querySelector("#plateLicenseEdit").value = data.plate;
                document.querySelector("#modelDriverEdit").value = data.model;
                document.querySelector("#colorLicenseEdit").value = data.color;
                document.querySelector("#brandDriverEdit").value = data.brand;
                document.querySelector("#renavamLicenseEdit").value = data.renavam;
                document.querySelector("#btnSaveCarInsert").innerText = getTextTranslate("change-vehicle","text-in-analysis");
                document.querySelector("#btnSaveCarInsert").disabled = true;
            } else {
                clearForm();
            }
        });
    }

    viewController.elementProperty.addEventInElement(".back-page", "onclick", () => Route.backPage());
});
