function mountDataTripSelected(route) {
    console.log(route);

    document.getElementById("name-route").innerHTML = route.name;
    document.getElementById("duration-trip").innerHTML = parseInt(parseInt(route.estimatedTime) / 60);
    document.getElementById("distance-trip").innerHTML = parseFloat(route.estimatedDistance / 1000);
    document.getElementById("about-route").innerHTML = "Sem detalhes";
    document.querySelector("#listOfferRoute").innerHTML = route.routeTripItemTypes.map(item => {
        return `<li>${item.name}: ${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(item.value))}</li>`
    }).join("");

    let boarding = `<li>${route.origin.address}</li>`;
    let landing = "";

    route.routeWayPoints.map(item => {
        if (item.routePitStopType === "DESEMBARQUE") {
            landing += `<li>${item.tag} (${item.address})</li>`;
        } else {
            boarding += `<li>${item.tag} (${item.address})</li>`;
        }
    });

    landing += `<li>${route.destination.address}</li>`;

    document.querySelector("#listBoardingOffer").innerHTML = boarding;
    document.querySelector("#listLandingOffer").innerHTML = landing;

    viewController.elementProperty.addEventInElement(
        "#btnOfferRideCar",
        "onclick",
        () => {
            const date = document.querySelector("#routeScheduleDate").value;
            const time = document.querySelector("#routeScheduleTime").value;

            if (date.length <= 0)
                return SwalCustom.messageDialog("", "Informe a data da viagem");
            if (time.length <= 0)
                return SwalCustom.messageDialog("", "Informe o tempo da viagem");

            const datetime = new Date(`${date} ${time}`);

            document.querySelector("#nameRouteInfoDriver").innerHTML =
                route.name;

            document.querySelector("#datetimeInfoDriver").innerHTML =
                `${datetime.toLocaleDateString()} - ${datetime.getHours()}h`;

            modalNumberVacancies();

        }
    );

    viewController.elementProperty.addEventInElement(
        "#acceptedOffer",
        "onclick",
        () => {
            const date = document.querySelector("#routeScheduleDate").value;
            const time = document.querySelector("#routeScheduleTime").value;

            const data = {
                routeId: route.id,
                schedule: `${date} ${time}`,
                seatsAvailable: document.querySelector("#amountTotalVacancies").innerHTML,
                tripItems: []
            };

            data.tripItems = viewController.elementProperty
                .getElements(".trip-item-type")
                .filter(element => {
                    return element.classList.contains("active");
                })
                .map(element => {
                    const {id} = JSON.parse(element.getAttribute("value"));
                    return id;
                });

            document.querySelector("#preloadLogin").style.display = "block";

            viewController.elementProperty.addClass(".preload-route", "active");

            RideController.new(data)
                .then(({status, errors, message}) => {
                    viewController.elementProperty.removeClass(".preload-route","active");

                    if (!status) return SwalCustom.messageDialog(errors.message, message);

                    updateListsRoutes();

                    //Route.goHomeBack();
                    viewController.elementProperty.removeClass(
                        ".modal-dialog-offer",
                        "active"
                    );
                    viewController.elementProperty.removeClass(
                        ".container-number-vacancies",
                        "active"
                    );
                    viewController.elementProperty.removeClass(
                        ".container-travel-detail",
                        "active"
                    );

                    Route.startClassesInComponent(
                        [{component: ".modal-confirm-offer", class: "active"}],
                        () => {
                            viewController.elementProperty.removeClass(
                                ".modal-confirm-offer",
                                "active"
                            );
                        }
                    );
                })
                .finally(
                    () => (document.querySelector("#preloadLogin").style.display = "none")
                );

            viewController.elementProperty.addEventInElement(
                "#closeConfirmOffer",
                "onclick",
                () => {
                    viewController.elementProperty.removeClass(".modal-confirm-offer", "active")
                    pages.splice(2, pages.length - 2);
                    //   Route.backPage();
                }
            );
        }
    );

    viewController.elementProperty.getElement("#typeItemTrip", element => {
        element.innerHTML = route.routeTripItemTypes
            .map(item => {
                return `<li class="trip-item-type" value='${JSON.stringify(item)}'>
                    <span>${item.name}</span>
                </li>`;
            })
            .join("");

        viewController.elementProperty.addEventInElement(
            ".trip-item-type",
            "onclick",
            function () {
                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                } else {
                    this.classList.add("active");
                }
            }
        );
    });

    viewController.elementProperty.addEventInElement(
        "#rejectOffer",
        "onclick",
        () => {
            Route.backPage();
        }
    );


    function modalNumberVacancies() {
        const element = document.querySelector("#amountVacancies");

        element.innerHTML = 1;

        Route.startClassesInComponent(
            [{component: ".container-number-vacancies", class: "active"}],
            () => {
                viewController.elementProperty.removeClass(".container-number-vacancies", "active");
            });

        viewController.elementProperty.addEventInElement("#removeVacancies", "onclick", function () {
            const result = parseInt(element.innerHTML) - 1;

            if (result < 1)
                return;

            element.innerHTML = result;

            if (result === 1)
                this.classList.remove("active")
        });

        viewController.elementProperty.addEventInElement("#addVacancies", "onclick", () => {
            element.innerHTML = parseInt(element.innerHTML) + 1;

            document.querySelector("#removeVacancies").classList.add("active");
        });

        viewController.elementProperty.addEventInElement("#btnConfirmVacancies", "onclick", () => {
            document.querySelector("#amountTotalVacancies").innerHTML = element.innerHTML;
            Route.startClassesInComponent(
                [{component: ".modal-dialog-offer", class: "active"}],
                () => {
                    viewController.elementProperty.removeClass(".modal-dialog-offer", "active");
                    viewController.elementProperty.addClass(".container-number-vacancies", "active");
                }
            );
        });

    }
}
