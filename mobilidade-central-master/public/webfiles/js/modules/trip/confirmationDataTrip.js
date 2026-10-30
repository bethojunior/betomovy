function getTravelCustomer(trip, customer) {
    const elementProperty = new ElementProperty();
    const userLogged = Session.get("user") || {};
    customer = customer || trip.customer || { name: userLogged.name || 'Cliente', phone: userLogged.phone || '' };
    const escapeHtml = (str) => str
        ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
        : '';

    elementProperty.getElement("#nameCustomerTripConfirmation", element => {
        element.innerHTML = escapeHtml(customer.name || 'Cliente');
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
        const formatted = typeof formatTripEta === "function"
            ? formatTripEta(duration, dist)
            : (function () {
                let parts = [];
                let minutes = parseFloat(String(duration || "").replace(",", "."));
                if (!isNaN(minutes) && minutes > 0) {
                    if (minutes >= 180) minutes = minutes / 60;
                    parts.push(`${Math.max(1, Math.round(minutes))} min`);
                }
                let km = parseFloat(String(dist || "").replace(",", "."));
                if (!isNaN(km) && km >= 0) {
                    if (km >= 100) km = km / 1000;
                    parts.push(`${km.toFixed(2)} km`);
                }
                return parts.join(" • ");
            })();
        element.innerHTML = formatted || "-";
    });

    const paymentFormEl = document.getElementById("namePaymentForm");
    elementProperty.getElement("#paymentCustomerTripConfirmation", element => {
        let payText = (paymentFormEl && paymentFormEl.innerText.trim()) ? paymentFormEl.innerText.trim() : "Dinheiro";
        payText = payText.replace(/\s*(ou|\/|\+)?\s*pix\b/gi, '').trim();
        element.innerHTML = payText || "Dinheiro";
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
    // Ocultar a bottom-sheet de opções para não sobrepor nem ficar embaixo de dados da viagem
    elementProperty.removeClass(".footer-container-trip", "active");
    elementProperty.addClass(".modal-confirmation-data-trip", "active");

    elementProperty.addEventInElement("#btnCancelConfirmationTrip", "onclick", function () {
        elementProperty.removeClass(".modal-confirmation-data-trip", "active");
        // Restaurar a bottom-sheet de opções para o operador caso cancele
        elementProperty.addClass(".footer-container-trip", "active");
        if (typeof mapService !== "undefined") mapService.resetToCentralView();
    });

    elementProperty.addEventInElement("#btnConfirmationTrip", "onclick", function () {
        elementProperty.removeClass(".modal-confirmation-data-trip", "active");
        elementProperty.removeClass(".footer-container-trip", "active");

        const userLogged = Session.get("user") || {};
        const safeCustomer = customer || trip.customer || {};
        const haveReturn = document.querySelector("#haveReturnTrip")?.checked || false;
        trip.haveReturn = haveReturn ? 1 : 0;

        const custUserId = safeCustomer.userId || userLogged.idUser || 1;
        trip.userId = parseInt(trip.userId || custUserId);
        trip.tripTypeId = parseInt(trip.tripTypeId || managerTrip?.typeTaxi?.tripTypeId || 1);
        trip.tripPaymentFormId = parseInt(trip.tripPaymentFormId || managerTrip?.paymentFormIdSelected || 1);

        trip.tripCustomer = {
            id: safeCustomer.id ?? null,
            userId: custUserId,
            name: safeCustomer.name ?? userLogged?.name ?? '',
            phone: safeCustomer.phone ?? userLogged?.phone ?? '',
        };

        if (document.querySelector(".footer-container-trip")?.classList.contains("no-destination") || managerTrip?.typeTaxi?.centralNeighborhoodId != null) {
            const { customer: deliveryCustomer } = Session.get("customerData") ?? {};

            trip.tripCustomer = {
                id: deliveryCustomer ? null : (safeCustomer.id ?? null),
                userId: deliveryCustomer ? (userLogged.idUser || custUserId) : (safeCustomer.userId ?? userLogged.idUser ?? custUserId),
                name: safeCustomer.name ?? userLogged?.name ?? '',
                phone: deliveryCustomer?.phone ?? safeCustomer.phone ?? userLogged?.phone ?? '',
            };
        }

        if (haveReturn) {
            trip.waypoints = trip.waypoints || [];
            trip.waypoints.push(trip.destination);
            trip.destination = trip.origin;
        }

        // Ativa feedback imediato de busca para o usuario
        try {
            if (typeof populateSearchDriverCard === "function") {
                populateSearchDriverCard(trip);
            }
            elementProperty.addClass(".search-driver-in-trip", "active");
            elementProperty.removeClass(".footer-container-trip", "active");
            if (typeof updateBtnCallTripVisibility === "function") {
                updateBtnCallTripVisibility();
            }
        } catch (e) {
            console.warn("Erro ao ativar card de busca imediato:", e);
        }

        checkTypeCustomerByTrip(trip);
    });
}
