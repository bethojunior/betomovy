const managerFrightSchedule = {
    unsubscribeId: null,
};

function initEventListFreight() {
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".freight-bar-available", "onclick", () => {
        Route.startClassesInComponent([{ component: ".container-list-freight", class: "active" }], () => {
            elementProperty.removeClass(".container-list-freight", "active");
        });
    });

    viewController.elementProperty.addEventInElement(".go-back-freight", "onclick", () => {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", () => {
        Route.backPage();
    });
}

function createListFreight() {
    if (managerFrightSchedule.unsubscribeId) {
        tripRealtime.unsubscribe(managerFrightSchedule.unsubscribeId);
    }

    const tripTypeId = Session.get("user").tripTypes[0].tripTypeId;
    const cityId = Session.getValueInSession("cityConfig", "cityId");

    viewController.elementProperty.getElement("#listFreightScheduled", (element) => {
        element.innerHTML = "";
    });

    function handleTripScheduled({ data: freight, type }) {
        if (type === tripRealtime.typeAdded) addItemFreight(freight);
        if (type === tripRealtime.typeRemoved) removeItemFreight(freight);

        viewController.elementProperty.getElement("#countNewFreight", (element) => {
            const count = document.querySelectorAll(".new-freight-scheduled").length;

            element.innerHTML = count;

            if (count <= 0) {
                viewController.elementProperty.addClass(".freight-bar-available", "hidden");
            } else {
                viewController.elementProperty.removeClass(".freight-bar-available", "hidden");
            }
        });

        initEventDetailFreightOption();
    }

    managerFrightSchedule.unsubscribeId = tripRealtime.getTripScheduled(cityId, tripTypeId, handleTripScheduled);
}

function removeItemFreight(freight) {
    const element = document.querySelector(`.item-freight[tripReference='${freight.tripReference}']`);

    if (element != null) element.remove();
}

function addItemFreight(freight) {
    viewController.elementProperty.getElement("#listFreightScheduled", (element) => {
        element.innerHTML += `<li class="item-freight new-freight-scheduled" tripReference="${freight.tripReference}">
                            <p>
                                <span>Carro: </span>
                                <span>${freight.tripType}</span>
                            </p>
                            <p>
                                <span>Tipo: </span>
                                <span>${freight.tripCallType}</span>
                            </p>
                            ${verifyExistSchedule(freight)}
                            <p>
                                <span>Valor: </span>
                                <span class="value-freight-item">${CityConfig.getTypeCoin()} ${Mask.maskMoney(
            parseFloat(freight.price)
        )}</span>
                            </p>
                            <a>Detalhes</a>
                        </li>`;
    });
}

function verifyExistScheduleFreight(freight) {
    if (freight.schedule == null) return ``;

    return `<p>
                <span>Data do frete: </span>
                <span>${new Date(freight.schedule.schedule).toLocaleString()}</span>
            </p>`;
}

function initEventDetailFreightOption() {
    viewController.elementProperty.addEventInElement(".item-freight", "onclick", function () {
        getInfoFreight(this.getAttribute("tripReference"));
    });
}

function getInfoFreight(tripReference) {
    viewController.elementProperty.addClass("#preloadLogin", "active");
    TripController.actionGet(tripReference)
        .then(({ status, data }) => {
            if (!status) return;

            showDetailFreight(data);

            Route.startClassesInComponent([{ component: ".container-detail-freight", class: "active" }], () => {
                viewController.elementProperty.removeClass(".container-detail-freight", "active");
            });
        })
        .finally(() => {
            viewController.elementProperty.removeClass("#preloadLogin", "active");
        });
}

function calculateDetailFreight(freight) {
    let totalAdditional = 0;

    viewController.elementProperty.getElement(".item-additional-price", (element) => {
        element.innerHTML = freight.accessibility.obstacle
            .map((item) => {
                totalAdditional += parseFloat(item.value);

                return `<li>
                        <p>
                            <span>${item.description.toUpperCase()} NA ${item.action.toUpperCase()}</span>
                        </p>
                        <p>${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(item.value))}</p>
                    </li>`;
            })
            .join("");

        const assistant = [];

        freight.accessibility.assistant.map((item) => {
            if (
                !assistant.find((itemSelected) => {
                    return itemSelected.accessibilityId === item.accessibilityId;
                })
            )
                assistant.push(item);
        });

        element.innerHTML += assistant
            .map((item) => {
                totalAdditional += parseFloat(item.value);

                return ` <li>
                        <p>
                            <span>${item.description.toUpperCase()}</span>
                        </p>
                        <p>${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(item.value))}</p>
                    </li>`;
            })
            .join("");

        const total = parseFloat(freight.price) - totalAdditional;

        element.innerHTML += `<li>
                        <p><span>VIAGEM KM</span></p>
                        <p>${CityConfig.getTypeCoin()}${Mask.maskMoney(total)}</p>
                    </li>`;
    });
}
