viewController.setObserver("routes-index", () => {
    updateListsRoutes();

    viewController.elementProperty.addEventInElement(".option-tab-route", "onclick", function () {
        viewController.elementProperty.removeClass(".option-tab-route", "active");
        viewController.elementProperty.removeClass(".container-suggestion-travel", "active");
        this.classList.add("active");
        viewController.elementProperty.addClass(this.getAttribute("ref"), "active");
        updateListsRoutes();
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", () => {
        Route.backPage();
    })
});

function mountRoutes() {
    let position = Session.get("lastPosition");
    RouteController.get(position).then(({status, data}) => {
        if (!status) return;
        viewController.elementProperty.getElement(".mount-list-routes", element => {
            element.innerHTML = " ";
        });

        viewController.elementProperty.getElement(".mount-list-routes", these => {
            these.innerHTML = createItemsList(data, "open-detail-travel");

            viewController.elementProperty.addEventInElement(
                ".open-detail-travel",
                "onclick",
                function () {
                    const route = JSON.parse(this.getAttribute("data"));

                    Route.startClassesInComponent(
                        [{component: ".container-travel-detail", class: "active"}],
                        () => {
                            viewController.elementProperty.removeClass(
                                ".container-travel-detail",
                                "active"
                            );
                        }
                    );
                    mountDataTripSelected(route);

                    viewController.elementProperty.addEventInElement(
                        "#btnRequestRoute",
                        "onclick",
                        function () {
                            SwalCustom.dialogConfirm(
                                "Tem interesse nessa rota ?",
                                "",
                                status => {
                                    if (!status) return;

                                    Route.backPage();

                                    RouteController.use(route.id).then(({status, message}) => {
                                        if (!status)
                                            return SwalCustom.messageDialog(
                                                "",
                                                message,
                                                undefined,
                                                "info"
                                            );

                                        SwalCustom.messageDialog("", message, undefined, "success");

                                        mountRoutes();
                                        mountRoutesAvailable();
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    });
}

function createItemsList(data, className) {
    return (
        " " +
        data
            .map(item => {
                let EMBARQUE = 1;
                let DESEMBARQUE = 1;

                item.routeWayPoints.map(item => {
                    if (item.routePitStopType === "EMBARQUE") EMBARQUE++;

                    if (item.routePitStopType === "DESEMBARQUE") DESEMBARQUE++;
                });

                return `<li class="${className} ${verifyRouteIsActive(item)}" id="${
                    item.id
                }" data='${JSON.stringify(item)}'>
                        <div class="detail-travel">
                            <div>
                                <div class="description-travel">
                                    <p>Rota</p>
                                    <p>${item.name}</p>
                                    <p>${parseInt(parseFloat(item.estimatedDistance) / 1000)}km - ${parseInt(parseInt(item.estimatedTime) / 60)} minutos</p>
                                    <p></p>
                                    <ul>
                                        <li>${EMBARQUE} Embarques</li>
                                        <li>${DESEMBARQUE} Desembarques</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="values-travel">
                            ${showOffers(item)}
                            <div>
                                <span>Valor Pago</span>
                            </div>
                            <ul>
                                ${mountTripItemTypes(item)}
                                <li>
                                    <span>Pessoa</span>
                                    <span>${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(item.price))}</span>
                                </li>
                            </ul>
                        </div>
                    </li>`;
            })
            .join("")
    );
}

function showOffers(item) {
    if (item.ride == null)
        return '';
    return `<div>
                <h4 style="margin: 0;text-align: center">${item.ride.riders.length}</h4>
                <span style="text-align: center">Confirmados</span>
            </div>`
}

function mountRoutesAvailable() {
    RouteController.getRouteDriverAccepted().then(({status, data}) => {
        if (!status)
            return viewController.elementProperty.getElement(
                ".mount-list-routes-available",
                element => (element.innerHTML = " ")
            );

        viewController.elementProperty.getElement(
            ".mount-list-routes-available",
            these => {
                these.innerHTML = createItemsList(data, "open-detail-travel-available");

                viewController.elementProperty.addEventInElement(
                    ".open-detail-travel-available",
                    "onclick",
                    function () {
                        let route = JSON.parse(this.getAttribute("data"));

                        const components = [
                            {component: ".container-travel-detail", class: "active"},
                            {
                                component: ".container-travel-detail",
                                class: "not-active-request"
                            }
                        ];

                        if (route.driverAccept.active == true)
                            components.push({
                                component: ".container-travel-detail",
                                class: "active-offer"
                            });

                        Route.startClassesInComponent(components, () => {
                            viewController.elementProperty.removeClass(
                                ".container-travel-detail",
                                "active",
                                "active-offer",
                                "not-active-request"
                            );
                        });
                        mountDataTripSelected(route);
                    }
                );
            }
        );
    });
}

function mountTripItemTypes(item) {
    return (
        "" +
        item.routeTripItemTypes
            .map(res => {
                return `
                <li>
                    <span>${res.name}</span>
                    <span>${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(res.value))}</span>
                </li>
            `;
            })
            .join("")
    );
}

function verifyRouteIsActive(route) {
    if (route.driverAccept == null) return "";

    if (route.driverAccept.active == false) return "no-active";

    return "active";
}

function updateListsRoutes() {
    mountRoutes();
    mountRoutesAvailable();
    updateMyListTrips();
}
