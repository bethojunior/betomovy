document.addEventListener('DOMContentLoaded', function () {
    const urlSplit = location.href.split('/');

    let driverMarker = null;
    const places = [];
    const tripReference = urlSplit[urlSplit.length - 2];
    const mapService = new MapService();

    TripController.getByTripReference(tripReference).then(({ data }) => {
        if (!data) return;

        const driver = data.driver || {};
        const car = driver.car || {};
        const origin = data.origin || {};
        const destination = data.destination || {};
        const wayPoints = Array.isArray(data.tripWayPoints) ? data.tripWayPoints : [];

        const profileEl = document.querySelector('.profile-image');
        if (profileEl) {
            profileEl.style.backgroundImage = `url('${driver.profilePicture || ''}')`;
        }
        const nameEl = document.querySelector('#nameDriver');
        if (nameEl) nameEl.innerHTML = driver.name || '';
        const plateEl = document.querySelector('#plateCar');
        if (plateEl) plateEl.innerHTML = car.plate || '';

        const listEl = document.querySelector('#listAddress');
        if (listEl) {
            listEl.innerHTML = addAddress(origin.address || '');
            if (origin.latitude && origin.longitude) {
                places.push({ lat: parseFloat(origin.latitude), lng: parseFloat(origin.longitude) });
            }

            listEl.innerHTML += wayPoints.map(place => {
                if (place.latitude && place.longitude) {
                    places.push({ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) });
                }
                return addAddress(place.address || '');
            }).join('');

            if (destination.latitude && destination.longitude) {
                places.push({ lat: parseFloat(destination.latitude), lng: parseFloat(destination.longitude) });
            }
            listEl.innerHTML += addAddress(destination.name || destination.address || '');
        }

        initMap();
    });

    function addAddress(address) {
        return `<li><span>${address}</span></li>`;
    }

    function initMap() {
        mapService.importScriptWithPlaces().then(() => {
            const centralSelected = Session.get('centralSelected');
            if (!centralSelected) return;

            mapService.initMap('map', {
                lat: parseFloat(centralSelected.latitude),
                lng: parseFloat(centralSelected.longitude),
            }, () => {
                // Marcador do motorista (começa fora do mapa)
                driverMarker = mapService.makeMarker(
                    { lat: 0, lng: 0 },
                    null,
                    { url: '/webfiles/img/icon/driver.png', scaledSize: { width: 30, height: 30 } }
                );

                // Marcadores dos pontos da viagem
                places.forEach(place => {
                    mapService.makeMarker(
                        place,
                        mapService.map,
                        { url: '/webfiles/img/icon/pin.png', scaledSize: { width: 30, height: 30 } }
                    );
                });

                updateTrip();
            });
        });
    }

    function updateTrip() {
        const ROUTE_HOST_TRIP_SHARE_URL = environment.hosts.socketRealtime || 'https://socket.movymob.com';

        const socket = io(ROUTE_HOST_TRIP_SHARE_URL, {
            query: { tripReference },
            transports: ['polling'],
            withCredentials: false,
        });

        socket.on(`location-${tripReference}`, function (result) {
            if (!result) return;

            const points = MapService.decodePolyline(result?.polyline);
            mapService._setRoutePolyline(points);

            mapService.setBoundsArray([...places, ...points]);

            const pos = result?.position;
            if (pos && driverMarker) {
                driverMarker.setPosition({ lat: pos.lat, lng: pos.lng });
                if (driverMarker._mbMarker && mapService.map) {
                    driverMarker._mbMarker.addTo(mapService.map);
                }
            }
        });
    }
});
