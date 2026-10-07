viewController.setObserver("trip-detail", function () {
    const mapService = new MapService();
    mapService.key = Session.get("googleApiKey");

    preload(true);

    initDetails();

    viewController.onResume("trip-detail", initDetails);

    function showDetails(trip) {
        preload(false);

        if (trip.status === STATUS_SCHEDULED) {

            viewController.elementProperty.getElement(".btn-option-trip-driver", element => {
                element.style.display = "none";
            });
            viewController.elementProperty.getElement(".data-trip-info", element => {
                element.style.display = "none";
            });

            viewController.elementProperty.addClass(".option-schedule-trip", "active");
        } else {
            viewController.elementProperty.getElement(".btn-option-trip-driver", element => {
                element.style = "";
            });
            viewController.elementProperty.getElement(".data-trip-info", element => {
                element.style = "";
            });

            viewController.elementProperty.removeClass(".option-schedule-trip", "active");
        }

        document.querySelector("#distanceTripDetail").innerHTML = `${getTextTranslate("details-trip","duration")} ${parseInt(trip.distance)}km`;
        document.querySelector("#timeTripDetail").innerHTML = `${getTextTranslate("details-trip","time")} ${parseInt(trip.estimatedTripTime)}min`;

        viewController.elementProperty.getElement("#dateTripDetails", element => {
            element.innerHTML =
                trip.schedule == null ?
                    DateCustom.getDateLocal(trip.date) :
                    getDescriptionScheduleTrip(trip.schedule.scheduleUTC == null ? trip.schedule.schedule : trip.schedule.scheduleUTC);

        });
        viewController.elementProperty.getElement("#originTripDetail", element => {
            element.innerHTML = trip.origin.address;
        });
        viewController.elementProperty.getElement("#destinationTripDetail", element => {
            element.innerHTML = trip.destination.name;
        });
        viewController.elementProperty.getElement("#valueTripDetail", element => {
            element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(parseFloat(trip.price))}`;
        });
        viewController.elementProperty.getElement("#paymentFormTripDetail", element => {
            element.innerHTML = trip.tripPaymentForm;
        });

        viewController.elementProperty.getElement("#btnAddFavoriteDetail", element => {
            element.classList.add("favorite");
            element.innerHTML = getTextTranslate("details-trip","favorite");
        });

        viewController.elementProperty.addEventInElement("#btnAddFavoriteDetail", "onclick", function () {

        });

        showInfoDriverTrip(trip);

        viewController.elementProperty.getElement("#durationTime", element => {
            element.innerHTML = `${getTextTranslate("details-trip","duration")} ${DateCustom.getDiff(trip.date, trip.endDate)}min`;
        });

        viewController.elementProperty.addEventInElement("#btnCancelScheduleTrip", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja cancelar a viagem agendada ?").then(() => {
                preload(true);
                const customerController = new CustomerController();
                customerController.actionCancel(trip.tripReference,
                    Session.getValueInSession("user", "idUser"), DateCustom.getNow())
                    .then(function ({status}) {
                        if (!status)
                            return SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar viagem", "Atenção", undefined, "warning");

                        SwalCustom.messageDialog("", "Viagem agendada foi cancelada", () => {
                            Route.backPage();
                        }, "success");

                    }).finally(() => {
                    preload(false);
                })
            });
        });

        document.querySelector("#boxDetailTrip").classList.add("active");
    }

    function showInfoDriverTrip(trip) {
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });
            
        const finalLink = `${picturesLink.value}driver/profile/compressed/`;

        if (trip.driver != null) {
            viewController.elementProperty.getElement("#profileDriverTripDetail", element => {
                // element.src = PATH_PROFILE_DRIVER + trip.driver.profileImage;
                element.src = finalLink + trip.driver.profileImage;
            });
            viewController.elementProperty.getElement("#profileDriverTripDetail", element => {
                // element.style.backgroundImage = `url(${PATH_PROFILE_DRIVER + trip.driver.profileImage})`;
                element.style.backgroundImage = `url(${finalLink + trip.driver.profileImage})`;
            });
            viewController.elementProperty.getElement("#nameDriverTripDetail", element => {
                element.innerHTML = trip.driver.name;
            });
            viewController.elementProperty.getElement(".driver-trip", element => {
                element.style = "";
            });
            if (trip.driver.car) {
                viewController.elementProperty.getElement("#carModelTripDetail", element => {
                    element.innerHTML = trip.driver.car.model + " / " + trip.driver.car.brand;
                });
                viewController.elementProperty.getElement("#plateTripDetail", element => {
                    element.innerHTML = trip.driver.car.plate;
                });
            }
            viewController.elementProperty.getElement("#codeFavoriteDriverDetail", element => {
                element.innerHTML = `Código Motorista: ${createCodeFavorite(trip.driver)}`;
            });

            viewController.elementProperty.getElement("#imgDetailTrip", element => {
                element.src = Session.get("imgMapStatic");
            });

            const isFavorite = Session.get("favorites").filter(favorite => {
                return favorite.idDriver === trip.driver.idDriver
            }).length > 0;

            checkDriverIsBlocked(trip);

            console.log(isFavorite);

            if (!isFavorite) {
                viewController.elementProperty.getElement("#btnAddFavoriteDetail", element => {
                    element.classList.remove("favorite");
                    element.innerHTML = "ADICIONAR FAVORITO";
                });
                viewController.elementProperty.addEventInElement("#btnAddFavoriteDetail", "onclick", function () {
                    if (Session.get("favorites").length >= 3) {
                        SwalCustom.messageDialog("", "Você já atingiu seu limite de motoristas favoritos !", undefined, "info");
                        return;
                    }

                    viewController.addParams("list-favorites-driver", {idDriver: trip.driver.idDriver});
                    Route.redirectDynamic("Driver", "Favorites");
                });
                return;
            }
        } else {
            viewController.elementProperty.getElement(".driver-trip", element => {
                element.style.display = "none";
            });
        }

    }

    function initDetails() {
        TripController.get(Session.get("tripDetail")).then(({status, data}) => {
            showDetails(data)
        });
    }

    function checkDriverIsBlocked(trip) {
        RefusedDriverController.list(Session.getValueInSession("user", "idCustomer"))
            .then(({status, data: listDriver}) => {
                if (!status)
                    return;

                viewController.elementProperty.getElement("#btnBlockedDriver", element => {
                    const listBlock = listDriver.filter((driver) => {
                        return driver.idDriver === trip.driver.idDriver;
                    });

                    if (listBlock.length > 0) {
                        element.innerHTML = getTextTranslate("details-trip","driver-unblocked");
                        element.onclick = () => {
                            SwalCustom.dialogConfirm(getTextTranslate("details-trip","message-unblocked-driver"),
                                "", "info").then(() => {
                                Promise.all(listBlock
                                    .map(item => RefusedDriverController
                                        .remove(item.id)))
                                    .then(() => {
                                        checkDriverIsBlocked(trip);
                                    });
                            });
                        };
                        return;
                    }

                    element.innerHTML =getTextTranslate("details-trip","driver-blocked");

                    element.onclick = () => {
                        SwalCustom.dialogConfirm(getTextTranslate("details-trip","message-blocked-driver"),
                            "", "info").then(() => {
                            RefusedDriverController
                                .insert(trip.driver.idDriver, Session.getValueInSession("user", "idCustomer"))
                                .then(() => {
                                    checkDriverIsBlocked(trip);
                                });
                        });
                    };
                });
            })
    }

    function createCodeFavorite(driver) {
        const name = removeAcento(driver.nickname).split("");

        const type = driver.userTypeId === "7" ? "P" : "T";

        return `${name[0].toUpperCase()}${name[name.length - 1].toUpperCase()}${("00000" + driver.idDriver).slice(-5)}${type}`;
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

    function clearDetails() {

        document.querySelector("#boxDetailTrip").classList.remove("active");

        viewController.elementProperty.getElement("#dateTripDetails", element => {
            element.innerHTML = ''
        });
        viewController.elementProperty.getElement("#originTripDetail", element => {
            element.innerHTML = ''
        });
        viewController.elementProperty.getElement("#destinationTripDetail", element => {
            element.innerHTML = ''
        });
        viewController.elementProperty.getElement("#valueTripDetail", element => {
            element.innerHTML = ``;
        });
        viewController.elementProperty.getElement("#paymentFormTripDetail", element => {
            element.innerHTML = ''
        });
        viewController.elementProperty.getElement("#profileDriverTripDetail", element => {
            element.src = ''
        });
        viewController.elementProperty.getElement("#profileDriverTripDetail", element => {
            element.style.backgroundImage = ''
        });
        viewController.elementProperty.getElement("#nameDriverTripDetail", element => {
            element.innerHTML = ''
        });
        viewController.elementProperty.getElement("#carModelTripDetail", element => {
            element.innerHTML = ''
        });
        viewController.elementProperty.getElement("#plateTripDetail", element => {
            element.innerHTML = ''
        });
        viewController.elementProperty.getElement("#imgDetailTrip", element => {
            element.style.backgroundImage = ``;
        })
    }

    viewController.onBack(function () {
        clearDetails();
    });

    viewController.elementProperty.addEventInElement(".options-detail", "onclick", function () {
        viewController.elementProperty.getElement(".options-detail", element => {
            element.classList.remove("active");
            document.getElementById(element.getAttribute("value"))
                .classList.remove("active");
        });
        this.classList.add("active");
        document.getElementById(this.getAttribute("value")).classList.add("active");
    });

    viewController.elementProperty.addEventInElement("#closeTripDetail", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement("#btnTripReceipt", "onclick", function () {
        this.disabled = true;
        TripReceiptController.sendCustomer(Session.get("tripDetail")).then(({status}) => {
            if (!status) {
                SwalCustom.messageDialog("Ocorreu um erro na solicitação do recibo", "Ops!", undefined, "info");
                return;
            }

            SwalCustom.messageDialog("Seu recibo foi enviado para seu e-mail",
                "Recibo solicitado!", undefined, "success");
        }).finally(() => {
            this.disabled = false;
        });
    });

    TripReportTypeController.actionGetAll().then(({status, data, errors}) => {
        if (!status)
            return;

        viewController.elementProperty.getElement("#listTripReportType", element => {
            element.innerHTML = data.map(report => {
                return `<li value='${JSON.stringify(report)}' class="trip-report-trip">${report.name}</li>`;
            }).join("");

            viewController.elementProperty.addEventInElement(".trip-report-trip", "onclick", function () {
                const report = JSON.parse(this.getAttribute("value"));

                viewController.addParams("report-trip", {report, tripReference: Session.get("tripDetail")});

                Route.redirectDynamic("Trip", "Report");

            });
        })
    });
});
