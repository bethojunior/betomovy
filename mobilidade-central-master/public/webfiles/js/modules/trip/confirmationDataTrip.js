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

    elementProperty.getElement("#typeTripConfirmation", element => {
        element.innerHTML = managerTrip.typeTaxi.priceName;
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
        trip.haveReturn = document.querySelector("#haveReturnTrip").checked
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
