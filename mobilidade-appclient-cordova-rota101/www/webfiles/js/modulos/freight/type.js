function verifyTypeFreight() {
    viewController.elementProperty.removeClass(".container-choose-type-service", "active");
    viewController.elementProperty.removeClass(".content-address", "active");
    globalFreight.type = STATUS_TRIP_FREIGHT;

    preload(true);
    calculateValuesFreight().then((data) => {
        showRouteFreight([],data);

        openScheduledTime();
    }).catch((err)=>{
        console.log(err);
        Route.backPage();
    }).finally(()=>{
        preload(false);
    });
    /* if(trip.tripType.freightOption == false){
         managerTypeTrip.type = STATUS_TRIP_DELIVERY;
         return openScheduledTime();
     }

     chooseTypeService();*/
}


function showTypeFreight() {
    if (globalFreight.type === STATUS_TRIP_DELIVERY) {
        calculatePriceFreightCustomer();
    } else {
        if (globalFreight.tripTypeSelected.freightOption == true)
            return typeChangeTripService();

        if (globalFreight.tripTypeSelected.deliveryOption == true)
            return calculatePriceFreightCustomer();

        showAlertInfoTravel();

    }
}
function typeChangeTripService() {
    viewController.elementProperty.removeClass(".container-choose-type-service", "active");

    //initCloseTrip();

    openSelectItem();

    calculateValuesFreight();

    Route.startClassesInComponent([
        {component: ".container-selected-item", class: "active"},
    ], () => {
        // initProcessingCallTrip();
        openScheduledTime();
        viewController.elementProperty.removeClass(".container-selected-item", "active")
    }, COMPONENT_CREATE_TRIP);
}

function chooseTypeService() {
    viewController.elementProperty.addEventInElement("#btnFastTripService", "onclick", () => {
        viewController.elementProperty.removeClass(".container-choose-type-service", "active");
        globalFreight.type = STATUS_TRIP_DELIVERY;
        openScheduledTime();
    });
    viewController.elementProperty.addEventInElement("#btnChangeTripService", "onclick", () => {
        viewController.elementProperty.removeClass(".container-choose-type-service", "active");
        globalFreight.type = STATUS_TRIP_FREIGHT;
        openScheduledTime();
    });

    viewController.elementProperty.getElement("#callRunning", element => {

        if (element.classList.contains("active"))
            return;

        Route.startClassesInComponent([
            // {component:".btn-call-trip",class:"active"},
            {component: ".container-choice-trip-type", class: "active"},
            {component: ".container-choose-type-service", class: "active"},
        ], () => {
            //initProcessingCallTrip();
        }, COMPONENT_CREATE_TRIP);
    })
}


function calculateValuesFreight() {
    const origin = {latitude: positionFreight.originFreight.lat, longitude: positionFreight.originFreight.lng,
        longDistanceDelivery: document.querySelector("input[name='approximateLoading']:checked").value == true};
    const destination = {latitude: positionFreight.destinationFreight.lat, longitude: positionFreight.destinationFreight.lng,
        longDistanceDelivery: document.querySelector("input[name='approximateDeliver']:checked").value == true};

    globalFreight.infoCalculate = null;


    return new Promise((resolve, reject) => {
        PriceController.getPrice(origin, destination, globalFreight.tripTypeSelected.idTripType)
            .then(({status, data,errors}) => {
                if (!status) {
                    SwalCustom.messageDialog("",errors.message);
                    return reject();
                }

                globalFreight.infoCalculate = data;

                calculateAccessibility();

                resolve(data);
            });
    });
}
