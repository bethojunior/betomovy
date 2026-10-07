function showInfoDelivery(trip, customer) {
    document.querySelector("#obsOriginDelivery").value = "";
    viewController.elementProperty.addClass("#info-delivery", "active");
    viewController.elementProperty.addEventInElement(".go-back-delivery-info", "onclick", function () {
        viewController.elementProperty.removeClass("#info-delivery", "active");
    });

    const listAddressDeliveryObs = document.querySelector("#listAddressDeliveryObs");
    listAddressDeliveryObs.innerHTML = trip.waypoints.map((waypoint, index) => {
        return addItemAddressDelivery(waypoint.address, waypoint, true, index);
    }).join("");
    listAddressDeliveryObs.innerHTML += addItemAddressDelivery(trip.destination.address, trip.destination, false, "destination");


    viewController.elementProperty.addEventInElement(".add-obs-place", "onclick", function () {
        const place = JSON.parse(this.getAttribute("value"));
        const code = this.getAttribute("code");
        const modal = $("#addObservationInPlace");

        document.querySelector("#obsTextArea").value = document.querySelector(code).innerHTML;
        document.querySelector("label[for='obsTextArea']").innerHTML = `<i class="material-icons">place</i>${place.address}`;

        modal.modal("show");
        viewController.elementProperty.addEventInElement("#btnAddObs", "onclick", function () {
            document.querySelector(code).innerHTML = document.querySelector("#obsTextArea").value;
            modal.modal('hide');
        });
    });

    viewController.elementProperty.addEventInElement("#btnAddObsInTrip", "onclick", function () {
        if (document.querySelector("#itemTripSelected").value.length === 0)
            return swal("Atenção", "Selecione o tipo de entrega", "warning");
        trip.deliveryInfo = {
            obsOrigin: document.getElementById("obsOriginDelivery").value,
            obsDestination: document.querySelector("#obsPlacedestination").innerHTML,
            obs: "",
        };
        const tripItemTypeId = document.querySelector("#itemTripSelected").value;
        trip.tripItems = [{tripItemTypeId, title: getTripItemTypeTitle(tripItemTypeId)}];
        trip.waypoints = trip.waypoints.map((waypoint, index) => {

            waypoint.latitude = waypoint.lat;
            waypoint.longitude = waypoint.lng;
            waypoint.obs = document.querySelector(`#obsPlace${index}`).innerHTML;

            return waypoint;
        });
        getTravelCustomer(trip, customer);
    });
}

function addItemAddressDelivery(address, value, isWayPoint = true, id) {
    return `<li class="p-1 d-flex border-bottom ${isWayPoint ? "is-waypoint-address" : "is-not-waypoint-address"}" value='${JSON.stringify(value)}'>
                <span class="small flex-fill">${address}</span>
                <a href="#" class="small">
                    <span class="material-icons add-obs-place" value='${JSON.stringify(value)}' code="#obsPlace${id}">comment</span>
                </a>
                <pre id="obsPlace${id}" hidden></pre>
            </li>`;
}

function getTripItemTypeTitle(tripItemTypeId) {
    const option = document.querySelector(`#itemTripSelected option[value="${tripItemTypeId}"]`);
    return option ? option.textContent.trim() : String(tripItemTypeId);
}

function getItemsTripDelivery() {
    TripController.getItems().then(({data}) => {
        document.querySelector("#itemTripSelected").innerHTML += data.map(item => {
            return `<option value="${item.id}">${item.name}</option>`
        }).join("")
    })
}