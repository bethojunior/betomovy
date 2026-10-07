const managerTripInWait = {
    timeout: null,
};

const managerGetTrip = {
    timeout: null,
    requestTrip: false,
    unsubscribeId: null,
};

function errorStatusTrip(objectStatus) {
    if (objectStatus == null) {
        PreloadRequest.progress("Ocorreu um erro no status dessa viagem");
        clearDataTrip();
        return true;
    }

    if (objectStatus.callback === false) {
        PreloadRequest.progress("Viagem já está finalizada");
        clearDataTrip();
        return true;
    }

    return false;
}

function checkCancellationFeeByCustomer(userId) {
    return new Promise((resolve, reject) => {
        ConnectionServer.sendRequest(
            "Customer/SearchValueCancellationFee",
            "POST",
            { userId },
            resolve,
            reject,
            undefined,
            false
        );
    });
}

function showDataTrip() {
    const elementProperty = new ElementProperty();

    const trip = Session.get("tripDriver");

    if (trip.length === 0) return;

    const objectStatus = checkStatusTrip(trip);

    if (errorStatusTrip(objectStatus)) return;

    viewController.elementProperty.removeClass(".container-advertising-banner", "active");

    if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER && trip.status === STATUS_IN_PROGRESS) {
        const hasWaypointNotConfirm = trip.tripWayPoints.find((item) => {
            return item.confirmed == false;
        });

        if (hasWaypointNotConfirm || trip.tripWayPoints.length === 0) return createLayoutInTrip();

        viewController.elementProperty.removeClass(".footer-race", "hidden-to-taximetro");
    } else {
        viewController.elementProperty.addClass(".btn-taximetro", "active");
    }

    if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) {
        viewController.elementProperty.addClass(".list-place-trip", "without-destination");
    } else {
        viewController.elementProperty.removeClass(".list-place-trip", "without-destination");
    }

    if (trip.tripCallTypeId === TRIP_FREIGHT) {
        viewController.elementProperty.getElement("#detailFreight", (element) => (element.style = ""));
    } else {
        viewController.elementProperty.getElement("#detailFreight", (element) => (element.style.display = "none"));
    }

    if (trip.tripCallTypeId === TRIP_CALL_CORPORATE || trip.tripCallTypeId === TRIP_CALL_RIDE) {
        if (trip.tripCallTypeId === TRIP_CALL_RIDE) {
            viewController.elementProperty.getElement("#showRouteInApp", (element) => {
                element.style = "";
            });
        } else {
            viewController.elementProperty.getElement("#showRouteInApp", (element) => {
                element.style.display = "none";
            });
        }
        viewController.elementProperty.addClass(".map", "disabled-map-corporate", "lite-map-corporate");
        document.querySelector("#openChat").style.display = "none";
        document.querySelector("#cancelTrip").style.display = "none";
        const chatRepository = new ChatRepository();
        chatRepository.getLastMessageUnread(trip.tripReference, (item) => {
            if (item.userId != Session.getValueInSession("user", "idUser")) {
                document.querySelector("#openCustomerChatRider").classList.add("active");
                viewController.elementProperty.getElement("#songNewMessageChat", (element) => {
                    element.play();
                });
            }
        });
    } else {
        document.querySelector("#openChat").style = "";
        document.querySelector("#cancelTrip").style = "";
    }

    const hideElements = [".toggle-status-driver", ".container-option-detail-status-driver"];

    const showElements = [".data-trip", ".status-running"];

    clearSearchinCarMap();

    elementProperty.getElement(".info-trip", (element) => (element.style = ""));

    elementProperty.getElement(".footer-race", (element) => {
        if (!element.classList.contains("active")) element.classList.add("active");

        element.classList.add("min-v2");
        element.classList.add("in-trip-active");
    });

    elementProperty.getElement(".footer-arrow", (element) => {
        element.style.display = "none";
    });

    if (trip.tripReference === Session.get("tripInWait")) {
        openInfoTripInWait(trip);
    }

    elementProperty.visibleElements(hideElements, false);

    elementProperty.visibleElements(showElements, true);

    mapService.existTrip = true;

    updateWaypoints();

    elementProperty.removeClass(".footer-race", "minimize");

    showDataCustomerTrip(trip);
    //showBonusTripFinish(trip);
    showPlaceTrip(trip);

    if (typeof initTripRide === "function") initTripRide(trip);

    checkCancellationFeeByCustomer(trip.userId).then(({ data }) => {
        Session.set("valueCancellationFeeByCustomer", data);
    });

    viewController.elementProperty.addClass(".button-float-datasheet", "active");

    changeStatusNameTrip(objectStatus.message, objectStatus.status);

    if (chatNotification)
        chatNotification.observerNotification(trip, () => {
            viewController.addParams("chat-trip", Session.get("tripDriver"));
            Route.redirectDynamic("Driver", "Chat");
            clearNotification();
        });

    updateRoute();

    updateDataTrip(trip.tripReference);

    viewController.elementProperty.addClass(".schedule-bar", "hidden");
    viewController.elementProperty.removeClass("#map", "disabled");
    viewController.elementProperty.removeClass(".content-only-offer-driver-modal", "active");

    changePostTemplate();
}

function showPlaceTrip(trip) {
    viewController.elementProperty.getElement(".match", (element) => {
        element.innerHTML = trip.origin.address;
    });

    viewController.elementProperty.getElement(".destiny", (element) => {
        element.innerHTML = trip.destination.name;
    });

    viewController.elementProperty.addEventInElement(".list-place-trip", "onclick", function () {
        if (trip.tripCallTypeId !== TRIP_CALL_RIDE) InfoClientTrip.showDataClientTrip(trip);
    });
}

function showDataCustomerTrip(trip) {
    if (trip.tripCallTypeId === TRIP_CALL_CORPORATE || trip.tripCallTypeId === TRIP_CALL_RIDE) {
        viewController.elementProperty.getElement(".container-info-customer-trip", (element) => {
            element.style.opacity = "0";
            element.style.paddingBottom = "0px";
            element.style.marginBottom = "0px";
        });
        return;
    } else {
        viewController.elementProperty.getElement(".container-info-customer-trip", (element) => {
            element.style = "";
        });
    }
    viewController.elementProperty.getElement(".profile-image-customer", (element) => {
        if (trip.customer != null) {
            if (trip.customer.profileImage == null) {
                element.style.backgroundImage = "url('webfiles/img/icon/default.jpg')";
                return;
            }
        } else {
            element.style.backgroundImage = "url('webfiles/img/icon/default.jpg')";
            return;
        }

        const config = Session.get("configGeneral");
        const picturesLink = config.find((item) => {
            return item.key === "link_storage_pictures";
        });

        if (trip.tripCallTypeId !== TRIP_CENTRAL) {
            const profileImage = trip.customer.profileImage;
            const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;

            // element.style.backgroundImage = `url('${CLIENT_PROFILE + trip.customer.profileImage}')`;
            element.style.backgroundImage = `url('${finalLink}')`;
        } else {
            // element.style.backgroundImage = `url('${PATH_IMAGE_CENTRAL + trip.customer.profileImage}')`;
            element.style.backgroundImage = `url('${picturesLink.value}${trip.customer.profileImage}')`;
        }
    });

    viewController.elementProperty.getElement("#nameClient", (element) => {
        if (trip.tripCallTypeId !== TRIP_CENTRAL) {
            if (trip.customer != null) element.innerHTML = trip.customer.name;
        } else {
            element.innerHTML = "Central";
        }
    });

    viewController.elementProperty.getElement(".container-qrcode-driver", (element) => {
        element.classList.remove("active");
        element.style.display = "none";
    });

    viewController.elementProperty.addEventInElement(".point-minimize", "onclick", () => {
        viewController.elementProperty.getElement(".footer-race", (element) => {
            if (element.classList.contains("minimize")) {
                element.classList.remove("minimize");
            } else {
                element.classList.add("minimize");
            }
        });
    });
}

function showBonusTripFinish(trip) {
    viewController.elementProperty.getElement(".value-trip", (element) => {
        const valueOffline = Session.get("infoUpdateTaximeter");

        if (!Array.isArray(valueOffline)) {
            element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(valueOffline.price))}`;
            return;
        }

        viewController.elementProperty.removeClass(".bonus-trip", "active");

        const hasDiscountCoupon =
            trip?.tripDiscountCoupon?.value == "100" && trip?.tripDiscountCoupon?.valueType == "%";

        if (trip.rewardTrip != null || hasDiscountCoupon) {
            viewController.elementProperty.getElement("#infoTripFinishBonus", (element) => {
                const config = Session.get("configGeneral");
                const textBonusFinishTrip = config?.find((item) => {
                    return item?.key === "text_the_end_trip_with_bonus";
                });

                element.innerHTML =
                    textBonusFinishTrip?.value ||
                    `   <span data-i18n="finish-trip-value-pay-by"></span>
                    <nameapp></nameapp>
                `;
            });

            viewController.elementProperty.getElement(".value-bonus", (element) => {
                element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(
                    parseFloat(hasDiscountCoupon ? trip.tripDiscountCoupon?.oldPrice : trip?.rewardTrip?.value)
                )}`;
            });

            viewController.elementProperty.addClass(".bonus-trip", "active");
        }

        if (trip.tripCallTypeId === TRIP_CALL_RIDE) {
            const totalRiders = trip.ride.riders.length;
            element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(trip.price) * totalRiders)}`;
            return;
        }

        const configCity = Session.get("cityConfig");
        const paymentFormTypeId = trip.paymentFormTypeId;

        if (paymentFormTypeId == 2 || paymentFormTypeId == 4 || paymentFormTypeId == 7) {
            element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(
                parseFloat(trip.recalculatedPrice?.newPrice || trip.price)
            )}`;
        } else {
            if (configCity.enabledDriverFields.accept.price == true) {
                element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(trip.price))}`;
            } else {
                element.innerHTML = `${CityConfig.getTypeCoin()} --`;
            }
        }
    });
}

function updateWaypoints() {
    const elementProperty = new ElementProperty();

    const trip = Session.get("tripDriver");

    elementProperty.getElement(".list-place-trip", (element) => {
        if (trip.status !== STATUS_IN_PROGRESS) {
            element.innerHTML = `<li class="active">${trip.origin.address}</li>`;
        } else {
            element.innerHTML = `<li class="success">${trip.origin.address}</li>`;
        }

        let inProgress = false;

        const waypoints = trip.tripWayPoints.filter((waypoint) => {
            if (trip.status !== STATUS_IN_PROGRESS) {
                element.innerHTML += `<li>${waypoint.address}</li>`;
            } else {
                if (waypoint.confirmed === "0" && !inProgress) {
                    inProgress = true;
                    element.innerHTML += `<li class="active">${waypoint.address}</li>`;
                } else {
                    if (waypoint.confirmed === "1") {
                        element.innerHTML += `<li class="success">${waypoint.address}</li>`;
                    } else {
                        element.innerHTML += `<li>${waypoint.address}</li>`;
                    }
                }

                return waypoint.confirmed === "0";
            }
        });

        if (waypoints.length === 0 && trip.status === STATUS_IN_PROGRESS) {
            element.innerHTML += `<li class="active">${trip.destination.name}</li>`;
        } else {
            element.innerHTML += `<li>${trip.destination.name}</li>`;
        }
    });
}

function openInfoTripInWait(trip) {
    clearTimeout(managerTripInWait.timeout);

    const elementProperty = new ElementProperty();
    elementProperty.getElement(".modal-evaluation", (element) => {
        if (element.classList.contains("active")) {
            managerTripInWait.timeout = setTimeout(() => openInfoTripInWait(trip), 2000);
            return;
        }
        Session.delete("tripInWait");

        InfoClientTrip.showDataClientTripWait(trip);
    });
}

function updateDataTrip(tripReference) {
    const cityConfig = Session.get("cityConfig");

    if (cityConfig.status_realtime_database) {
        updateTripInProgressInRealtime(tripReference);
    } else {
        updateTripInProgress(tripReference);
    }
}

function unsubscribeGetTripEvent() {
    if (managerGetTrip.unsubscribeId) {
        tripRealtime.unsubscribe(managerGetTrip.unsubscribeId);
        managerGetTrip.unsubscribeId = null;
    }
}

async function updateTripInProgressInRealtime(tripReference) {
    clearTimeout(managerGetTrip.timeout);

    unsubscribeGetTripEvent();

    async function handleGetTrip({ data, type }) {
        if (type === tripRealtime.typeModified || type === tripRealtime.typeAdded) {
            if (
                data.status === STATUS_SEARCHING ||
                data.status === STATUS_SEARCHING_FAVORITE ||
                data.status === STATUS_SCHEDULED ||
                data.status === STATUS_PRE_ACCEPTED
            )
                return;

            if (typeof emitDriverLocation === "function") {
                emitDriverLocation();
            }

            const currentTrip = Session.get("tripDriver");
            if (!Array.isArray(currentTrip)) {
                if (currentTrip.oldDestinationId !== data.oldDestinationId) {
                    SwalCustom.messageDialog(
                        "Cliente alterou o local do seu destino, siga para o novo trajeto",
                        "Alteração de rota na viagem",
                        () => {
                            showDataTrip();
                        }
                    );
                }

                // Preservar os pedágios se existirem no objeto atual e não existirem nos novos dados
                if (!data.tolls && currentTrip.tolls) {
                    data.tolls = currentTrip.tolls;
                }
            }

            // Se não há pedágios nos dados do Firestore, buscar da API de forma síncrona
            if (!data.tolls) {
                try {
                    const response = await TripController.actionGet(tripReference);
                    if (response.status && response.data && response.data.tolls) {
                        data.tolls = response.data.tolls;
                    }
                } catch (error) {
                    console.error("Erro ao buscar pedágios da API:", error);
                }
            }

            // Atualizar o objeto na sessão com todos os dados (incluindo pedágios se disponíveis)
            Session.set("tripDriver", data);

            //showBonusTripFinish(data);
            showDataCustomerTrip(data);
            showPlaceTrip(data);

            if (data.status === STATUS_BOARDING_TRIP) initCustomerWaitTime();

            if (data.status === STATUS_IN_PROGRESS) {
                customerWaitTime.stop();
                setMonitoring(true);
            }

            checkPreAvailable();
        }

        if (type === tripRealtime.typeRemoved) {
            if (typeof emitDriverLocation === "function") {
                emitDriverLocation();
            }

            unsubscribeGetTripEvent();

            TripController.actionGet(tripReference).then(async ({ status, data }) => {
                if (data.status === STATUS_FINISH_TRIP) {
                    try {
                        const current = Session.get("tripDriver");
                        if (!Array.isArray(current)) {
                            const currentNewPrice = current?.recalculatedPrice?.newPrice || current?.price;
                            // Se a API ainda não refletiu o preço, usa o da sessão
                            if (currentNewPrice && parseFloat(currentNewPrice) !== parseFloat(data.price)) {
                                data.price = String(currentNewPrice);
                                data.recalculatedPrice = Object.assign({}, data.recalculatedPrice || {}, {
                                    oldPrice: String(data.oldPrice || current.price),
                                    newPrice: String(currentNewPrice),
                                });
                            }
                        }
                    } catch (e) {
                        console.error("Falha ao preservar preço recalculado no retorno do finish", e);
                    }

                    // Atualize o trip na sessão antes de exibir o modal
                    Session.set("tripDriver", data);
                    modalFinishTrip(data);
                    return;
                }
                if (data.status === STATUS_CANCELED) {
                    if (data.canceledBy && data.canceledBy !== "driver") {
                        openAppForeground();

                        viewController.elementProperty.getElement("#songClientCancelTrip", (element) => {
                            element.play();
                        });

                        Route.goHomeBack();

                        const message = await (data.canceledBy !== "admin"
                            ? getMessageCancelTrip(data)
                            : getTextTranslate("trip", "message-cancel-trip-by-admin"));

                        SwalCustom.messageDialog(
                            message,
                            getTextTranslate("trip", "title-cancel-trip"),
                            () => {},
                            "error"
                        );
                    }
                    clearDataTrip();
                }
            });
        }
    }

    managerGetTrip.unsubscribeId = tripRealtime.getTrip(tripReference, handleGetTrip);
}

async function getMessageCancelTrip(data) {
    return TripController.getCancelMessage(data.tripReference).then((message) => {
        return message?.cancellationText || getTextTranslate("trip", "message-cancel-trip-by-customer");
    });
}

function updateTripInProgress(tripReference) {
    if (managerGetTrip.requestTrip) return;

    managerGetTrip.requestTrip = true;

    clearTimeout(managerGetTrip.timeout);

    const cityConfig = Session.get("cityConfig");

    if (cityConfig.status_realtime_database) return;

    TripController.actionGet(tripReference)
        .then(async ({ status, data }) => {
            if (data.status === STATUS_BOARDING_TRIP) initCustomerWaitTime();

            if (typeof emitDriverLocation === "function") {
                emitDriverLocation();
            }

            if (data.status === STATUS_FINISH_TRIP) {
                return;
            }

            if (data.status === STATUS_IN_PROGRESS) {
                customerWaitTime.stop();
                setMonitoring(true);
            }

            if (data.status === STATUS_CANCELED) {
                if (data.canceledBy && data.canceledBy !== "driver") {
                    openAppForeground();

                    viewController.elementProperty.getElement("#songClientCancelTrip", (element) => {
                        element.play();
                    });

                    Route.goHomeBack();

                    const message = await (data.canceledBy !== "admin"
                        ? getMessageCancelTrip(data)
                        : getTextTranslate("trip", "message-cancel-trip-by-admin"));

                    SwalCustom.messageDialog(message, getTextTranslate("trip", "title-cancel-trip"), () => {}, "error");
                }
                clearDataTrip();
                return;
            }

            //verifyCancelTripInWait(data);

            checkPreAvailable();

            const time = 5000;

            managerGetTrip.timeout = setTimeout(function () {
                updateTripInProgress(tripReference);
            }, time);
        })
        .catch((e) => {
            managerGetTrip.timeout = setTimeout(function () {
                updateTripInProgress(tripReference);
            }, 5000);
        })
        .finally(() => {
            managerGetTrip.requestTrip = false;
        });
}

function verifyTripPreAccepted(tripReference) {
    function handleTripPreAccepted({ data, type }) {
        if (type === tripRealtime.typeModified || type === tripRealtime.typeAdded) {
            if (
                data.status !== STATUS_PRE_ACCEPTED &&
                data.status !== STATUS_SEARCHING &&
                data.status !== STATUS_SEARCHING_FAVORITE
            ) {
                tripRealtime.unsubscribe(unsubscribeId);
            }
        }

        if (type === tripRealtime.typeRemoved) {
            tripRealtime.unsubscribe(unsubscribeId);

            TripController.actionGet(tripReference).then(({ status, data }) => {
                if (data.status === "canceled") {
                    if (data.canceledBy !== "driver") {
                        SwalCustom.messageDialog(
                            "",
                            getTextTranslate("trip", "title-cancel-trip-await"),
                            undefined,
                            "info"
                        );
                        openAppForeground();
                    }

                    new ElementProperty().removeClass(".option-trip-in-wait", "active");
                    managerPreAvailable.isSearch = false;

                    const user = Session.get("user");

                    user.preAvailableTrip = null;
                    user.preAvailable = "0";
                    verifyPositionPreAvailable();

                    Session.set("user", user);
                }
            });
        }
    }

    const unsubscribeId = tripRealtime.getTripPreAccepted(tripReference, handleTripPreAccepted);
}

function clearDataTrip() {
    setMonitoring(false);

    customerWaitTime.stop();

    Session.delete("tripCallKnob");
    Session.delete("valueCancellationFeeByCustomer");

    const userLogged = Session.get("user");

    const elementProperty = new ElementProperty();

    elementProperty.getElement("#btnChangeStatusTrip", (element) => {
        element.classList.remove("signal");
    });

    elementProperty.removeClass(".text-alert-driver", "active");

    userLogged.status = "disponivel";

    // if (typeof emitDriverLocation === 'function') {
    // emitDriverLocation();
    // }

    Session.set("user", userLogged);

    showScheduledBar();

    Session.delete("tripDriver");

    if (document.querySelector(".v2") != null)
        elementProperty.visibleElements([".container-option-detail-status-driver"], true);

    elementProperty.visibleElements([".toggle-status-driver"], true);

    elementProperty.visibleElements([".data-trip", ".status-running"], false);

    elementProperty.getElement(".container-menu-options", (element) => {
        element.classList.remove("active");
    });

    elementProperty.getElement(".menu-close", (element) => {
        element.classList.remove("open");
    });

    elementProperty.getElement(".footer-race", (element) => {
        element.classList.remove("active");
        element.classList.remove("min-v2");
        element.classList.remove("in-trip-active");
    });

    elementProperty.getElement(".container-qrcode-driver", (element) => {
        element.classList.remove("active");
        element.style = "";
    });

    elementProperty.getElement(".footer-arrow", (element) => {
        element.style.display = "block";
    });
    elementProperty.getElement(".status-running", (element) => {
        element.style.display = "none";
    });
    elementProperty.getElement(".map", (element) => {
        element.classList.remove("active");
    });

    viewController.elementProperty.removeClass(".map", "disabled-map-corporate", "lite-map-corporate");
    viewController.elementProperty.removeClass(".container-taximetro", "active", "start-taximetro");
    viewController.elementProperty.removeClass(".btn-taximetro", "active");

    elementProperty.removeClass(".footer-race", "minimize");

    managerPreAvailable.isSearch = false;

    chatNotification.closeChat();

    if (mapService.map != null) mapService.removeRoute();

    searchTripProgress.stopProgress();

    updateTripDriver();
}

function clearNotification() {
    const elementProperty = new ElementProperty();
    elementProperty.getElement(".amount-msg", (element) => {
        element.innerHTML = "";
    });
}

function changeStatusNameTrip(name, status, zIndex = 200) {
    const elementProperty = new ElementProperty();

    elementProperty.getElement("#btnChangeStatusTrip", (element) => {
        element.innerHTML = name;
        element.classList.remove("active");
    });

    elementProperty.getElement("#statusDriverTrip", (element) => {
        element.innerHTML = status;
    });

    elementProperty.getElement(".status-running", (element) => {
        element.style.zIndex = zIndex;
    });
}

function backInitZoom() {
    const elementProperty = new ElementProperty();

    elementProperty.getElement(".map", (map) => {
        elementProperty.getElement(".footer-race", (footer) => {
            if (!map.classList.contains("active")) return;

            footer.classList.remove("zoom");
            map.classList.remove("active");
            mapService.zoomInDriver();
        });
    });
}

function sendTripOffline() {
    PreloadRequest.progress(getTextTranslate("trip", "progress-update-info-offline"));

    new ElementProperty().getElement(".footer-race", (element) => {
        element.style.display = "none";
    });

    const driverController = new DriverController();
    const tripFinish = Session.get("tripFinish");

    if (tripFinish.length !== 0) {
        function requestFinish() {
            driverController
                .finishTripOffline(tripFinish.tripReference, {
                    date: tripFinish.dateFinish,
                    location: {
                        latitude: tripFinish.position.lat,
                        longitude: tripFinish.position.lng,
                    },
                })
                .then(() => {
                    Session.delete("tripFinish");
                    updateTripDriver();
                })
                .catch(() => {
                    setTimeout(sendTripOffline, 3000);
                });
        }

        if (tripFinish.tripCallTypeId === TRIP_CALL_TAXIMETER) {
            const infoUpdateTaximeter = Session.get("infoUpdateTaximeter");
            if (!Array.isArray(infoUpdateTaximeter)) {
                TaximeterTripController.update(infoUpdateTaximeter)
                    .then(() => {
                        Session.delete("infoUpdateTaximeter");
                        requestFinish();
                    })
                    .catch(() => {
                        setTimeout(sendTripOffline, 3000);
                    });
                return;
            }
        }

        requestFinish();

        return;
    }
    updateTripDriver();
}

function initCustomerWaitTime() {
    if (customerWaitTime.isActive) return;

    const cityConfig = Session.get("cityConfig");

    if (Array.isArray(Session.get("customerWaitTime"))) Session.set("customerWaitTime", new Date());

    customerWaitTime.setTimeDiff(parseInt(cityConfig.waitingTimeCustomerCancellationFee));

    customerWaitTime.start();
}

function initSummaryTrip(user, cityId) {
    if (!user || !user.tripTypes) return;

    const tripTypes = user.tripTypes?.map((item) => {
        return item.tripTypeId;
    });

    const countScheduleTripAccepted = document.querySelector("#countScheduleTripAccepted");
    const countTripBidList = document.querySelector("#countTripBidList");
    const countNewScheduleTrip = document.querySelector("#countNewScheduleTrip");

    DriverController.getTripsSummary({
        driverId: user.idDriver,
        tripTypeIds: tripTypes,
        cityId,
        tripWithoutRefusal: true,
    })
        .then(({ data, status }) => {
            if (!status) return;

            countScheduleTripAccepted.innerHTML = data.totalScheduledAccepted;
            countTripBidList.innerHTML = data.totalOfferTrips;
            countNewScheduleTrip.innerHTML = data.totalScheduledAvailable;

            showScheduledBar();
            showTripOfferInBar();
        })
        .catch(() => {
            console.log("Falha ao carregar resumo da viagem.");
        });
}
