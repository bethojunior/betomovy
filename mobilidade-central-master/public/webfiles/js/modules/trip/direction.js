document.addEventListener('DOMContentLoaded', function () {
    const urlSplit = location.href.split('/');

    let driverMarker = null;
    const places = [];
    const tripReference = urlSplit[urlSplit.length - 2];
    const mapService = new MapService();

    TripController.getByTripReference(tripReference).then(({ data }) => {
        document.querySelector('.profile-image').style.backgroundImage = `url('${data.driver.profilePicture}')`;
        document.querySelector('#nameDriver').innerHTML = data.driver.name;
        document.querySelector('#plateCar').innerHTML = data.driver.car.plate;
        document.querySelector('#listAddress').innerHTML = addAddress(data.origin.address);

        places.push({ lat: parseFloat(data.origin.latitude), lng: parseFloat(data.origin.longitude) });

        document.querySelector('#listAddress').innerHTML += data.tripWayPoints.map(place => {
            places.push({ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) });
            return addAddress(place.address);
        }).join('');

        places.push({ lat: parseFloat(data.destination.latitude), lng: parseFloat(data.destination.longitude) });
        document.querySelector('#listAddress').innerHTML += addAddress(data.destination.name);

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
        const ROUTE_HOST_TRIP_SHARE_URL = environment.hosts.socketRealtime || 'https://realtime.704apps.com.br';

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
