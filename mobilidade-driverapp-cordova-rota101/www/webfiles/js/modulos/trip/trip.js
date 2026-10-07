Route.waitView().then(() => {
    $('.modal').modal();

    window.plugins.insomnia.keepAwake();

    const elementProperty = new ElementProperty();

    const driverController = new DriverController();

    window.mapService = new MapService();

    const eventToucher = new EventTouche();

    const returns = new ChangeReturn();

    const moveLeft = -150;
    const moveRight = 150;

    let timeRequestPosition;
    let isLoadingCityConfig = false;

    checkModeApp();

    function checkModeApp() {
        if(ConfigGeneral().get("enable_map_dark_driver") == true) {
            setTimeout(checkModeApp, 60 * 1000)

            let date = new Date();

            if (date.getHours() >= 6 && date.getHours() < 18) {
                if (document.body.classList.contains("night-mode")) {
                    document.body.classList.remove("night-mode");
                    if (mapService.map)
                        mapService.map.setOptions({styles: mapService.checkMapMode()});
                }
                return;
            }

            if (!document.body.classList.contains("night-mode")) {
                document.body.classList.add("night-mode")

                if (mapService.map)
                    mapService.map.setOptions({styles: mapService.checkMapMode()});
            }
        }
    }

    window.initMapPosition = () => {
        if (Session.get("refusedLocalPermission") === true)
            return;
        Position.getCurrentMap().then(position => {
            getConfigByCity(position);

            mapService.initMap(position, () => {
                Session.set("lastPosition", position, false);
                showAdvertising(position);
                showVehicles();

                //mapService.setControllerMap(document.querySelector(".v2") != null);
                if (mapService.map != null)
                    mapService.setControllerMap(true);

                if (Session.get("cityConfig").showDynamicAreaInMap == true) {
                    mapService.updateDynamicByArea(position);
                }

                getPositionDriver();
                returns.initEventReturn();
                updateRoute();

                elementProperty.addEventInElement(".move-map", "onclick", function () {
                    if (this.classList.contains("active")) {
                        enableMapController(false);
                    } else {
                        enableMapController(true);
                    }
                });

                setTimeout(() => {
                    mapService.isStartMap = true;
                }, 5000);
            });
        }).catch(error => {
            console.log(error);
            SwalCustom.messageDialog("Este aplicativo coleta dados de localização para habilitar sua proximidade de outros veículos e usuários mesmo quando o aplicativo está fechado ou não está em uso."
                , "Verifique sua permissões de localização do aplicativo", () => {
                    window.cordova.plugins.settings.open("application_details",
                        function () {
                            if (controllerMeter.gpsIsActive)
                                requestPermissionLocation();

                            clearTimeout(timeRequestPosition);

                            timeRequestPosition = setTimeout(function () {
                                initMapPosition();
                            }, 300);
                        },
                        function () {
                            clearTimeout(timeRequestPosition);

                            timeRequestPosition = setTimeout(function () {
                                initMapPosition();
                            }, 300);
                        });

                });
        });
    };


    Position.getPermission().then(() => {
        Position.getPermission().then(result => {
            if (result != null) {
                if (result.isPermissionBackground) {
                    viewController.elementProperty.addClass(".button-notify-user", "active");

                    document.querySelector("#listNotifyDriver").innerHTML +=
                        `<li id="settingLocalBackground">
                                            <div>
                                                <p>Configurações de localização</p>
                                                <small>O seu aplicativo está ativo na localização durante o uso. (Clique aqui e configurar para permitir o tempo todo)</small>
                                            </div>
                                            <i class="material-icons">chevron_right</i>
                                        </li>`;

                    viewController.elementProperty.addEventInElement("#settingLocalBackground", "onclick", function () {
                        window.cordova.plugins.settings.open("application_details",
                            function () {
                            },
                            function () {
                            });
                    });
                }
            }
        });
    }).finally(() => {
        sendTripOffline();
        generateQrcodeDriver();
        initMapPosition();
        initEventTaximetro();
        initEventScheduleTrip();
        RequestIgnoreBatteryOptimizationCordova.requestPermission();

        mapService.importScriptWithPlaces();
        cordova.plugins.backgroundMode.on('activate', function () {
            cordova.plugins.backgroundMode.disableWebViewOptimizations();
        });

        LogEvent.createDirMain("return", ["audio"]);
    });

    eventToucher.addEventDistanceHorizontal("#btnStatusDriver", moveLeft, moveRight,
        function (distance, parent, direction) {
            activeSearchTrip(direction !== "left");
        });

    elementProperty.addEventInElement("#enableOnlineDriver", "onclick", function () {
        activeSearchTrip(true);
    });
    elementProperty.addEventInElement("#disabledOnlineDriver", "onclick", function () {
        elementProperty.removeClass(".footer-race", "active");
        activeSearchTrip(false);
    });

    eventToucher.addEventDistanceHorizontal("#isReturnActive", -50, 50,
        function (distance, parent, direction) {

            const isActive = (direction !== "left");

            if (isActive) {
                if (!validateActiveReturn())
                    return;

                if (!parent.classList.contains("active")) {
                    parent.classList.add("active");
                    selectStationDefault();
                    return;
                }
                return;
            }
            parent.classList.remove("active");
            disabledStation();
        });

    function validateActiveReturn() {
        if (!document.getElementsByClassName("change-return")[0]) {
            SwalCustom.messageDialog("",
                "Você não tem endereço cadastrado para opção de retorno",
                undefined, "info");
            parent.classList.remove("active");
            return false;
        }

        return true;
    }

    elementProperty.addEventInElement("#isReturnActive", "onclick", function () {
        if (!validateActiveReturn())
            return;

        if (!this.classList.contains("active")) {
            this.classList.add("active");
            selectStationDefault();
            return;
        }

        this.classList.remove("active");
        disabledStation();
    });

    function selectStationDefault() {
        const elementDefault = document.getElementsByClassName("change-return")[0];
        if (!elementDefault)
            return;
        elementDefault.onclick();
    }

    window.disabledStation = () => {
        const userLogged = Session.get("user");

        driverController.defaultStation(userLogged.idDriver, null).then(({status, data, message}) => {
            if (!status) {
                SwalCustom.messageDialog("", message, disabledStation, "info");
                return;
            }

            userLogged.stationId = null;

            Session.set("user", userLogged);

            returns.userLogged = userLogged;

            returns.verifyReturn();

        }).catch(() => {
            setTimeout(disabledStation, 5000);
        });
    };

    window.activeSearchTrip = (enabled) => {

        if (enabled) {
            if (Session.get("refusedLocalPermission") === true) {
                SwalCustom.messageDialog(
                    "Ative a localização em segundo plano para ficar online.",
                    "Permissão de Localização",
                    () => {
                        Session.delete("refusedLocalPermission");
                        Position.getPermission().then(() => {
                            if (!mapService.map || !mapService.isStartMap) {
                                initMapPosition();
                            }
                        }).catch(() => {
                            Session.set("refusedLocalPermission", true, false);
                        });
                    }
                );
                return;
            }

            if (ConfigGeneral().get("enable_document_validation_confiance_bank") == true) {
                const data = Session.get("validationAccountBack");
                if (!Array.isArray(data) && data != null)
                    if (data.status == false) {
                        SwalCustom.messageDialog("", data.message, () => {
                        });

                        return;
                    }
            }
        }

        const userLogged = Session.get("user");

        if (!userLogged || !userLogged.idDriver || userLogged.driverRegisterStatusId === undefined) {
            updateTripDriver().then(() => {
                activeSearchTrip(enabled);
            });
            return;
        }

        const resolveCityId = function (config) {
            if (!config || Array.isArray(config)) return null;
            return config.cityId ?? config.idCity ?? null;
        };
        const cityConfig = Session.get("cityConfig");
        const cityIdFromConfig = resolveCityId(cityConfig);
        const hasCityConfig = cityConfig && !Array.isArray(cityConfig);
        if (!hasCityConfig) {
            if (isLoadingCityConfig) {
                return;
            }
            isLoadingCityConfig = true;
            CityController.getConfig(Session.get("lastPosition")).then(({status, data}) => {
                if (status && data) {
                    Session.set("cityConfig", data);
                    const cityId = resolveCityId(data) ?? userLogged.cityId ?? null;
                    if (cityId != null) {
                        Session.set("cityId", cityId);
                    }
                }
                isLoadingCityConfig = false;
                activeSearchTrip(enabled);
            }).catch(() => {
                isLoadingCityConfig = false;
                SwalCustom.messageDialog(
                    "Não foi possível carregar a configuração da cidade.",
                    "Tente novamente em instantes."
                );
            });
            return;
        }
        const cityIdToSet = cityIdFromConfig ?? userLogged.cityId;
        if (cityIdToSet != null) {
            Session.set("cityId", cityIdToSet);
        }

        elementProperty.getElement("#toggleStatusDriver", element => {

            if (element.checked === enabled)
                return;

            element.checked = enabled;

            if (enabled && !verifyBattery(parseInt(Session.get("battery"))))
                return;

            elementProperty.addClass("#enableOnlineDriver", "preloader");

            const statusDriver = (element.checked) ? "disponivel" : "desligado";

            RetryUtils.withRetry(() => checkStatusDriver(parseInt(userLogged.idDriver), element.checked)).then(() => {

                setStatusDriver(element.checked);

                searchTripProgress.stopProgress();

                const lastPosition = Session.get("lastPosition");
                const hasValidPosition = lastPosition && !Array.isArray(lastPosition) && lastPosition.lat != null && lastPosition.lng != null;
                const location = hasValidPosition ?
                    {latitude: lastPosition.lat, longitude: lastPosition.lng, date: lastPosition.date || new Date()} : null;

                const cityId = Session.get("cityConfig")?.cityId ?? userLogged.cityId ?? null;

                driverController.toggleStatus(userLogged.idDriver, statusDriver, location, cityId).then(result => {
                    try {
                        userLogged.status = result.data.status;
                        Session.set("user", userLogged);
                        try {
                            updateStatusRealtime(result.data.status_realtime_database);
                        } catch (err) {
                            console.error('Falha ao atualizar status em tempo real:', err);
                        }
                        initConfigLocation();
                        if (typeof emitDriverLocation === "function") {
                            emitDriverLocation();
                        }
                        if (element.checked && typeof searchTrip === "function") {
                            searchTrip();
                        }
                        startDriverOnlineLocationAndWidget();
                    } catch (err) {
                        console.error('Erro ao processar sucesso do toggle:', err);
                    }
                }).catch((error) => {
                    console.error('Ocorreu um erro ao tentar alterar status motorista:', error);
                    element.checked = !element.checked;
                    setStatusDriver(element.checked);
                    searchTripProgress.stopProgress();
                    SwalCustom.messageDialog("Ocorreu um erro ao tentar alterar seu status. Por favor, tente novamente.", "Atenção");
                })
            }).catch(() => {
                elementProperty.getElement("#toggleStatusDriver", element => {
                    searchTripProgress.stopProgress();
                    element.checked = false;
                    setStatusDriver(element.checked);
                });
            });

        });
    };

    elementProperty.addEventInElement(".apps-hotel", "onclick", function () {
        Route.redirectDynamic("Establishment", "Filter");
    });

    elementProperty.addEventInElement("#cancelTrip", "onclick", () => {
        viewController.elementProperty.removeClass(".container-notification-chat", "active");
        Route.startClassesInComponent([{component: ".container-cancel-trip", class: "active"}], () => {
            viewController.elementProperty.removeClass(".container-cancel-trip", "active");
        });
    });


    elementProperty.addEventInElement("#detailFreight", "onclick", () => {
        PreloadRequest.progress("Carregando dados do frete");
        TripController.actionGet(Session.get("tripDriver").tripReference).then(({data}) => {
            PreloadRequest.clear();
            showDetailFreight(data);

            Route.startClassesInComponent(
                [{component: ".container-detail-freight", class: "active"}],
                () => {
                    viewController.elementProperty.removeClass(
                        ".container-detail-freight",
                        "active"
                    );
                }
            );
        });
    });

    elementProperty.addEventInElement("#openChat", "onclick", function () {

        viewController.addParams("chat-trip", Session.get("tripDriver"));

        elementProperty.removeClass(".container-notification-chat", "active");

        Route.redirectDynamic("Driver", "Chat");
        clearNotification();
    });

    eventToucher.addEventDistanceHorizontal("#btnChangeStatusTrip", 90, 0, (distance, element, direction) => {
        if (direction !== "left") {
            return;
        }

        if (element.classList.contains("active"))
            return;

        if (typeof emitDriverLocation === "function") {
            emitDriverLocation();
        }

        try {
            const trip = Session.get("tripDriver");

            if (Array.isArray(trip)) {
                element.classList.add("active");
                PreloadRequest.clear();
                PreloadRequest.progress("Verificando status da corrida");
                return updateTripDriver().then(() => {
                    PreloadRequest.info("Ocorreu um erro ao mudar o status da corrida");
                    element.classList.remove("active");
                });
            }

            element.classList.add("active");

            const result = checkStatusTrip(trip);

            if (errorStatusTrip(result))
                return;
            result.callback(trip);

            if (!element.classList.contains("signal")) {
                element.classList.add("signal");
                return;
            }
            element.classList.remove("signal")
        } catch (error) {
            console.log(error);

            element.classList.add("active");
            PreloadRequest.progress("Verificando status da corrida");
            return updateTripDriver().then(() => {
                PreloadRequest.clear();
                PreloadRequest.info("Ocorreu um erro ao mudar o status da corrida");
                element.classList.remove("active");
            });
        }
    });

    elementProperty.addEventInElement(".footer-arrow", "onclick", function () {
        elementProperty.getElement(".footer-race", element => {
            if (element.classList.contains("active")) {
                element.classList.remove("active");
                return;
            }
            element.classList.add("active");
            updateStatisticsDriver();
        });
    });

    new EventTouche().addEventDistanceVertical('.footer-arrow', (distance) => {
        const pushUp = -50;
        const pushDown = 50;

        elementProperty.getElement(".footer-race", element => {
            if (distance < pushUp) {
                element.classList.add("active");
                updateStatisticsDriver();
            }

            if (distance > pushDown) {
                element.classList.remove("active");
            }
        });
    });

    Route.pageDynamic();

    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown(e) {
        e.preventDefault();
        Route.backPage();
    }

    elementProperty.addEventInElement("#zoomMap", "onclick", function () {
        elementProperty.getElement(".map", map => {
            elementProperty.getElement(".footer-race", footer => {

                if (map.classList.contains("active")) {
                    footer.classList.remove("zoom");
                    map.classList.remove("active");
                    mapService.zoomInDriver();
                    return;
                }
                map.classList.add("active");
                footer.classList.add("zoom");

                mapService.zoomBetweenPoints()
            });
        });
    });

    mapService.getKey().then(({status, data}) => {
        if (status)
            Session.set("keyGoogle", data);
    });

    function generateQrcodeDriver() {
        cordova.plugins.qrcodejs.encode('TEXT_TYPE',
            `${HOST_SITE}cliente/preregister/${Session.getValueInSession("user", "idDriver")}`,
            (base64EncodedQRImage) => {
                document.getElementById("containerQRCode").style.backgroundImage =
                    `url(${base64EncodedQRImage})`;
            }, (err) => {
                SwalCustom.messageDialog("Ocorreu um erro ao gerar qrcode", "Ops...", undefined, "info");
            }, {
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
            });
    }

    viewController.elementProperty.addEventInElement(".center-camera-map-position", "onclick", function () {
        mapService.setControllerMap(false);
        mapService.map.animateCamera({
            target: Session.get("lastPosition"),
            bearing: mapService.positionDriver.getRotation() + mapService.map.getCameraBearing(),
            zoom: mapService.setting.zoom,
            duration: 500
        }, () => {
            mapService.positionDriver.setRotation(0);
            mapService.setControllerMap(true);
        });
        mapService.isFollowCar = true;
        viewController.elementProperty.removeClass(".center-camera-map-position", "active");
    });

    ConfigController.general().then(({status, data}) => {
        if (!status)
            return;

        Session.set("configGeneral", data);
    })

});
