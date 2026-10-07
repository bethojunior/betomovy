Route.waitView().then(()=>{
    const user = Session.get("user");

    viewController.elementProperty.addEventInElement(".button-float-datasheet","onclick",()=>{
        Route.startClassesInComponent([
            {component: ".container-float-datasheet", class: "active"},
        ],()=>{
            viewController.elementProperty.removeClass(".container-float-datasheet","active");
            viewController.elementProperty.removeClass(".container-datasheet-trip","active");
            viewController.elementProperty.addClass(".container-float-datasheet","active-preload");
        });

        viewController.elementProperty.addEventInElement(".go-back-datasheet","onclick",()=>{
            Route.backPage();
        });

        DriverController.dataSheet(user.idDriver).then(({status,data})=>{
            if(!status)
                return;

            viewController.elementProperty.removeClass(".container-float-datasheet","active-preload");

            document.querySelector(".profile-image-datasheet").style.backgroundImage = `url(${data.fullPathImage})`;
            document.querySelector("#driverNameDataSheet").innerHTML = data.name;
            document.querySelector("#driverDocumentDataSheet").innerHTML = data.document;
            document.querySelector("#driverCNHDataSheet").innerHTML = data.cnh;
            document.querySelector("#markCarDataSheet").innerHTML = data.car.brand;
            document.querySelector("#modelCarDataSheet").innerHTML = data.car.model;
            document.querySelector("#licensePlateDataSheet").innerHTML = data.car.plate;
            document.querySelector("#colorPlateDataSheet").innerHTML = data.car.color;
           // document.querySelector("").innerHTML = data;
           // document.querySelector("").innerHTML = data;

            if(data.trip != null){
                document.querySelector("#clientTripDataSheet").innerHTML = data.trip.customer.name;
                document.querySelector("#originTripDataSheet").innerHTML = data.trip.origin.address;
                document.querySelector("#destinationTripDataSheet").innerHTML = data.trip.destination.name;
                document.querySelector("#timeTripDataSheet").innerHTML = data.trip.estimatedTripTime+"min";
                document.querySelector("#kmTripDataSheet").innerHTML = data.trip.distance;
                document.querySelector("#valueTripDataSheet").innerHTML = Mask.maskMoney(parseFloat(data.trip.price));
                viewController.elementProperty.addClass(".container-datasheet-trip","active");
            }else{
                viewController.elementProperty.removeClass(".container-datasheet-trip","active");
            }
        })
    });
});