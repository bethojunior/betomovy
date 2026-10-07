const managerMapLayout = {
    cars: [],
    timeout: null
};

function showVehicles() {
    const userLogged = Session.get("user");

    clearTimeout(managerMapLayout.timeout);

    const {lat, lng} = Session.get("lastPosition");

    clearSearchinCarMap();

    if (userLogged.status === "corrida")
        return;

    if (mapService.map == null)
        return;

    DriverCloseController.get({lat, lng}).then(({status, data}) => {
        if (!status)
            return;

        if (!data)
            return;

        data.map((car) => {
            const position = {
                lat: parseFloat(car.latitude),
                lng: parseFloat(car.longitude)
            };

            managerMapLayout.cars.push(mapService.map.addMarker({
                icon: {
                    url: car.iconMapDriver || `webfiles/img/icon/car-particular.png`,
                    size: {
                        width: 30,
                        height: 40
                    }
                },
                anchor: [10, 25],
                visible: true,
                draggable: false,
                position: position,
                rotation: 0

            }));
        });

    }).finally(() => {
        managerMapLayout.timeout = setTimeout(showVehicles, 60000 * 5);
    });
}

function clearSearchinCarMap() {
    managerMapLayout.cars.map((car) => {
        car.remove();
    });
}
