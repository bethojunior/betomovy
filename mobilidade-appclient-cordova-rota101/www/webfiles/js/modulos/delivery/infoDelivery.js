Route.waitView().then(() => {
    TripItemTypeController.getAll().then((result) => {
        viewController.elementProperty.getElement("#listItemDelivery", element => {
            element.innerHTML = result.data.map(item => {
                return ` <li class="item-delivery-trip" value='${JSON.stringify(item)}'>
                <div>
                    <div style="background-image: url('${item.picture}')"></div>
                    <p>${item.name}</p>
                </div>
            </li>`
            }).join("");

            viewController.elementProperty.addEventInElement(".item-delivery-trip", "onclick", function () {
                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                } else {
                    viewController.elementProperty.removeClass(".item-delivery-trip", "active");
                    this.classList.add("active");
                }
            });
        });
    });

    DeliveryInfoController.suggestion().then(({status, data}) => {
        if (!status)
            return;

        viewController.elementProperty.getElement("#obsOrigin", element=>{
            element.setAttribute("text", data.obsOrigin);
        });
        viewController.elementProperty.getElement("#obsDestination", element=>{
            element.setAttribute("text", data.obsDestination);
        });
        viewController.elementProperty.getElement("#obs", element=>{
            element.setAttribute("text", data.obs);
        });
    });

    viewController.elementProperty.addEventInElement(".back-delivery-item", "onclick", () => {
        Route.backPage();
    });
});

function showItemDelivery(trip) {
    Route.startClassesInComponent([{component: ".container-info-delivery", class: "active"}], () => {
        viewController.elementProperty.removeClass(".container-info-delivery", "active")
    });

    document.querySelector("#listWayPointsDelivery").innerHTML = Object.keys(trip.waypoints).map(item => {
        const waypoint = trip.waypoints[item];
        return `<div class="detail-delivery">
                <span>
                <span class="icon-custom" style="background-image: url('webfiles/img/svg/tools.svg')"></span>
                <span>${waypoint.address}:</span></span>
                <pre class="obs-text-area" id="obs${item}" title="${waypoint.address}"></pre>
            </div>`;
    }).join("");

    document.querySelector("#obsFinishWayPoint").innerHTML = document.getElementById("destination").value;
    document.querySelector("#obsDestination").setAttribute("title",document.getElementById("destination").value);

    viewController.elementProperty.addEventInElement(".obs-text-area", "onclick", function () {

        document.querySelector("#countLengthObs").innerHTML = `${this.innerHTML.length}/150`;
        document.querySelector("#textAreaObs").value = this.innerHTML;
        document.querySelector("#titleObs").innerHTML = this.getAttribute("title");

        Route.startClassesInComponent([{component: ".container-obs-delivery-info", class: "active"}], () => {
            viewController.elementProperty.removeClass(".container-obs-delivery-info", "active");
        });

        viewController.elementProperty.addEventInElement("#textAreaObs", "oninput", function () {
            if (this.value.length > 150)
                return false;
            document.querySelector("#countLengthObs").innerHTML = `${this.value.length}/150`;
        });

        viewController.elementProperty.addEventInElement("#btnSaveObs", "onclick", () => {
            this.innerHTML = document.querySelector("#textAreaObs").value;
            Route.backPage();
        });

        setTimeout(() => {
            document.querySelector("#textAreaObs").focus();
        }, 500)
    });

    viewController.elementProperty.addEventInElement("#btnSaveInfoDelivery", "onclick", () => {
        trip.deliveryInfo = {
            obsOrigin: document.getElementById("obsOrigin").innerHTML,
            obsDestination: document.getElementById("obsDestination").innerHTML,
            obs: document.getElementById("obs").innerHTML,
        };

        let item = document.querySelector(".item-delivery-trip.active");

        if (item == null)
            return SwalCustom.messageDialog("", "Selecione o tipo de entrega");

        item = JSON.parse(item.getAttribute("value"));

        trip.tripItems = [{tripItemTypeId: item.id}];

        trip.waypoints = Object.keys(trip.waypoints).map(item => {
            const waypoint = trip.waypoints[item];

            waypoint.latitude = waypoint.lat;
            waypoint.longitude = waypoint.lng;
            waypoint.obs = document.querySelector(`#obs${item}`).innerHTML;


            return waypoint;
        });

        Route.backPage();

        if (managerTrip.typeTaxi != null)
            if (managerTrip.typeTaxi.tripType != null)
                if (managerTrip.typeTaxi.tripType.offerOption == true  || ConfigGeneral().get("travel_only_by_offer") == true)
                    return showPriceOfferModal(trip);

        verifyPaymentFormTrip(trip);
    })
}