function showBudgetFreight() {
    Route.startClassesInComponent([
        {component: ".container-budget", class: "active"},
    ], () => {
        viewController.elementProperty.removeClass(".container-budget", "active");
        //initProcessingCallTrip();
    }, COMPONENT_CREATE_TRIP);

    viewController.elementProperty.getElement(".origin-freight", element => {
        element.innerHTML = document.getElementById("originFreight").value;
    });

    viewController.elementProperty.getElement(".destination-freight", element => {
        element.innerHTML = document.getElementById("destinationFreight").value;
    });

    viewController.elementProperty.addEventInElement(".calendar-freight", "onclick", function () {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
        } else {
            viewController.elementProperty.removeClass(".calendar-freight", "active");
            this.classList.add("active");
        }
    });

    viewController.elementProperty.getElement("#scheduleDatetime", element => {
        element.innerHTML = managerSchedule.schedule.date == null ? "Data/Horário: Imediatamente" :
            `Data/Horário: ${managerSchedule.schedule.date} ${managerSchedule.schedule.time}`
    });

    viewController.elementProperty.addEventInElement(".container-calendar-freight", "onclick", function (evt) {
        evt.stopPropagation();
    });

    viewController.elementProperty.addEventInElement("#btnConfirmFreight", "onclick", function () {
        initNewTripFreight();
    });


    showValuesFreight();
    showItemsSelected();
}


function showValuesFreight() {
    viewController.elementProperty.getElement("#valuesAdditionalFreight", element => {
        if (managerTypeTrip.infoCalculate == null)
            return;

        if (managerTypeTrip.infoCalculate.price.accessibility != null)
            element.innerHTML = managerTypeTrip.infoCalculate.price.accessibility.priceObstacle.map(item => {
                const count = document.querySelectorAll(`li[accessibilityId='${item.id}'].active`).length;
                const price = parseFloat(item.value);
                const total = price * count;

                return `<li><p>Adicional ${item.obstacle}: <span>${CityConfig.getTypeCoin()}${Mask.maskMoney(total)}</span></p></li>`
            }).join("");


        if (managerTypeTrip.infoCalculate.price.accessibility != null)
            element.innerHTML += managerTypeTrip.infoCalculate.price.accessibility.priceHelp.map(item => {
                const count = document.querySelectorAll(`li[accessibilityHelpId='${item.accessibilityHelpId}'].active`).length;
                const price = parseFloat(item.value);
                const total = price * count;

                return `<li><p>Adicional ${item.help}:<span>${CityConfig.getTypeCoin()}${Mask.maskMoney(total)}</span></p></li>`
            }).join("");

        if((document.querySelector("input[name='approximateLoading']:checked").value == true))
            element.innerHTML += `<li><p>Adicional Coleta</span></p></li>`;

        if((document.querySelector("input[name='approximateDeliver']:checked").value == true))
            element.innerHTML += `<li><p>Adicional Entrega</span></p></li>`;
    })
}

function showItemsSelected() {
    viewController.elementProperty.getElement("#itemsToCarry", element => {
        element.innerHTML = managerItemDelivery.itens.map(item => {
            return `<li><div>${item.name}</div><div>${item.count}</div></li>`
        }).join("");
    });

    if (globalFreight.tripTypeSelected.freightOption == false) {
        document.querySelector("#btnEditItems").style.display = "none";
    } else {
        document.querySelector("#btnEditItems").style = "";
    }

    viewController.elementProperty.addEventInElement("#btnEditItems", "onclick", openEditItemSelected)
}

function getWaypoint() {
    return Object.keys(trip.waypoints).map(item => {
        const waypoint = trip.waypoints[item];

        waypoint.latitude = waypoint.lat;
        waypoint.longitude = waypoint.lng;

        return waypoint;
    });
}

function createPaymentFormFreight(payments) {
    viewController.elementProperty.getElement("#paymentFormFreight", element => {
        element.innerHTML = `<option value="" selected disabled>
                                Informe como deseja pagar
                             </option>`;
        element.innerHTML += payments.map(payment => {
            return `<option
                        value="${payment.idTripPaymentForm}" 
                        payment='${JSON.stringify(payment)}'>
                        ${payment.name}
                     </option>`;
        }).join("");
    });
}
