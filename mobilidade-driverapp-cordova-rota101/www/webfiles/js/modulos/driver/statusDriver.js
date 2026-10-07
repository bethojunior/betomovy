let graphicWeeklyEarnings = null;

function updateTripDriver() {
    if (!Array.isArray(Session.get("tripFinish"))) {
        searchTripProgress.stopProgress();
        sendTripOffline();
        return;
    }

    const driverController = new DriverController();

    const userLogged = Session.get("user");

            const refusedDriverController = new RefusedDriverController();

            refusedDriverController.findCustomersBlockedMe(userLogged.idDriver).then(result => {
                if (result.status) {
                    Session.set("customersBlockedMe", result.data);
                }
            });


    return new Promise(resolve => {
        driverController.find(userLogged.idDriver).then(result => {
            if (!result.status) {
                setTimeout(function () {
                    updateTripDriver();
                }, 1000);
                return;
            }
            const elementContainerPrepaid = document.querySelector('.container-prepaid-driver');

            if(Number(result?.data?.prepaid) && result?.data?.prepaidData) {
                elementContainerPrepaid.classList.add('active');
                elementContainerPrepaid.innerHTML = `${DateCustom.formatSecondsToDays(result?.data?.prepaidData?.timeRemainingInSecconds)} restantes para o vencimento do crédito`;
            }

            PreloadRequest.success("Informações atualizadas");

            if (localStorage.getItem("deliveryModalVisible") === "true") {
                const tripReference = localStorage.getItem("tripReference");
                if (tripReference) {
                  const ifoodCode = new IfoodCode();
                  ifoodCode.onCodeValidated = () => {
                    localStorage.removeItem("deliveryModalVisible");
                    localStorage.removeItem("tripReference");
                    const trip = Session.get("tripDriver");
                    if (trip) responseStatusTrip({ status: true, data: trip });
                  };
                  ifoodCode.setDetail(tripReference);
                }
              }

            Session.set("configLocation", result.data.config);

            getConfigByCity(Session.get("lastPosition")).then(() => {
                initConfigLocation();
                verifyExistTrip(result);
                updateInfoDriver(result);
                driverIsCooperative(result);
                updateMenuReferralMonetization(result.data.referralMonetization);
                checkPrepaid();
                checkPreAvailable();
                PreloaderCustomer.hidden();
                backInitZoom();
                statusDriver();
                verifyReturnIsActive();
                changePostTemplate();
                checkLayoutLite();
                checkAppV2();
                viewController.elementProperty.removeClass(".container-splash", "active");
                setTimeout(() => {
                    viewController.elementProperty.addClass(".container-splash", "disabled");
                }, 500);
                resolve();
            });
        }).catch((err) => {
            setTimeout(function () {
                updateTripDriver();
            }, 1000);
        });
    })
}

function checkAppV2() {
    if (document.querySelector(".map").classList.contains("lite-map"))
        return;

    const element = document.body;
    if (!element.classList.contains("v2"))
        if (ConfigGeneral().get("enable_driver_v2") == true && ConfigGeneral().get("travel_only_by_offer") == false)
            element.classList.add("v2");
}

function checkLayoutLite() {
    const user = Session.get("user");

    if (ConfigGeneral().get("lite_map_option") == true || user.isDeliveryMan == true) {
        if (user.isDeliveryMan == true) {
            viewController.elementProperty.getElement("#containerQuantityCall", element => {
                element.style.display = "none";
            })
        }
        viewController.elementProperty.addClass(".map", "disabled-map", "lite-map");
        viewController.elementProperty.addClass(".container-qrcode-driver", "lite-map");
        viewController.elementProperty.addClass(".btn-taximetro", "lite-map");
        viewController.elementProperty.addClass(".container-taximetro", "lite-map");
        document.querySelector(".preload-request.lite-map").style = "";
        document.querySelector("body").classList.remove("v2");
    }
}

function verifyReturnIsActive() {
    const userLogged = Session.get("user");

    if (userLogged.stationId !== null) {
        viewController.elementProperty.addClass("#isReturnActive", "active");
        return;
    }

    viewController.elementProperty.removeClass("#isReturnActive", "active");
}

function updateInfoDriver(result) {
    const userLogged = Session.get("user");

    updateStatusRealtime(result.data.config.status_realtime_database);

    userLogged.stationId = result.data.stationId;
    userLogged.status = result.data.status;
    userLogged.driverRegisterStatusId = result.data.driverRegisterStatusId;
    userLogged.reasons = result.data.reasons;
    userLogged.preAvailable = result.data.preAvailable;
    userLogged.preAvailableTrip = result.data.preAvailableTrip;
    userLogged.driverRegisterStatus = result.data.driverRegisterStatus;
    userLogged.car = result.data.car;
    userLogged.totalFinishedTrip = result.data.total_finished_trip;
    userLogged.name = result.data.name;
    userLogged.nickname = result.data.nickname;
    userLogged.isDeliveryMan = result.data.isDeliveryMan;
    userLogged.phone = result.data.phone;
    userLogged.rating = result.data.rating;
    userLogged.cooperative = result.data.cooperative;
    userLogged.profileImage = result.data.profileImage;
    userLogged.referralMonetization = result.data.referralMonetization;
    userLogged.tripTypes = result.data.tripTypes;
    userLogged.docsUser = result.data.docsUser;
    userLogged.profileImageStatus = result.data.profileImageStatus;
    userLogged.profileImageTemp = result.data.profileImageTemp;

    Session.set("user", userLogged);

    verifyFunctionsDriver();
    verifyStatusPendencyDriver();
    updateDataMenu();
    verifyProfilePicture();
    verifyBalance(result.data);
    checkValidateAccountBank();
    return userLogged;
}

function checkValidateAccountBank() {
    if (ConfigGeneral().get("enable_document_validation_confiance_bank") == true) {
        const user = Session.get("user");
        DriverController.validateAccountBank(user.idDriver).then(({data, status}) => {
            if(!status)
                return;
            Session.set("validationAccountBack", data);

            if (data.status == false){
                 SwalCustom.messageDialog("",data.message,()=>{
                 });

                activeSearchTrip(false);
            }
        });
    }
}

function verifyBalance(data) {
    if (!Array.isArray(Session.get("alertedDriver")) || !Array.isArray(Session.get("tripDriver"))) {
        return;
    }
    if (data.prepaid == true) {

        if (parseFloat(data.balance.balance) <= 0) {
            Session.set("alertedDriver", true, false);
            return SwalCustom.messageDialog('Compre mais crédito para realizar novas corridas', 'Você utilizou todo o seu saldo');
        }
    }

    const cityConfig = Session.get("cityConfig");

    let value = parseFloat(cityConfig.maximumAmountNegativeBalanceDriver) ?
        parseFloat(cityConfig.maximumAmountNegativeBalanceDriver) * (-1) :
        parseFloat(ConfigGeneral().get("max_amount_for_receipt_in_vehicle")) * (-1);

    if (value == 0)
        return;

    if (parseFloat(data.balance.balance) <= value) {
        const buttons = {
            yes: {
                text: "Pagar",
                value: true,
            }
        }
        Session.set("alertedDriver", true, false);
        Session.set("balanceNegative", true);
        return SwalCustom.dialogConfirm('Você agora receberá apenas corridas no cartão', 'Você atingiu o limite de valor negativo', () => {
            Route.redirectDynamic("Financial", "Account");
        }, buttons );
    }

    Session.set("balanceNegative", false);

    if (parseFloat(data.balance.balance) < 0) {
        Session.set("alertedDriver", true,false);
        return SwalCustom.messageDialog('', 'Seu saldo está negativo');
    }
}

function verifyProfilePicture() {
    const user = Session.get("user");

    if (user.profileImage == null) {
        viewController.elementProperty.addClass(".container-update-profile", "active");

        viewController.elementProperty.addEventInElement(".edit-profile-picture", "onclick", () => {
            if (ConfigGeneral().get("enable_driver_open_gallery") == true) {
                navigator.notification.confirm(getTextTranslate("edit-profile", "dialog-mode-capture"), (status) => {
                        let type = null;

                        if (status === 1)
                            type = Camera.PictureSourceType.CAMERA;

                        if (status === 2)
                            type = Camera.PictureSourceType.SAVEDPHOTOALBUM;

                        if (type == null)
                            return;

                        updateProfilePicture(type);
                    }, getTextTranslate("edit-profile", "dialog-mode-capture-title"),
                    [
                        getTextTranslate("edit-profile", "type-camera"),
                        getTextTranslate("edit-profile", "type-gallery")
                    ]);
            } else {
                updateProfilePicture();
            }
        });
    }

    function updateProfilePicture(type = Camera.PictureSourceType.CAMERA) {
        const capturePhoto = new CapturePhoto();

        const {idUser} = Session.get("user");

        capturePhoto.get(type).then((path) => {
            FileUpload.getFile(path).then(file => {

                viewController.elementProperty.removeClass(".container-update-profile", "active");
                PreloadRequest.progress("Atualizando foto de perfil");

                DriverController.updateProfilePicture(idUser, file).then(resolve => {
                    if (!resolve.status) {
                        viewController.elementProperty.addClass(".container-update-profile", "active");
                        PreloadRequest.progress("Ocorreu um erro ao atualizar foto de perfil");
                        return;
                    }
                    PreloadRequest.success("Foto de perfil atualizada");
                    updateTripDriver();
                });
            });

        });
    }
}

function verifyFunctionsDriver() {
    const user = Session.get("user");

    if (user.isDeliveryMan == true) {
        viewController.elementProperty.getElement(".btn-taximetro", element => {
            element.style.display = "none";
        });
        viewController.elementProperty.getElement(".container-return-driver", element => {
            element.style.visibility = "hidden";
        });
        viewController.elementProperty.addClass(".button-float-datasheet", "hidden");
        viewController.elementProperty.addClass(".container-qrcode-driver", "hidden");
    } else {
        checkFunctionByCity(Session.get("cityConfig"));
    }
}

function checkPrepaid() {
    const enable_credit_prepaid = Session.get("configGeneral").find(item => item.key === "enable_credit_prepaid");

    if (!enable_credit_prepaid)
        return;

    if (enable_credit_prepaid.value == false)
        return;

    document.querySelector("#openPrepaid").style.display = "block";
}


function updateMenuReferralMonetization(referralMonetization) {

    const monetizationEnabled = Session.get("configGeneral").find(item => item.key === "monetization_enabled");

    if (!monetizationEnabled)
        return;

    if (monetizationEnabled.value == false)
        return;

    document.querySelector(".container-menu-indication").style = "";
    document.querySelector("#itemMenuIndication").style = "";

    document.querySelector("#labelIndicationType").innerHTML = referralMonetization.label;
    document.querySelector("#labelUserIndications").innerHTML = referralMonetization.userIndications;
}

function updateStatusRealtime(status) {
    const configCity = Session.get("cityConfig");

    if (!Array.isArray(configCity)) {
        configCity.status_realtime_database = status;

        Session.set("cityConfig", configCity);
    }
}

function driverIsCooperative(result) {
    const userLogged = Session.get("user");

    if (userLogged.cooperative !== null) {
        const cooperative = Session.getValueInSession("user", "cooperative");

        if (cooperative !== undefined)
            if (cooperative.logo_image !== result.data.cooperative.logo_image ||
                Array.isArray(Session.get("imageCooperative")))
                updateImageCooperative(userLogged);

    }
}

function verifyExistTrip(result) {

    if (result.data.trip != null) {
        PreloadRequest.progress("Buscando dados da viagem");
        TripController.actionGet(result.data.trip.tripReference).then(({status, data}) => {
            PreloadRequest.clear();
            Session.set("tripDriver", data);
            showDataTrip();
        });
        if (result.data.trip.tripCallTypeId === TRIP_CALL_KNOB && Array.isArray(Session.get("tripCallKnob"))) {
            Session.set("tripCallKnob", true);
            viewController.elementProperty.addClass(".text-alert-driver", "active");
        }
    } else {
        setMonitoring(false);
        Session.delete("tripDriver")
        // if (!Array.isArray(lastTrip)) {
        //
        // }
    }
}

function updateStatisticsDriver() {
    const userLogged = Session.get("user");

    new DriverController().find(userLogged.idDriver, true).then(({data}) => {
        showDetailDriver(data);
    })
}

function showDetailDriver(driver) {
    const elementProperty = new ElementProperty();

    elementProperty.getElement("#quantityAcceptedCalls", element => {
        element.innerHTML = driver.statistics.quantity_accepted_calls;
    });
    elementProperty.getElement("#quantityCalls", element => {
        element.innerHTML = driver.statistics.quantity_calls;
    });
    elementProperty.getElement("#quantityCanceledCalls", element => {
        element.innerHTML = driver.statistics.quantity_canceled_calls;
    });
    elementProperty.getElement("#quantityRefusedCalls", element => {
        element.innerHTML = driver.statistics.quantity_refused_calls;
    });
    elementProperty.getElement("#quantityFinishedCalls", element => {
        element.innerHTML = driver?.statistics?.quantity_finished_calls || 0;
    });
    elementProperty.getElement("#valueCollected", element => {
        element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${driver.statistics.value_collected}`;
    });
    elementProperty.getElement("#valueTotalTodayTrip", element => {
        element.innerHTML = `${driver.statistics.value_collected}`;
    });
    elementProperty.getElement("#ratingDriver", element => {
        element.innerHTML = Mask.maskMoney(parseFloat(driver.rating));
    });
    elementProperty.getElement("#negativeBalanceAmount", element => {
        let negativeBalanceAmount = null;
        const maximoNegativeValueCity = Session.get("cityConfig").maximumAmountNegativeBalanceDriver
        const maximoNegativeValueGeneral = Session.get("configGeneral").find(item => item.key === "max_amount_for_receipt_in_vehicle")
        if (maximoNegativeValueCity > 0) {
            negativeBalanceAmount = maximoNegativeValueCity;
        } else if (maximoNegativeValueGeneral.value > 0 && maximoNegativeValueCity == 0) {
            negativeBalanceAmount = maximoNegativeValueGeneral.value;
        }
        if(negativeBalanceAmount) {
            element.innerHTML = `Limite saldo Negativo: - R$ ${Mask.maskMoney(parseFloat(negativeBalanceAmount))}`;
        } 
    });


    const manager = {
        timeout: null
    };

    elementProperty.addEventInElement(".container-detail-driver", "ontouchend", function (event) {
        clearTimeout(manager.timeout);

        manager.timeout = setTimeout(() => {
            const width = document.querySelector(".container-detail-driver").offsetWidth;
            const positionScroll = document.querySelector(".container-detail-driver").scrollLeft;

            const positionItem = (positionScroll * 100 / width);

            const indication = document.querySelector(".count-item-detail");

            const endScroll = document.querySelector(".driver-graphic").offsetWidth;

            if (positionItem <= 50) {
                indication.firstElementChild.classList.add("active");
                indication.lastElementChild.classList.remove("active");

                $('.container-detail-driver')
                    .animate({scrollLeft: 0}, 150);
            } else {
                indication.firstElementChild.classList.remove("active");
                indication.lastElementChild.classList.add("active");
                $('.container-detail-driver')
                    .animate({scrollLeft: endScroll}, 150);
            }
        }, 150);

    });

    DriverController.weeklyEarnings(driver.idDriver)
        .then(({status, data}) => {
            const labels = [];

            const valueData = [];

            data.earnings.map((day) => {
                labels.push(day.slug);
                valueData.push(parseFloat(day.total_day));
            });

            viewController.elementProperty.getElement("#earningsTotal", element => {
                element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(data.earningsTotal)}`;
            });

            createGraphicWeeklyEarnings(labels, valueData);
        });
}

function createGraphicWeeklyEarnings(labels, data) {
    if (document.querySelector("#driverGraphicWeek").classList.contains("active")) {
        graphicWeeklyEarnings.data = {
            labels,
            datasets: [{
                data,
                backgroundColor: "#fff"
            }]
        };
        graphicWeeklyEarnings.update();
        return;
    }

    document.querySelector("#driverGraphicWeek").classList.add("active");

    const ctx = document.getElementById('driverGraphicWeek');
    graphicWeeklyEarnings = new Chart(ctx, {
        animationEnabled: false,
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: "#fff"
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false,
                position: 'bottom',
            },
            title: {
                display: false,
            },
            tooltips: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem, data) {
                        return `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(tooltipItem.yLabel))}`;
                    }
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        fontColor: "#fff", // this here
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        fontColor: "#fff", // this here
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return `${Mask.maskMoney(value)}`;

                        }
                    },
                }],
            }
        }
    });
}

function statusDriver() {

    const userLogged = Session.get("user");

    document.querySelector(".updateBalanceNow").classList.add("active");

    const elementProperty = new ElementProperty();

    elementProperty.getElement("#toggleStatusDriver", element => {
        elementProperty.getElement("#preloadLogin", element => {
            element.style.display = "none";
        });

        elementProperty.getElement(".footer-race", element => {
            element.style.display = "block";
        });

        if (userLogged.status === "corrida") {
            showDataTrip();
            return;
        }

        element.checked = (userLogged.status === "disponivel");

        setStatusDriver(element.checked);

        if (element.checked) {
            //checkTrip();
            searchTrip();
        }

        RetryUtils.withRetry(() => checkStatusDriver(parseInt(userLogged.idDriver), element.checked)).catch(() => {
            elementProperty.getElement("#toggleStatusDriver", element => {
                searchTripProgress.stopProgress();
                element.checked = false;
                setStatusDriver(element.checked);
            });
        });
    });
}

function setStatusDriver(status) {

    const elementProperty = new ElementProperty();

    elementProperty.removeClass("#enableOnlineDriver", "preloader");

    elementProperty.getElement("#textTripToggle", elementText => {

        if (status) {
            openWidgetFloating();
            elementProperty.addClass("#enableOnlineDriver", "hidden");
            elementProperty.removeClass("#disabledOnlineDriver", "offline");
            elementProperty.removeClass(".list-trip-bid-offer", "offline");
            elementProperty.removeClass(".content-only-offer-driver-modal", "offline");
            elementProperty.addClass(".button-float-datasheet", "active");
            const qrcode = document.querySelector(".btn-taximetro");
            if (qrcode) {
                qrcode.style = "";
            }
        } else {
            if (typeof clearPendingWidgetOpenAfterOverlayPermission === "function")
                clearPendingWidgetOpenAfterOverlayPermission();
            FloatingWidget.close();
            elementProperty.removeClass("#enableOnlineDriver", "hidden");
            elementProperty.addClass("#disabledOnlineDriver", "offline");
            elementProperty.addClass(".list-trip-bid-offer", "offline");
            elementProperty.addClass(".content-only-offer-driver-modal", "offline");
            elementProperty.removeClass(".button-float-datasheet", "active");

            const qrcode = document.querySelector(".btn-taximetro");
            if (qrcode) {
                qrcode.style.display = "none";
            }
        }

        elementProperty.getElement("#footerArrow", upArrow => {
            upArrow.classList.remove("stop");
            if (status)
                upArrow.classList.add("stop");

        });

        elementProperty.getElement(".container-qrcode-driver", element => {
            if (status) {
                element.style = "";
                return;
            }

            element.style.display = "none";
        });

        elementProperty.getElement("#map", element => {
            if (Session.getValueInSession("user", "status") === "corrida")
                return;

            if (status) {
                element.classList.remove("disabled");
                return;
            }
            element.classList.add("disabled");
        });

        if (status) {
            elementText.innerHTML = getTextTranslate("home", "text-trip-toggle-online");
            return;
        }
        elementText.innerHTML = getTextTranslate("home", "text-trip-toggle-offline");
    });
}

function checkStatusDriver(driverId, isActive) {
    const elementProperty = new ElementProperty();

    return new Promise((resolve, reject) => {
        /* StatusDriver.verifyStatusDriver(driverRegisterStatusId, isStatus)
             .then(resolve)
             .catch(reject);*/

        if (!isActive) {
            resolve();
            return;
        }

        DriverController.findWithPendencies(driverId).then(({status, data}) => {
            if (parseInt(data.driverRegisterStatusId) === StatusDriver.ACTIVE) {
                resolve();
                return;
            }

            showDocumentPending(data);
            reject();
        }).catch(reject);
    });
}

function getDetailDriver(accept) {

    const userLogged = Session.get("user");

    if (!accept) {
        //checkTrip();
        searchTrip();
        switch (Session.get("tripError")) {
            case "indisponivel" : {
                PreloadRequest.info(getTextTranslate("trip", "text-info-unavailable-trip"));
                break;
            }
            case "recursada" : {
                PreloadRequest.info(getTextTranslate("trip", "text-info-refused-trip"));
                break;
            }
        }

        return;
    }

    userLogged.status = "corrida";

    Session.set("user", userLogged);

    showDataTrip();

}