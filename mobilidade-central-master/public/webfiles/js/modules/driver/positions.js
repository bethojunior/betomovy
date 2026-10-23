function initPositionDrivers() {
    const drivers = {};

    getPositionDriverById = (driverId) => {
        if (!drivers[driverId] || !drivers[driverId].position) return null;
        const pos = drivers[driverId].position;
        const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat;
        const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng;
        return { lat, lng };
    };

    getPositionDrivers();
    initSocketDrivers();

    function initSocketDrivers() {
        try {
            if (typeof SocketConnection !== 'undefined') {
                const sc = new SocketConnection();
                sc.on('driver.positions', function (data) {
                    if (!data) return;
                    const list = Array.isArray(data) ? data : [data];
                    list.forEach(driver => {
                        const rawLat = driver.latitude ?? driver.lat ?? driver.last_lat;
                        const rawLng = driver.longitude ?? driver.lng ?? driver.last_lon;
                        if (rawLat && rawLng && driver.idDriver) {
                            const lat = parseFloat(rawLat);
                            const lng = parseFloat(rawLng);
                            if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;
                            if (!drivers[driver.idDriver]) {
                                drivers[driver.idDriver] = createCar(driver, lat, lng);
                            } else {
                                if (window.mapService && window.mapService.map) {
                                    drivers[driver.idDriver].setMap(window.mapService.map);
                                }
                                moveCar(driver.idDriver, lat, lng);
                            }
                        }
                    });
                });
            }
        } catch (e) {
            console.warn('Socket drivers listener warning:', e);
        }
    }

    function getPositionDrivers() {
        if (!window.mapService || !window.mapService.map) {
            setTimeout(getPositionDrivers, 800);
            return;
        }

        const centralId = Session.getValueInSession('centralSelected', 'id');
        if (!centralId) {
            setTimeout(getPositionDrivers, 1500);
            return;
        }

        DriverRepository.getDriversPositions(centralId)
            .then(({ status, response }) => {
                if (status && response && Array.isArray(response)) {
                    response.forEach(driver => {
                        if (driver && driver.idDriver && driver.latitude && driver.longitude) {
                            const lat = parseFloat(driver.latitude);
                            const lng = parseFloat(driver.longitude);
                            if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;

                            if (!drivers[driver.idDriver]) {
                                drivers[driver.idDriver] = createCar(driver, lat, lng);
                            } else {
                                if (window.mapService && window.mapService.map) {
                                    drivers[driver.idDriver].setMap(window.mapService.map);
                                }
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

        const driverName = driver.name || driver.nickname || 'Motorista';
        const rawIcon = driver?.iconMapDriver;
        const hasValidIcon = rawIcon && typeof rawIcon === 'string' &&
            !rawIcon.endsWith('/') &&
            /\.(png|jpe?g|webp|svg)$/i.test(rawIcon) &&
            !rawIcon.includes('default.jpg') &&
            !rawIcon.includes('minio.704app');

        const pop = new Popup(
            { lat, lng },
            `<div class="container-car tooltip-customer" driverId="${driver.idDriver}" title="${driverName}"
                ${hasValidIcon ? `style="background-image: url('${rawIcon}')"` : ''}>
                <span class="tooltiptext">${driverName}</span>
            </div>`
        );

        if (window.mapService && window.mapService.map) {
            pop.setMap(window.mapService.map);
        }
        return pop;
    }

    function moveCar(id, lat, lng) {
        if (!drivers[id] || !drivers[id].position) return;
        const currentPos = drivers[id].position;
        const currentLat = typeof currentPos.lat === 'function' ? currentPos.lat() : currentPos.lat;
        const currentLng = typeof currentPos.lng === 'function' ? currentPos.lng() : currentPos.lng;

        const currentPosition = { lat: currentLat, lng: currentLng };
        const futurePosition = { lat, lng };

        if (!window.mapService || !window.mapService.getDistanceFromLatLonInMeters) {
            drivers[id].position = futurePosition;
            return;
        }

        const meters = window.mapService.getDistanceFromLatLonInMeters(currentPosition, futurePosition);
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

            if (typeof turf !== 'undefined' && turf.bearing) {
                try {
                    const rotation = turf.bearing(
                        [prevLng, prevLat],
                        [currentPosition.lng, currentPosition.lat]
                    );
                    const el = document.querySelector(`.container-car[driverId='${id}']`);
                    if (el) el.style.transform = `rotate(${rotation}deg)`;
                } catch (e) {}
            }

            if (typeof drivers[id].draw === 'function') {
                drivers[id].draw();
            }

            if (index !== numDeltas) {
                index++;
                setTimeout(moveMarker, delay);
            }
        };

        moveMarker();
    }
}
