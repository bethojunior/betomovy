function initPositionDrivers() {
    const drivers = {};

    getPositionDriverById = (driverId) => {
        const lngLat = drivers[driverId].position;
        return { lat: lngLat.lat(), lng: lngLat.lng() };
    };

    getPositionDrivers();

    function getPositionDrivers() {
        DriverRepository.getDriversPositions(Session.getValueInSession('centralSelected', 'id'))
            .then(({ status, response }) => {
                if (status && response && Array.isArray(response)) {
                    response.forEach(driver => {
                        if (driver && driver.idDriver && driver.latitude && driver.longitude) {
                            const lat = parseFloat(driver.latitude);
                            const lng = parseFloat(driver.longitude);
                            if (!drivers[driver.idDriver]) {
                                drivers[driver.idDriver] = createCar(driver, lat, lng);
                            } else {
                                moveCar(driver.idDriver, lat, lng);
                            }
                        }
                    });
                }
            })
            .catch(err => console.error('Erro ao buscar posições dos motoristas:', err))
            .finally(() => setTimeout(getPositionDrivers, 15000));
    }

    function createCar(driver, lat, lng) {
        initPop();

        const pop = new Popup(
            { lat, lng },
            `<div class="container-car tooltip-customer" driverId="${driver.idDriver}"
                ${driver?.iconMapDriver ? `style="background-image: url('${driver.iconMapDriver}')"` : ''}>
                <span class="tooltiptext">${driver.name}</span>
            </div>`
        );

        pop.setMap(mapService.map);
        return pop;
    }

    function moveCar(id, lat, lng) {
        const currentPosition = {
            lat: drivers[id].position.lat(),
            lng: drivers[id].position.lng(),
        };
        const futurePosition = { lat, lng };

        const meters = mapService.getDistanceFromLatLonInMeters(currentPosition, futurePosition);
        if (meters <= 4) return;

        const numDeltas = 100;
        const delay = 25;
        let index = 0;
        const deltaLat = (futurePosition.lat - currentPosition.lat) / numDeltas;
        const deltaLng = (futurePosition.lng - currentPosition.lng) / numDeltas;

        const moveMarker = () => {
            const prevLat = currentPosition.lat;
            const prevLng = currentPosition.lng;

            currentPosition.lat += deltaLat;
            currentPosition.lng += deltaLng;

            drivers[id].position = currentPosition;

            const rotation = turf.bearing(
                [prevLng, prevLat],
                [currentPosition.lng, currentPosition.lat]
            );

            const el = document.querySelector(`.container-car[driverId='${id}']`);
            if (el) el.style.transform = `rotate(${rotation}deg)`;

            drivers[id].draw();

            if (index !== numDeltas) {
                index++;
                setTimeout(moveMarker, delay);
            }
        };

        moveMarker();
    }
}
