function updateMyListTrips() {
    DriverRideController.offered().then(({data}) => {
        document.querySelector("#listOffers").innerHTML = createItemsList(
            data,
            "open-detail-travel-offer"
        );

        viewController.elementProperty.addEventInElement(".open-detail-travel-offer",
            "onclick",
            function () {
                document.querySelector("#preloadLogin").style.display = "block";

                viewController.elementProperty.addClass(".preload-route", "active");

                const {
                    ride: {tripReference},
                    name,
                    estimatedTime,
                    estimatedDistance
                } = JSON.parse(this.getAttribute("data"));

                TripController.actionGet(tripReference).then(response => {
                    viewController.elementProperty.removeClass(".preload-route", "active");

                    Route.startClassesInComponent(
                        [
                            {
                                component: ".container-travel-detail",
                                class: "active"
                            },
                            {
                                component: ".container-travel-detail",
                                class: "not-active-request"
                            },
                            {
                                component: ".container-travel-detail",
                                class: "active-offer"
                            },
                            {
                                component: ".container-travel-detail",
                                class: "is-offer"
                            }
                        ],
                        () => {
                            viewController.elementProperty.removeClass(
                                ".container-travel-detail",
                                "active",
                                "active-offer",
                                "not-active-request",
                                "is-offer"
                            );
                        }
                    );

                    const {data: route} = response;
                    document.getElementById("name-route").innerHTML = name;
                    document.getElementById("duration-trip").innerHTML = parseInt(parseInt(estimatedTime) / 60);
                    document.getElementById("distance-trip").innerHTML = parseFloat(estimatedDistance) / 1000;
                    document.getElementById("about-route").innerHTML = "Sem detalhes";

                    const dateSchedule = new Date(route.schedule.schedule);

                    document.querySelector(
                        "#routeScheduleDate"
                    ).valueAsDate = dateSchedule;

                    document.querySelector(
                        "#routeScheduleTime"
                    ).value = dateSchedule.toLocaleTimeString();

                    document.querySelector("#listOfferRoute").innerHTML = route.ride.rideItems.map(item => {
                        return `<li>${item.name}: ${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(item.value))}</li>`
                    }).join("");

                    let boarding = "";
                    let landing = "";

                    route.tripWayPoints.map(item => {
                        if (item.routePitStopType === "DESEMBARQUE") {
                            landing += `<li>${item.tag} (${item.address})</li>`;
                        } else {
                            boarding += `<li>${item.tag} (${item.address})</li>`;
                        }
                    });

                    viewController.elementProperty.addEventInElement(
                        "#btnCancelOfferRideCar",
                        "onclick",
                        () => {
                            SwalCustom.dialogConfirm("Deseja cancelar a viagem", "", status => {
                                    if (!status) return;

                                    document.querySelector("#preloadLogin").style.display =
                                        "block";

                                    RideController
                                        .cancel({
                                            tripReference,
                                            cancellationReasonsId: 4
                                        })
                                        .then(({status, message}) => {
                                            if (!status)
                                                return SwalCustom.messageDialog("", message);

                                            SwalCustom.messageDialog("", message, undefined, "success");

                                            Route.backPage();

                                            updateListsRoutes();
                                        })
                                        .finally(() => {
                                            document.querySelector("#preloadLogin").style.display =
                                                "none";
                                        });
                                }
                            );
                        }
                    );

                    viewController.elementProperty.getElement(
                        ".list-customers",
                        element => {
                            if(!route.ride.riders.length) {
                                return element.innerHTML = `<p style="text-align: center">Ainda não há clientes</p>`
                            }
                            element.innerHTML = route.ride.riders
                            .map(item => {
                                const phone = Mask.removeMaskPhone(item.phone);
                                const dontHaveImage = item.profileImage ? '' :
                                `<i class="material-icons icon-user" id="account_circle">account_circle</i>` 
                                    return `
                                    <div class="card-user">
                                        <div class="img-user" style="background-image: url('${item.profileImage}')">
                                        ${dontHaveImage}
                                        </div>
                                        <div class="info-user">
                                            <p>${item.name}</p>
                                            <p>${Mask.readPhoneMask(phone)}</p>
                                        </div>
                                    </div>
                                    `;
                                }).join("");
                        }
                    );

                    viewController.elementProperty.getElement(
                        "#typeItemTrip",
                        element => {
                            element.innerHTML = route.ride.rideItems
                                .map(item => {
                                    return `<li class="trip-item-type active" value='${JSON.stringify(
                                        item
                                    )}'>
                                    <span>${item.name}</span></li>`;
                                }).join("");
                        }
                    );
                }).finally(
                    () =>
                        (document.querySelector("#preloadLogin").style.display = "none")
                );
            }
        );
    });
}
