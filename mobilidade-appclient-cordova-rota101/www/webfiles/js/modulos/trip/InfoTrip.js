class InfoTrip {
    static showArrivalDriver() {
        viewController.elementProperty.addClass(".modal-signaling-arrival", "active");

        viewController.elementProperty.getElement("#songCallTaxi", element => {
            element.play();
        });

        viewController.elementProperty.addEventInElement(".close-modal-arrival", "onclick", function () {
            InfoTrip.closeArrivalDriver();
        });
    }

    static closeArrivalDriver() {
        viewController.elementProperty.getElement("#songCallTaxi", element => {
            element.pause();
        });

        viewController.elementProperty.removeClass(".modal-signaling-arrival", "active");
    }

    static showDataClientTrip(trip) {
        if (trip.tripCallTypeId === TYPE_RIDE) {

            document.querySelector("#listTripRiders").innerHTML = trip.ride.riders.map(rider => {
                return `<li>
                            <div>
                                <span>Nome:</span>
                                <span>${rider.name}</span>
                            </div>
                            <div>
                                <span>Embarque:</span>
                                <span>${rider.waypoints[0].address}</span>
                            </div>
                            <div>
                                <span>Desembarque:</span>
                                <span>${rider.waypoints[1].address}</span>
                            </div>
                        </li>`;
            }).join("");

            Route.startClassesInComponent([
                {component: ".detail-ride-modal", class: "active"}
            ], () => {
                viewController.elementProperty.removeClass(".detail-ride-modal", "active");
            });
            return;
        }

        const elementProperty = new ElementProperty();
        Route.startClassesInComponent([
            {
                component: ".modal-data-trip",
                class: "active"
            }
        ], () => {
            elementProperty.removeClass(".modal-data-trip", "active");
        })

        elementProperty.getElement(".name-driver-trip", element => {
            element.innerHTML = trip.driver.nickname;
        });
        elementProperty.getElement(".trip-info", element => {
            let list = `<div>${trip.origin.address}</div>`;

            if (trip.tripCallTypeId === TYPE_TAXIMETER)
                return;

            list += trip.tripWayPoints.map(item => {
                return `<div>${item.address}</div>`
            }).join("");

            list += `<div>${trip.destination.name}</div>`;

            element.innerHTML = list;
        });
        elementProperty.getElement(".image-profile-driver", element => {
            const config = Session.get("configGeneral");
            const picturesLink = config.find(item => {
                return item.key === 'link_storage_pictures';
            });
                
            const finalLink = `${picturesLink.value}driver/profile/compressed/`;

            // element.style.backgroundImage = `url('${PATH_PROFILE_DRIVER + trip.driver.profileImage}')`;
            element.style.backgroundImage = `url('${finalLink}${trip.driver.profileImage}')`;
        });
        elementProperty.addEventInElement(".image-profile-driver", "onerror", function () {
            this.src = 'webfiles/img/icon/default.jpg';
        });
        elementProperty.getElement(".price-trip", element => {
            if (trip.tripCallTypeId === TYPE_TAXIMETER) {
                element.style.display = "none";
            } else {
                element.style = ""
            }
            element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(parseFloat(trip.price))}`;
        });

        elementProperty.addEventInElement(".close-data-client", "onclick", function () {
            InfoTrip.closeDataClient();
        });
        elementProperty.getElement(".payment-data-client", element => {
            element.innerHTML = `${getTextTranslate("home", "span-payment-in")} ${trip.tripPaymentForm}`
        })
        elementProperty.addEventInElement("#changeRouteInTrip", "onclick", () => {
            this.showModalChangeRoute(trip);
        });

        elementProperty.getElement("#changeRouteInTrip", element => {
            if (trip.oldDestinationId != null) {
                element.style.display = "none";
            } else {
                element.style.display = "";
            }
        })
    }

    static closeDataClient() {
        Route.backPage();
    }

    static showModalChangeRoute(trip) {
        const maxPlace = Session.get("cityConfig").quantityTripWayPoints;

        let indexEdit = null;

        document.querySelector("#btnEditRouteInTrip").disabled = true;

        const list = [
            {
                address: trip.origin.address,
                isEdit: false,
                data: null,
            },
            ...trip.tripWayPoints.map(item => {
                return {
                    id: Math.floor(Math.random() * 999999) + 1000,
                    address: item.address,
                    isEdit: item.confirmed == false,
                    type: "waypoint",
                    data: {
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude)
                    }
                }
            }),
            {
                id: Math.floor(Math.random() * 999999) + 1000,
                address: trip.destination.name,
                isEdit: true,
                type: "destination",
                data: {
                    latitude: parseFloat(trip.destination.latitude),
                    longitude: parseFloat(trip.destination.longitude)
                }
            }
        ]

        function createPlace(item) {
            const type = item.isEdit ? "value" : "placeholder";
            const iconClassName = item.type === "waypoint" ? "remove-place-edit" : "hide-place-edit"

            return `<li class="${!item.isEdit ? "disabled-place" : "item-edit-place"}" value="${item.id}">
                        <input type="text" ${type}="${item.address}" class="${item.isEdit ? "place-item-edit" : ""}" readonly/>
                        <i class="material-icons ${iconClassName}" value="${item.id}">close</i>
                    </li>`;
        }

        function createNewPlace() {
            return `<li class="add-new-place-in-trip">
                        <input type="text" placeholder="Adicionar uma parada" readonly/>
                        <i class="material-icons hide-place-edit">close</i>
                    </li>`
        }

        viewController.elementProperty.addEventInElement("#btnEditRouteInTrip", "onclick", function () {
            const result = list.find(item => {
                return item.type === "destination";
            });

            const waypoints = list.filter(item => {
                return item.type === "waypoint" && item.isEdit;
            }).map(item => {
                return {
                    address: item.address,
                    latitude: item.data.latitude,
                    longitude: item.data.longitude
                }
            });

            const destination = {
                address: result.address,
                latitude: result.data.latitude,
                longitude: result.data.longitude
            };

            let kmProgressing = 0;
            let minuteProgressing = 0;

            if (!Array.isArray(Session.get("positionDriverTrip"))) {
                kmProgressing = Session.get("positionDriverTrip").kmProgressing || 0;
                minuteProgressing = Session.get("positionDriverTrip").minuteProgressing || 0;
            }

            preload(true);
            PriceController.previewNewPriceInChangeRoute({
                tripReference: trip.tripReference,
                destination,
                waypoints,
                kmProgressing,
                minuteProgressing,
                multiplierDynamicPrice: trip.multiplierDynamic,
            }).then(({data, status}) => {
                preload(false);
                if (!status) {
                    return SwalCustom.messageDialog("", "Ocorreu um erro ao tentar recalcular rota");
                }

                document.querySelector("#newValueRecalculateRoute").innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(data.price))}`;

                Route.startClassesInComponent([
                    {
                        component: ".modal-change-route-confirm",
                        class: "active"
                    }
                ], () => {
                    viewController.elementProperty.removeClass(".modal-change-route-confirm", "active");
                });

                viewController.elementProperty.addEventInElement("#btnChangeRouteConfirm", "onclick", function () {
                    preload(true);
                    TripController.changeRoute({
                        tripReference: trip.tripReference,
                        price: parseFloat(data.price),
                        distance: data.distance,
                        duration: data.duration,
                        waypoints,
                        destination
                    }).then(({status}) => {
                        preload(false);
                        SwalCustom.messageDialog("", "Rota atualizada com sucesso", () => {
                            Route.backPage();
                            Route.backPage();
                            Route.backPage();
                        }, "success");
                    });
                });
            })

        });

        viewController.elementProperty.getElement(".list-new-places", element => {
            updateList();

            function updateList() {
                element.innerHTML = list.map(item => {
                    return createPlace(item)
                }).join("");

                if (list.filter(item => item.type === "waypoint").length < maxPlace)
                    element.innerHTML += createNewPlace();

                initEvent();
            }

            function addPlace(place) {
                if (indexEdit) {
                    const edit = list.find(item => item.id === indexEdit);
                    edit.address = place.address;
                    edit.data = {
                        latitude: parseFloat(place.latitude),
                        longitude: parseFloat(place.longitude)
                    }
                } else {
                    list.map(item => {
                        if (item.type === "destination")
                            item.type = "waypoint";
                    });

                    list.push({
                        id: Math.floor(Math.random() * 999999) + 1000,
                        address: place.address,
                        isEdit: true,
                        type: "destination",
                        data: {
                            latitude: parseFloat(place.latitude),
                            longitude: parseFloat(place.longitude)
                        }
                    });
                }

                document.querySelector("#btnEditRouteInTrip").disabled = false;

                Route.backPage();

                updateList();
            }


            function initEvent() {
                indexEdit = null;

                function showSearchPlaceModal() {
                    Route.startClassesInComponent([
                        {
                            component: ".container-place-search",
                            class: "active"
                        }
                    ], () => {
                        viewController.elementProperty.removeClass(".container-place-search", "active");
                    });

                    document.querySelector("#inputAnotherPlace").value = "";
                    document.querySelector("#listAddressAnotherPlace").innerHTML = " ";

                    viewController.elementProperty.addEventInElement(".clear-input-another-place", "onclick", function () {
                        document.querySelector("#inputAnotherPlace").value = "";
                        setTimeout(() => {
                            document.querySelector("#inputAnotherPlace").focus();
                        }, 500);
                    })

                    mapService.addSearchInInput(document.querySelector("#inputAnotherPlace"), (result) => {
                        document.querySelector("#listAddressAnotherPlace").innerHTML = result.data.map(item => {
                            return `<li class="item-address-place-selected" value="${btoa(JSON.stringify(item))}">${item.address}</li>`;
                        }).join("")

                        viewController.elementProperty.addEventInElement(".item-address-place-selected", "onclick", function () {
                            const place = JSON.parse(atob(this.getAttribute("value")));

                            if (place.latitude && place.longitude) {
                                addPlace(place);
                                return;
                            }

                            mapService
                                .getDetailPlace(place.address)
                                .then(({data: placeDetail}) => {
                                    addPlace(placeDetail);
                                })
                        })
                    }, () => {

                    }, Session.get("location"))
                }

                viewController.elementProperty.addEventInElement(".add-new-place-in-trip", "onclick", () => {
                    indexEdit = null;
                    showSearchPlaceModal();
                });

                viewController.elementProperty.addEventInElement(".remove-place-edit", "onclick", function () {
                    const id = parseInt(this.getAttribute("value"));
                    const index = list.findIndex((item) => {
                        return item.id === id;
                    });
                    list.splice(index, 1);
                    document.querySelector("#btnEditRouteInTrip").disabled = false;
                    updateList();
                });

                viewController.elementProperty.addEventInElement(".place-item-edit", "onclick", function () {
                    indexEdit = parseInt(this.parentNode.getAttribute("value"));

                    showSearchPlaceModal();

                    const edit = list.find(item => item.id === indexEdit);

                    document.querySelector("#inputAnotherPlace").value = edit.address;
                });
            }
        });

        viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
            Route.backPage();
        });

        Route.startClassesInComponent([
            {
                component: ".container-places-list",
                class: "active"
            }
        ], () => {
            viewController.elementProperty.removeClass(".container-places-list", "active");
        });
    }
}
