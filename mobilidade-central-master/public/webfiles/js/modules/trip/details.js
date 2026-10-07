document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

    const mapService = new MapService();

    const tripReference = location.pathname.split("/")[2];

    TripRepository.get(tripReference).then(({response}) => {
        showTrip(response);
    });


    function showTrip(response) {
        elementProperty.getElement("#dateTimeTrip",element=>{
            element.innerHTML = new Date(response.date).toLocaleString();
        });

        elementProperty.getElement("#originTrip",element=>{
            element.innerHTML = `<span>${response.origin.address}</span><span>${new Date(response.date).toLocaleTimeString()}</span>`;
        });

        const wayPoints = response.tripWayPoints || response.trip_way_points || [];
        elementProperty.getElement("#tripRouteDetails", element => {
            const destinationLi = element.querySelector("li:last-child");
            element.querySelectorAll(".route-waypoint").forEach((node) => node.remove());
            wayPoints.forEach((wayPoint) => {
                const li = document.createElement("li");
                li.className = "route-waypoint";
                li.innerHTML = `<div><span>${wayPoint.address}</span><span></span></div>`;
                element.insertBefore(li, destinationLi);
            });
        });

        elementProperty.getElement("#destinationTrip",element=>{
            element.innerHTML = `<span>${response.destination.address}</span><span>${new Date(response.endDate).toLocaleTimeString()}</span>`;
        });

        elementProperty.getElement("#tripType",element=>{
            element.innerHTML = response.tripType;
        });

        elementProperty.getElement(".price-trip",element=>{
            element.innerHTML = `${JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney} ${Mask.maskMoney(response.price)}`;
        });

        elementProperty.getElement("#haveReturn",element=>{
            element.innerHTML = response.haveReturn ? "Viagem Com Retorno" : '';
        });

        elementProperty.getElement("#durationTrip",element=>{
            const dateStart = new Date(response.date);
            const dateEnd = new Date(response.endDate);

            element.innerHTML = `${parseInt(((dateEnd - dateStart)/1000)/60)} min`;
        });

        mapService.importScriptWithPlaces().then(()=>{
            mapService.getImgMapTrip(
                {lat:response.origin.latitude,lng:response.origin.longitude},
                {lat:response.destination.latitude,lng:response.destination.longitude}).then((image)=>{
                elementProperty.getElement("#imageTrip",element=>{
                    element.setAttribute("src",image);
                })
            })
        });
    }
});