Route.waitView().then(function () {

    const userLogged = Session.get("user");

    const typeDriverApp = 2;
    const typeCustomerApp = 4;

    const driverController = new DriverController();

    const elementProperty = new ElementProperty();

    const CODE_TAXI = "3";

    window.updateDataMenu = () => {
        const userLogged = Session.get("user");
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });

        const configPoweredBy = config?.find(obj => obj?.key === "lbl_powered_by");
        const isPoweredBy = configPoweredBy ? configPoweredBy?.value === "1" : false;

        if(!isPoweredBy) {
            if (document.querySelector(".powered-by"))
                document.querySelector(".powered-by").style.display = "none";
        } else {
            if (document.querySelector(".powered-by"))
                document.querySelector(".powered-by").style = "";
        }

        const imageName = userLogged.profileImage;
        const finalLink = `${picturesLink.value}driver/profile/compressed/${imageName}`

        if (userLogged.profileImage !== null){
            document.getElementById("imageUser").src = finalLink;
        }

        elementProperty.getElement(".menu-profile-drive", element => {
            element.style.backgroundImage = `url(${finalLink})`;
        });

        elementProperty.getElement("#nameUser", element => {
            element.innerHTML = userLogged.nickname;
        });

        elementProperty.getElement("#codeFavorite", element => {
            element.innerHTML = createCodeFavorite();
        });

        elementProperty.addEventInElement("#typeDriver", "onclick", function () {
            if (!userLogged.tripTypes)
                return;

            const values = userLogged.tripTypes.map(item => {
                return item.tripType || "";
            }).join("\n");

            navigator.notification.alert(values, null, "Tipos de chamados")
        });
    };

    updateDataMenu();

    elementProperty.addEventInElement("#logout", "onclick", function () {
        const trip = Session.get("tripDriver");

        new DriverController().toggleStatus(userLogged.idDriver, 'desligado');
        FloatingWidget.close();

        if (trip.length !== 0) {
            SwalCustom.dialogConfirm("Atenção",
                "Ao sair do aplicativo em corrida você estara cancelando a viagem !", (status) => {
                    if (status) {
                        new DriverController().cancelTrip({
                            tripReference: trip.tripReference,
                            driverId: userLogged.idDriver,
                            cancellationReasonsId: 4
                        }).then(() => {
                            Session.delete("imageCooperative");
                            Session.delete("user");
                            Object.keys(localStorage).forEach(k => { if (k !== "lastLogin") localStorage.removeItem(k) });
                            Route.redirect("Main")
                        })

                    }
                });
            return;
        }

        setTimeout(() => {
            Session.delete("user");
            Object.keys(localStorage).forEach(k => { if (k !== "lastLogin") localStorage.removeItem(k) });
            Route.redirect("Main");
        }, 500)
    });

    elementProperty.addEventInElement(".menu-profile-drive", "onclick", managerMenuApp);

    elementProperty.addEventInElement(".menu-close", 'onclick', managerMenuApp);

    elementProperty.addEventInElement(".close-menu-v2", "onclick", function () {
        Route.backPage();
    });

    function managerMenuApp() {
        elementProperty.getElement(".container-menu-options", element => {

            if (element.classList.contains("active")) {
                elementProperty.removeClass(".container-menu-options", "active");
                elementProperty.removeClass(".menu-close", "open");
                Route.removeGroupComponent(COMPONENT_MENU);
                return;
            }
            Route.startClassesInComponent([
                {component: ".container-menu-options", class: "active"},
                {component: ".menu-close", class: "open"},
            ], () => {
                elementProperty.removeClass(".container-menu-options", "active");
                elementProperty.removeClass(".menu-close", "open");
            }, COMPONENT_MENU);
        });
    }

    cordova.getAppVersion.getVersionNumber().then(function (version) {
        elementProperty.getElement("#appVersion", element => {
            element.innerHTML = `VERSÃO: ${version + " " + typeVersion}`;
        });

        if (!Array.isArray(Session.get("tokenPush")))
            driverController.updateVersion(userLogged.idDriver, version, Session.get("tokenPush"));

        Session.observeStorage("tokenPush", () => {
            driverController.updateVersion(userLogged.idDriver, version, Session.get("tokenPush"));
        });
    });

    elementProperty.addEventInElement("#shareApp", "onclick", function () {
        shareAppFor(typeDriverApp);
    });

    function anotherShareApp(appId) {
        elementProperty.addEventInElement("#typeShareAnother", "onclick", function () {
            Route.backPage();

            const {lat: latitude, lng: longitude} = Session.get("lastPosition");

            AppController.sharing({
                "userId": userLogged.idUser,
                "phone": null,
                "appId": appId,
                "formOfSharing": 'whatsapp',
                "location": {
                    latitude,
                    longitude
                }
            }).then(({status, data}) => {
                document.getElementById("btnSendShare").disabled = false;
                if (!status)
                    return;
                window.plugins.socialsharing.shareWithOptions({
                    message: data.message,
                    subject: '',
                    url: ``,
                }, (result) => {
                }, (error) => {
                });


            }).finally(() => {
                document.getElementById("btnSendShare").disabled = false;
            });
        });
    }

    function shareAppFor(appId) {

        anotherShareApp(appId);

        Route.startClassesInComponent([
                {component: ".container-modal-share-app", class: "active"}],
            () => {
                elementProperty.removeClass(".container-modal-share-app", "active")
            });

        document.querySelector("input[name='typeShare']").checked = true;

        Mask.setMaskPhone("#phoneUserShare");

        elementProperty.removeClass(".container-menu-options", "active");
        elementProperty.removeClass(".menu-close", "open");

        Route.removeGroupComponent(COMPONENT_MENU);

        elementProperty.addEventInElement("#btnSendShare", "onclick", () => {

            if (!ValidateForm.validatePhone(document.getElementById("phoneUserShare").value)) {
                SwalCustom.messageDialog("", "Numero do telefone invalído", undefined, "info");
                return;
            }

            const elementType = document.querySelector("input[name='typeShare']:checked");

            const number = document.getElementById("phoneUserShare").value.replace(/[^0-9]+/g, '');

            if (elementType.value === "sms") {
                Route.backPage();
                SwalCustom.messageDialog("", "Enviada mensagem por sms", undefined, "success");
            }

            const {lat: latitude, lng: longitude} = Session.get("lastPosition");

            document.getElementById("btnSendShare").disabled = true;

            AppController.sharing({
                "userId": userLogged.idUser,
                "phone": number,
                "appId": appId,
                "formOfSharing": elementType.value,
                "location": {
                    latitude,
                    longitude
                }
            }).then(({status, data}) => {
                document.getElementById("btnSendShare").disabled = false;
                if (!status)
                    return;

                if (elementType.value === "whatsapp") {

                    let target = `https://api.whatsapp.com/send?phone=+55${number}&text=${
                        encodeURIComponent(data.message)}`;

                    cordova.InAppBrowser.open(target, "_system", 'location=no');

                    document.getElementById("phoneUserShare").value = "";

                    Route.backPage();
                }
            }).finally(() => {
                document.getElementById("btnSendShare").disabled = false;
            });
        });
    }

    elementProperty.addEventInElement("#shareAppClient", "onclick", function () {
        shareAppFor(typeCustomerApp);
    });

    elementProperty.addEventInElement("#imageUser", "onclick", function () {
        Route.redirectDynamic("Driver", "PerfilDriver")
    });

    function createCodeFavorite() {
        const userLogged = Session.get("user");

        const name = removeAcento(userLogged.nickname).split("");

        const type = userLogged.userTypeId === CODE_TAXI ? "T" : "P";

        const characters = `${name[0].toUpperCase()}${name[name.length - 1].toUpperCase()}`;

        const code = `${("00000" + userLogged.idDriver).slice(-5)}`;

        return `${characters}${code}${type}`;
    }

    function removeAcento(text) {
        text = text.toLowerCase();
        text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
        text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
        return text;
    }

    elementProperty.addEventInElement("#openProfileInsta", "onclick", function () {
        cordova.InAppBrowser.open('instagram://user?username=704apps', '_system', 'location=yes');
    });

    elementProperty.addEventInElement(".container-balance-today", "onclick", function () {
        visibilityBalanceToday(this.classList.contains("hidden"));
    });

    function visibilityBalanceToday(status) {
        Session.set("isVisibleBalanceToday", status, true);

        elementProperty.getElement(".container-balance-today", element => {
            if (status) {
                element.classList.remove("hidden");
            } else {
                if(document.querySelector(".updateBalanceNow").classList.contains("active")){
                    updateStatisticsDriver();
                    document.querySelector(".updateBalanceNow").classList.remove("active");
                }
                
                element.classList.add("hidden");  
            }
        });
    }

    if (Array.isArray(Session.get("isVisibleBalanceToday"))) {
        visibilityBalanceToday(false);
    } else {
        visibilityBalanceToday(Session.get("isVisibleBalanceToday"));
    }

    if (ConfigGeneral().get("enable_share_trip_app") == null ||
        ConfigGeneral().get("enable_share_trip_app") == false) {
        document.querySelector("#menuRouteFreight").style.display = "none";
    } else {
        document.querySelector("#menuRouteFreight").style = "";
    }

    if (ConfigGeneral().get("enable_route_corporate") == null ||
        ConfigGeneral().get("enable_route_corporate") == false) {
        document.querySelector("#menuRouteCorporate").style.display = "none";
    } else {
        document.querySelector("#menuRouteCorporate").style = "";
    }

    if (ConfigGeneral().get("enable_favorite_customer_and_driver") == null ||
        ConfigGeneral().get("enable_favorite_customer_and_driver") == false) {
        document.querySelector("#itemMenuCustomers").style.display = "none";
    } else {
        document.querySelector("#itemMenuCustomers").style = "";
    }

    if (userLogged.isDeliveryMan == true) {
        viewController.elementProperty.getElement("#itemMenuDeliveries", element => {
            element.style = ""
        })
    }

});

function comeBackIndexChat() {
    Route.backPage();
}
