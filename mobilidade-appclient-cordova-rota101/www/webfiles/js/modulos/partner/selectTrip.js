const STATUS_ACTIVE = "1";
const STATUS_BLOCK = "2";
const STATUS_PENDING = "3";

const managerSelectTrip = {
    timeout: null,
    tripRepository: null
};

function verifyListTripActivePartner() {
    const user = Session.get("user");

    if (user.partnerRegisterStatusId !== STATUS_ACTIVE)
        return;

    viewController.elementProperty.removeClass(".list-trips-active-partner", "show");
    tripsActivesPartner();
    addEventListTrip();
}

function tripsActivesPartner() {
    if (managerSelectTrip.tripRepository == null)
        managerSelectTrip.tripRepository = new TripRepository();

    managerSelectTrip.tripRepository.close();

    const user = Session.get("user");

    managerSelectTrip.tripRepository.getTripsPartner(user.idUser,(result) => {
        const trip = result.find(item=>{
            return item.data.tripCallTypeId !== TYPE_RIDE && item.data.tripCallTypeId !== TYPE_FREIGHT;
        });

        if (!trip)
            return;

        PartnerController.getActiveTrips().then(({status, data}) => {
            if (!status)
                return;

            if (data.length === 0) {
                viewController.elementProperty.removeClass(".list-trips-active-partner", "show");
                viewController.elementProperty.removeClass(".list-trips-active-partner", "active");
                return;
            }

            viewController.elementProperty.getElement(".list-trips-active-partner", element => {
                if (!element.classList.contains("active") && !Route.isGroupComponentActive(COMPONENT_CREATE_TRIP))
                    element.classList.add("active");
            });

            viewController.elementProperty.addClass(".container-publicity-app","hidden");

            viewController.elementProperty.getElement("#listTripPartner", element => {
                element.innerHTML = data.map(trip => {
                    return `<li class="trip-item ${
                        ((Session.get("tripReference") === trip.tripReference) &&
                            (managerTrip.inTrip || managerTrip.isSearch)) ?
                            "active" : ""}"
                            value='${JSON.stringify(trip)}'>
                        <p>Cliente: ${trip.customerName}</p>
                        <span>Status: ${checkStatusByTrip(trip.status)}</span>
                    </li>`;
                }).join("");

                addEventSelectTrip();
            });
        });
    });
}

function addEventSelectTrip() {
    viewController.elementProperty.addEventInElement(".trip-item", "onclick", function () {
        if (this.classList.contains("active"))
            return;

        viewController.elementProperty.addClass(".container-publicity-app","hidden");

        clearTimeout(managerTrip.timeOut);

        managerTripViewCurrent.request.abort();

        initProcessingCallTrip(false);

        viewController.elementProperty.removeClass(".trip-item", "active");

        viewController.elementProperty.removeClass(".list-trips-active-partner", "show");

        this.classList.add("active");

        const trip = JSON.parse(this.getAttribute("value"));

        Session.set("tripReference", trip.tripReference);

        managerTripViewCurrent.isVisible = true;
        managerTripViewCurrent.request.abort();

        verifyTrip();
    });
}

function checkStatusByTrip(status) {
    switch (status) {
        case STATUS_SEARCHING :
        case STATUS_SEARCHING_FAVORITE : {
            return "Solicitando motorista"
        }
        case STATUS_PRE_ACCEPTED :
        case STATUS_ACCEPTED: {
            return "Motorista aceitou a viagem";
        }
        case  STATUS_BOARDING: {
            return "Motorista aguardando o cliente";
        }
        case STATUS_IN_PROGRESS : {
            return "Motorista iniciou a viagem";
        }
        default : {
            return "";
        }
    }
}

function addEventListTrip() {
    viewController.elementProperty.addEventInElement(".expand-options-trips-partner", "onclick", function () {
        viewController.elementProperty.getElement(".list-trips-active-partner", element => {
            if (element.classList.contains("show")) {
                element.classList.remove("show");
            } else {
                element.classList.add("show");
            }
        });
    });

    viewController.elementProperty.addEventInElement("#btnNewTrip", "onclick", function (event) {

        managerTripViewCurrent.isVisible = false;
        viewController.elementProperty.removeClass(".trip-item", "active");
        initProcessingCallTrip(false);
        clearTimeout(managerTrip.timeOut);
        toggleCallOrCancel(event);
    });
}
