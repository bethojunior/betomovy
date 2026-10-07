viewController.setObserver("trips", function () {
    const elementProperty = new ElementProperty();
    const customerController = new CustomerController();
    const mapService = new MapService();
    mapService.key = Session.get("googleApiKey");

    const userLogged = Session.get("user");

    const cityConfig = Session.get("cityConfig");

    if(cityConfig.enableTripScheduled == false){
        document.querySelector("#scheduleTripsList").style.display = "none";
    }else{
        document.querySelector("#scheduleTripsList").style = "";
    }

    const type = {
        "finished": "Finalizado",
        "accepted": "Aceita",
        "canceled": "Cancelada",
        "boarding": "Embarcando",
        "in_progress": "Em viagem",
        "scheduled": "Agendada"
    };

    getList('#tripsClient');
    getList('#scheduleTripsCliente', false, 1, STATUS_SCHEDULED);

    viewController.onResume("trips",()=>{
        getList('#tripsClient');
        getList('#scheduleTripsCliente', false, 1, STATUS_SCHEDULED);
    });

    elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    function getList(idList, isJoin = false, page = 1, status = null, date = null) {
        customerController.getTrips(userLogged.idCustomer, page, date, status)
            .then(({status, data}) => {
                if (!status)
                    return;

                viewController.elementProperty.getElement(".preload-list", element => element.remove());

                elementProperty.getElement(idList, element => {

                    const list = ' ' + showTrips(data.trips);

                    element.innerHTML = isJoin ? element.innerHTML + list : list;

                    if (data.paginate.showEndButton)
                        element.innerHTML += `<button type="button" id="${idList.replace("#", "")}Btn">MOSTRAR MAIS</button>`;

                    viewController.elementProperty.addEventInElement(`${idList}Btn`, "onclick", function () {
                        this.remove();
                        getList(idList, true, data.paginate.nextPage, status, date);

                        element.innerHTML += `<div class="preload-list"></div>`
                    });

                    elementProperty.addEventInElement(".trip-data", "onclick", dataTrip)
                });
            });
    }

    function dateUtc(tripDate) {
        const now = new Date(tripDate);
        const date = new Date(now.setHours(now.getHours() + 3));

        const offsetInMinutes = date.getTimezoneOffset();
        const offsetInHours = Math.abs(offsetInMinutes / 60);
        const plusOrMinus = offsetInMinutes < 0 ? date.getHours() + offsetInHours : date.getHours() - offsetInHours;
        const newDate = new Date(date.setHours(plusOrMinus));

        return dateFormated = newDate.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    function showTrips(trips) {
        return trips.map(trip => {
            return `
                     <li class="trip-data" value="${trip.tripReference}">
                        <div class="detail-trip">
                            <div>
                                <span class='type-trip'>${trip.type}</span>
                                <span>${Mask.maskMoney(parseFloat(trip.price))}</span>
                            </div>
                            <span class='date-trip'>${dateUtc(trip.date)}</span>
                            <span class='status-trip'>${type[trip.status]}</span>
                            <span class='address-origin-trip'>${trip.originAddress}</span>
                            <span class='address-destination-trip'>${trip.destinationAddress}</span>
                        </div>
                    </li>
                `
        }).join("");
    }

    function dataTrip() {

        elementProperty.getElement(`#mapImg${this.getAttribute("value")}`, element => {
            Session.set("imgMapStatic", element.getAttribute("src"));
        });
        Session.set('tripDetail', this.getAttribute("value"));
        Route.redirectDynamic('Trip', 'Detail')
    }

    viewController.elementProperty.addEventInElement(".tab-item-list-trip", "onclick", function () {
        viewController.elementProperty.removeClass(".container-tab-list-trip", "active");
        viewController.elementProperty.removeClass(".tab-item-list-trip", "active");

        this.classList.add("active");

        document.querySelector(`ul[for='${this.getAttribute("id")}']`).classList.add("active");
    });

    Route.pageDynamic();
});
