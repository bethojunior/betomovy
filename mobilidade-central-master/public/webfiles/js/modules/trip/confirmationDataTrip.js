function getTravelCustomer(trip, customer) {
    const elementProperty = new ElementProperty();
    const escapeHtml = (str) => str
        ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
        : '';

    elementProperty.getElement("#nameCustomerTripConfirmation", element => {
        element.innerHTML = customer.name;
    });

    elementProperty.getElement("#phoneCustomerTripConfirmation", element => {
        element.innerHTML = customer?.phone ?? ""
    });

    elementProperty.getElement("#scheduleCustomerTripConfirmation", element => {
        if (Array.isArray(trip?.schedules) && trip.schedules.length > 1) {
            element.innerHTML = `${trip.schedules.length} viagens agendadas`;
            return;
        }

        const date = Array.isArray(trip?.schedules) && trip.schedules.length === 1
            ? trip.schedules[0].schedule
            : (trip?.schedule ? trip.schedule : moment());

        element.innerHTML = moment(date).format("DD/MM/YYYY [às] HH:mm");
    });

    const isBatchSchedule = Array.isArray(trip?.schedules) && trip.schedules.length > 1;
    const typeMoney = JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney || Session.getLocal('cityConfig')?.typeMoney || 'R$';

    elementProperty.getElement("#valueTripConfirmationLabel", element => {
        element.innerHTML = isBatchSchedule ? "Valor por viagem" : "Valor";
    });

    elementProperty.getElement("#valueTripConfirmation", element => {
        element.innerHTML = `${typeMoney} ${Mask.maskMoney(trip.price)}`
    });

    elementProperty.getElement("#totalValueTripSpan", element => {
        element.style.display = isBatchSchedule ? '' : 'none';
    });

    elementProperty.getElement("#totalValueTripLabel", element => {
        if (!isBatchSchedule) return;

        element.innerHTML = `Total estimado (${trip.schedules.length} viagens)`;
    });

    elementProperty.getElement("#totalValueTripConfirmation", element => {
        if (!isBatchSchedule) return;

        element.innerHTML = `${typeMoney} ${Mask.maskMoney(trip.price * trip.schedules.length)}`
    });

    const typeTaxi = managerTrip?.typeTaxi || {};
    const rawCategoryName = typeTaxi.priceName || (Array.isArray(trip?.tripItems) && trip.tripItems[0]?.title) || typeTaxi.name || "Central";
    let categoryName = rawCategoryName.trim();
    if (categoryName) {
        categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
    }
    const isCentral = /central/i.test(rawCategoryName) || /central/i.test(typeTaxi.type || '');
    const isEntregaOrDrive = /entrega|drive|particular|carro/i.test(rawCategoryName);
    const isMoto = !isEntregaOrDrive && !isCentral && (
        /\bmoto\b|mototaxi|motocicleta|motoboy/i.test(rawCategoryName) ||
        /\bmoto\b/i.test(String(typeTaxi.picture || '')) ||
        /\bmoto\b/i.test(String(trip?.tripTypeId || ''))
    );
    const defaultCarImg = isCentral ? "/webfiles/img/icon/carro_eco.png" : "/webfiles/img/icon/carro_drive.png";
    const vehicleDefault = isMoto ? "/webfiles/img/icon/moto.png" : defaultCarImg;

    elementProperty.getElement("#imgVehicleConfirmation", element => {
        if (isEntregaOrDrive) {
            element.src = "/webfiles/img/icon/carro_drive.png";
        } else if (isCentral) {
            element.src = "/webfiles/img/icon/carro_eco.png";
        } else if (isMoto) {
            element.src = "/webfiles/img/icon/moto.png";
        } else {
            element.src = defaultCarImg;
        }
        element.onerror = function() {
            this.onerror = null;
            this.src = vehicleDefault;
        };
    });

    elementProperty.getElement("#typeTripConfirmation", element => {
        element.innerHTML = categoryName;
    });

    const dist = trip.distance || Session.getLocal("distanceTrip");
    const duration = trip.estimatedTripTime || Session.getLocal("estimatedTripTime");
    elementProperty.getElement("#etaTripConfirmation", element => {
        let parts = [];
        if (duration) parts.push(duration);
        if (dist) parts.push(dist);
        element.innerHTML = parts.length > 0 ? parts.join(" • ") : "-";
    });

    const paymentFormEl = document.getElementById("namePaymentForm");
    elementProperty.getElement("#paymentCustomerTripConfirmation", element => {
        element.innerHTML = (paymentFormEl && paymentFormEl.innerText.trim()) ? paymentFormEl.innerText.trim() : "Dinheiro";
    });

    elementProperty.getElement("#routeTrip", element => {
        const waypointItems = (trip.waypoints || [])
            .map(wp => `<li class="route-waypoint">${escapeHtml(wp.address || wp)}</li>`)
            .join('');
        element.innerHTML =
            `<li class="route-origin">${escapeHtml(trip.origin.address)}</li>` +
            waypointItems +
            `<li class="route-destination">${escapeHtml(trip.destination.address)}</li>`;
    });

    elementProperty.removeClass(".modal-find-customer", "active");
    elementProperty.addClass(".modal-confirmation-data-trip", "active");

    elementProperty.addEventInElement("#btnCancelConfirmationTrip", "onclick", function () {
        elementProperty.removeClass(".modal-confirmation-data-trip", "active");
        if (typeof mapService !== "undefined") mapService.resetToCentralView();
    });

    elementProperty.addEventInElement("#btnConfirmationTrip", "onclick", function () {
        elementProperty.removeClass(".modal-confirmation-data-trip", "active");
        if (typeof mapService !== "undefined") mapService.resetToCentralView();
        const haveReturn = document.querySelector("#haveReturnTrip").checked
        trip.haveReturn = document.querySelector("#haveReturnTrip").checked ? 1 : 0
        trip.tripCustomer = {
            id: customer.id ?? null,
            userId: customer.userId ?? userLogged.idUser,
            name: customer.name ?? userLogged?.name ?? '',
            phone: customer.phone ?? userLogged?.phone ?? '',
        };

        if(document.querySelector(".footer-container-trip").classList.contains("no-destination") || managerTrip.typeTaxi.centralNeighborhoodId != null){
            const { customer: deliveryCustomer } = Session.get("customerData") ?? {};

            trip.tripCustomer = {
                id: deliveryCustomer ? null : (customer.id ?? null),
                userId: deliveryCustomer ? userLogged.idUser : (customer.userId ?? userLogged.idUser),
                name: customer.name ?? userLogged?.name ?? '',
                phone: deliveryCustomer?.phone ?? customer.phone ?? userLogged?.phone ?? '',
            }
        }

        if(haveReturn){
            trip.waypoints.push(trip.destination);
            trip.destination = trip.origin;
        }

        checkTypeCustomerByTrip(trip);
    });
}
