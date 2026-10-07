function initAnotherBoardingPlace(trip, route) {
    const anotherBoardingPlace = {
        place: null,
        stop: null,
        afterPlace: null,
        tag: ""
    };

    viewController.elementProperty.addEventInElement(".another-boarding-place", "onclick", () => {
        Route.startClassesInComponent([{component: ".modal-another-boarding-place", class: "active"}], () => {
            viewController.elementProperty.removeClass(".modal-another-boarding-place", "active");
        },ADD_DATA_RIDE_ROUTE)
    });

    (new MapService).addSearchInInput(document.querySelector("#searchPlaceAnotherPlace"), ({data}) => {
        document.querySelector("#listAnotherBoarding").innerHTML = data.map(item => {
            return `<li class="item-another-place" value="${btoa(JSON.stringify(item))}">${item.address}</li>`
        }).join("");

        viewController.elementProperty.addEventInElement(".item-another-place", "onclick", function () {
            anotherBoardingPlace.place = JSON.parse(atob(this.getAttribute("value")));
            Route.startClassesInComponent([{
                component: ".modal-location-prior-to-your",
                class: "active"
            }], () => {
                viewController.elementProperty.removeClass(".modal-location-prior-to-your", "active");
            },ADD_DATA_RIDE_ROUTE)
        });

        if (data.length === 0)
            document.querySelector("#listAnotherBoarding").innerHTML = " ";

    }, () => {
        document.querySelector("#listAnotherBoarding").innerHTML = "";
    }, Session.get("location"));

    let indexLocal = trip.status === STATUS_IN_PROGRESS ? 0 : 1;

    const listTripWayPoints  = trip.tripWayPoints.filter(item => {
        return item.confirmed == false
    }).map((item, index) => {
        return `<li class="item-boarding-place-trip" value="${btoa(JSON.stringify(item))}" index="${ index + indexLocal}">${item.tag}</li>`;
    }).join("");


    document.querySelector("#listBoardingPlaceTrip").innerHTML = trip.status === STATUS_IN_PROGRESS ? listTripWayPoints :
        `<li class="item-boarding-place-trip" value='${btoa(JSON.stringify(route.origin))}' index="0"> ${route.origin.tag}</li>` + listTripWayPoints;

    viewController.elementProperty.addEventInElement(".item-boarding-place-trip", "onclick", function () {
        viewController.elementProperty.removeClass(".item-boarding-place-trip", "active");
        this.classList.add("active");
        anotherBoardingPlace.stop = JSON.parse(atob(this.getAttribute("value")));
        anotherBoardingPlace.afterPlace =  this.getAttribute("index")
    });

    viewController.elementProperty.addEventInElement(".btn-another-boarding-place-select", "onclick", function () {
        if(document.querySelector("#tagAnotherBoardingPlace").value.length === 0)
            return SwalCustom.messageDialog("","Informe a referência da parada");

        viewController.elementProperty.removeClass(".modal-another-boarding-place", "active");
        viewController.elementProperty.removeClass(".modal-location-prior-to-your", "active");
        pages.splice(-2);

        anotherBoardingPlace.tag = document.querySelector("#tagAnotherBoardingPlace").value;
        initUnloadingReserve(anotherBoardingPlace);
    });

}
