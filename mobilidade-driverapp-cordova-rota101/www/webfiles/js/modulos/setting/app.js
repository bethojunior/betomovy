viewController.setObserver("app-setting", () => {
    const elementProperty = new ElementProperty();

    updateSetting();

    checkPermissionApp();

    updateStatusLocalBackground();

    showNavigationBySelected(Session.get("navigationBy"));

    document.addEventListener("resume", ()=>{
        checkPermissionApp();

        updateStatusLocalBackground();
    }, false);

    elementProperty.addEventInElement(".change-mode-accept", "onchange", function () {
        const setting = Session.get("appSetting");

        const {modeAcceptTrip} = setting;

        const attributeEdit = this.getAttribute("id");

        modeAcceptTrip[attributeEdit] = this.checked;

        const anotherAttribute = Object.keys(modeAcceptTrip).filter((attribute) => {
            return attributeEdit !== attribute;
        })[0];

        if (!modeAcceptTrip[attributeEdit] && !modeAcceptTrip[anotherAttribute])
            modeAcceptTrip[anotherAttribute] = true;

        setting.modeAcceptTrip = modeAcceptTrip;

        Session.set("appSetting", setting);

        updateSetting();
    });

    function updateSetting() {
        const setting = Session.get("appSetting");

        Object.keys(setting.modeAcceptTrip).map((attr) => {
            document.getElementById(attr).checked = setting.modeAcceptTrip[attr];
        })
    }

    elementProperty.addEventInElement("#btnClearNavigationBy", "onclick", function () {
        Session.delete("navigationBy");

        showNavigationBySelected(Session.get("navigationBy"));
    });


    function showNavigationBySelected(navigationBy) {
        elementProperty.getElement("#navigationBySelected", element => {
            if (Array.isArray(navigationBy))
                return element.innerHTML = '-';


            switch (navigationBy) {
                case "navigatorByGoogle": {
                    element.innerHTML = "Google";
                    break;
                }
                case "navigatorByWaze": {
                    element.innerHTML = "Waze";
                    break;
                }
            }
        });
    }

    Promise.all([
        TripPaymentFormController.getList(),
        DriverFormOfPaymentController.getAll(),
        DriverFormOfPaymentController.getAllImposition()
    ]).then((values) => {
        const {data: listPaymentForm} = values[0];
        const {data: listPaymentFormSelected} = values[1];
        const {data: listPaymentFormImposition} = values[2];

        document.querySelector("#listTripPaymentFormDriver").innerHTML = listPaymentForm.map(item => {
            return `<p messageRequired="Obrigatório">
                    <span>
                        <input type="checkbox" class="checkbox-trip-payment-form" id="tripPaymentFrom${item.idTripPaymentForm}" value="${item.idTripPaymentForm}"/>
                        <label for="tripPaymentFrom${item.idTripPaymentForm}">${item.name}</label>
                    </span>
                </p>`
        }).join("");

        listPaymentFormSelected.map(item => {
            const element = document.querySelector(`#tripPaymentFrom${item.tripPaymentFormId}`);
            element.checked = true;

            element.parentNode.parentNode.classList.remove("item-required");
        });

        listPaymentFormImposition.map(item => {
            const element = document.querySelector(`#tripPaymentFrom${item.tripPaymentFormId}`);
            element.checked = true;

            element.parentNode.parentNode.classList.add("item-required");
        });

        elementProperty.addEventInElement("#btnSaveChoicePaymentForm", "onclick", function () {
            const elements = document.querySelectorAll(".checkbox-trip-payment-form:checked");

            const tripPaymentForms = [];
            elements.forEach(element => {
                tripPaymentForms.push(element.value);
            });

            this.disabled = true;

            DriverFormOfPaymentController.insert(tripPaymentForms)
                .finally(() => {
                    this.disabled = false;
                });
        })
    });

    elementProperty.addEventInElement("#btnFilterPayment", "onclick", function () {
        navigator.notification.alert(getTextTranslate("setting-app", "message-filer-payment"), null, getTextTranslate("setting-app", "title-filer-payment"))
    });

    function updateStatusLocalBackground() {
        FloatingWidget.getPermissionLocation(
            () => {
                elementProperty.getElement("#textLocationBackground", element => {
                    element.innerText = getTextTranslate("setting-app", "text-location-background-active");
                });
                elementProperty.getElement("#btnPermissionLocalBackground", element => {
                    element.style.display = "none";
                });
            },
            () => {
                elementProperty.getElement("#textLocationBackground", element => {
                    element.innerText = getTextTranslate("setting-app", "text-location-background-no-active");
                });
                elementProperty.getElement("#btnPermissionLocalBackground", element => {
                    element.style = "";
                });
            });

        elementProperty.addEventInElement("#btnPermissionLocalBackground", "onclick", function () {
            FloatingWidget.askPermissionLocation(updateStatusLocalBackground, updateStatusLocalBackground);
        });


    }

    function checkPermissionApp() {
        positionLocation.verifyGps()
            .then(() => {
                viewController.elementProperty.addEventInElement("#containerStatusGPSApp","onclick",function(){});
                document.querySelector("#statusGPSApp").innerHTML = getTextTranslate("setting-app", "status-permission-active");
            })
            .catch(() => {
                viewController.elementProperty.addEventInElement("#containerStatusGPSApp","onclick",function(){
                    window.cordova.plugins.settings.open("location",console.log, console.log)
                });
                document.querySelector("#statusGPSApp").innerHTML = getTextTranslate("setting-app", "status-permission-disable");
            });

        if (FloatingWidget.checkSystemOverlayPermission)
            FloatingWidget.checkSystemOverlayPermission(({status}) => {
                if(status){
                    viewController.elementProperty.addEventInElement("#containerStatusOverlayScreenApp","onclick",function(){});
                    document.querySelector("#statusOverlayScreenApp").innerHTML = getTextTranslate("setting-app", "status-permission-active");
                }else{
                    viewController.elementProperty.addEventInElement("#containerStatusOverlayScreenApp","onclick",function(){
                        FloatingWidget.getPermission();
                    });
                    document.querySelector("#statusOverlayScreenApp").innerHTML = getTextTranslate("setting-app", "status-permission-disable");
                }
            });

        if (RequestIgnoreBatteryOptimizationCordova.checkPermission)
            RequestIgnoreBatteryOptimizationCordova.checkPermission(({status}) => {
                if(status){
                    viewController.elementProperty.addEventInElement("#containerStatusRequestIgnoreBatteryOptimization","onclick",function(){});
                    document.querySelector("#statusRequestIgnoreBatteryOptimization").innerHTML = getTextTranslate("setting-app", "status-permission-active");
                }else{
                    viewController.elementProperty.addEventInElement("#containerStatusRequestIgnoreBatteryOptimization","onclick",function(){
                        RequestIgnoreBatteryOptimizationCordova.requestPermission();
                    });
                    document.querySelector("#statusRequestIgnoreBatteryOptimization").innerHTML = getTextTranslate("setting-app", "status-permission-disable");
                }
            })
    }
});
