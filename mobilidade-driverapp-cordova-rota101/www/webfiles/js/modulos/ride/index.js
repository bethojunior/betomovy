function initTripRide(trip) {
    if (trip.ride == null) {
        viewController.elementProperty.getElement("#openChat", element => {
            element.style = "";
        });
        viewController.elementProperty.getElement("#openMultipleChat", element => {
            element.style.display = "none";
        });

        viewController.elementProperty.removeClass(".btn-show-detail-route", "active");

        return;
    }
    viewController.elementProperty.addClass(".btn-show-detail-route", "active");
    viewController.elementProperty.getElement("#openChat", element => {
        element.style.display = "none";
    });
    viewController.elementProperty.getElement("#openMultipleChat", element => {
        element.style = "";
    });

    viewController.elementProperty.addEventInElement("#openCustomerRouteRide", "onclick", function () {
        const trip = Session.get("tripDriver");

        showListCustomerRide(trip);
    });

    viewController.elementProperty.addEventInElement("#openCustomerChatRider", "onclick", function () {
        viewController.addParams("multiple-chat", Session.get("tripDriver"));
        Route.redirectDynamic("Driver", "MultipleChat");
        document.querySelector("#openCustomerChatRider").classList.remove("active");
    });

    viewController.elementProperty.addEventInElement(".btn-show-detail-route", "onclick", function () {
        const tripDriver = Session.get("tripDriver");

        let list = `<li>
            <h4>${tripDriver.origin.address}</h4>
            <ul>${checkActionPlace(tripDriver.origin.address, tripDriver)}</ul>
        </li>`;

        list += tripDriver.tripWayPoints.map(point => {
            return `<li>
            <h4>${point.address}</h4>
            <ul>${checkActionPlace(point.address, tripDriver)}</ul>
            <button type="button" point='${JSON.stringify(point)}' class="notify-customer-corporate" ${point.confirmed == true ? "disabled" : ""}>Notificar passageiros</button>
        </li>`;
        }).join("");

        list += `<li>
            <h4>${tripDriver.destination.name}</h4>
            <ul>${checkActionPlace(tripDriver.destination.name, tripDriver)}</ul>
        </li>`;

        document.querySelector("#listPointRide").innerHTML = list;

        viewController.elementProperty.addEventInElement(".notify-customer-corporate", "onclick", function () {
            const point = JSON.parse(this.getAttribute("point"));

            this.classList.add("active");

            trip.ride.riders.map(rider => {
                return rider.waypoints.filter(place => {
                    return place.address === point.address;
                }).map(place => {
                    if (rider.phone)
                        TripController.sendNotifyByCustomer(rider.phone).then()
                })
            });

            setTimeout(() => {
                this.classList.remove("active");
            }, 2000);

            console.log(point)
        });

        Route.startClassesInComponent([{component: ".modal-route-ride", class: "active"}], () => {
            viewController.elementProperty.removeClass(".modal-route-ride", "active");
        })
    });
}

function showListCustomerRide(trip) {
    updateDataListCustomer(trip);

    viewController.elementProperty.addEventInElement("#updateListCustomerInTravel", "onclick", function () {
        window.plugins.spinnerDialog.show();
        TripController.actionGet(trip.tripReference).then(({data}) => {
            window.plugins.spinnerDialog.hide();
            updateDataListCustomer(data);
        });
    });

    Route.startClassesInComponent([{component: ".modal-customer-ride", class: "active"}], () => {
        viewController.elementProperty.removeClass(".modal-customer-ride", "active");
    })
}

function updateDataListCustomer(trip) {
    let total = 0;

    document.querySelector("#listCustomerRide").innerHTML = trip.ride.riders.map(rider => {
        total += parseFloat(trip.price);
        return `<li>
                        <p><span>Nome:</span> ${rider.name}</p>
                        <p><span>CPF:</span> ${rider.document ? rider.document : "Não informado"}</p>
                        <p><span>Telefone:</span> ${rider.phone ? rider.phone : "Não informado"}</p>
                        ${trip.tripCallTypeId === TRIP_CALL_RIDE && `<p><span>Valor:</span> ${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(trip.price))}</p>`}
                        <p><span>Embarque:</span> ${rider.waypoints[0].address}</p>
                        <p><span>Desembarque:</span> ${rider.waypoints[1].address}</p>
                        ${rider.isResponsible == false ? `<p><span>Responsável:</span> ${rider.responsibleName}</p>` : ""}
                    </li>`;
    }).join("");

    document.querySelector("#valueTravelByCustomer").innerHTML = `${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(trip.price))}/por passageiro`;
    document.querySelector("#totalAccumulateTravel").innerHTML = `${CityConfig.getTypeCoin()} ${Mask.maskMoney(total)}`;
}

function checkActionPlace(address, trip) {
    return trip.ride.riders.map(rider => {
        return rider.waypoints.filter(place => {
            return place.address === address;
        }).map(place => {
            return `<li><b>${place.routePitStopType}:</b> ${rider.name}</li>`
        }).join("")
    }).join("")
}
