document.addEventListener("DOMContentLoaded", function () {

    const STATUS_PRE_ACCEPTED = "pre_accepted";
    const STATUS_ACCEPTED = "accepted";
    const STATUS_BOARDING = "boarding";
    const STATUS_IN_PROGRESS = "in_progress";
    const STATUS_FINISHED = "finished";
    const STATUS_CANCELED = "canceled";
    const STATUS_NOT_ANSWERED = "not_answered";
    const STATUS_BACK_OFF = "back_off";
    const STATUS_PAYMENT_REFUSED = "payment_refused";
    const appVersion = new HomeController();

    appVersion.getDefaultAppLogo()
    .then(response => {
       console.log(response);
        const logo = document.querySelector('#default-logo');
        logo.setAttribute('src', response.data);
    });

    const mapService = new MapService();
    const elementProperty = new ElementProperty();

    const SettingMap = {
        mapActive: false
    };

    const tripController = new TripController();

    const url = location.href.split("/");
    const tripReference = url[url.length - 2];

    var link = "";

    ConnectionServer.sendRequest('Support/GetConfig', 'POST', {configKey: "link_storage_pictures"},
        (e) => {
            if (e.status)
                link = e.data;
        }, undefined, undefined, false);


    updateViewTrip(tripReference);

    function updateViewTrip(tripReference) {
        tripController.share(tripReference).then(({status, data, message}) => {
            if (!status) {
                SimpleSwall.modalError(message);
                return;
            }
            if (!SettingMap.mapActive) {
                initMap(data);
                return;
            }

            watchTrip(data);

        });
    }

    function getURLSocket() {
        const split = HOST_API.split("/");

        return `http://${split[split.length - 2]}`
    }

    function initMap(trip) {
        mapService.importScriptWithPlaces().then(function () {
            SettingMap.mapActive = true;

            mapService.initMap("map", {
                lat: parseFloat(trip.origin.latitude),
                lng: parseFloat(trip.origin.longitude)
            });

            CityController.getConfig({
                lat: parseFloat(trip.origin.latitude),
                lng: parseFloat(trip.origin.longitude)
            }).then((result) => {
                const cityConfig = result.data;

                const socketUrl = ROUTE_HOST_TRIP_SHARE_URL || 'https://realtime.704apps.com.br';
                const socket = io(socketUrl, {
                    query: { tripReference },
                    transports: ['polling'],
                    withCredentials: false
                });

                socket.on(`location-${tripReference}`, function (result) {
                    if (!result) return;

                    const {position, polyline} = result || {};
                    const positionWait = getDestination(trip);
                    mapService.updateRouteInMap(positionWait, position, polyline, null);
                });
            });

            watchTrip(trip);
        });
    }

    function watchTrip(trip) {
        if (trip.status === "finished" || trip.status === "canceled") {
            elementProperty.getElement(".modal-finish", element => {
                element.classList.add("active");
            });
        }

        updateTrip(trip);

        ConnectionServer.sendRequest(
            'Support/GetConfig',
            'POST',
            {configKey: "firebase_cloud_firestore_key"},
            (e) => {
                if (e.status) {
                    initConfigFirebase(JSON.parse(e.data));
                    initRealtimeTrip(tripReference);
                }
            },
            undefined, undefined, false);

        /*setTimeout(function () {
            updateViewTrip(tripReference);
        }, 10000);*/
    }

    function updateTrip(trip) {
        if(trip.customer) {
            ConnectionServer.sendRequest('Support/GetConfig', 'POST', {configKey: "link_customer_pre_register"}, (e) => {
                elementProperty.getElement(".link-app-store", element => {
                    element.setAttribute("href", e.data.replace("{userId}", btoa(trip.customer.idUser)));
                });
            }, undefined, undefined, false)
        }

        elementProperty.getElement("#profileDriver", element => {
            element.style.backgroundImage = `url(${link}driver/profile/${trip.driver.profileImage})`;
        });

        elementProperty.getElement("#name", element => {
            element.innerHTML = trip.driver.nickname;
        });

        elementProperty.getElement("#plate", element => {
            element.innerHTML = trip.driver.car.plate;
        });

        elementProperty.getElement("#car-info", element => {
            element.innerHTML = `${trip.driver.car.brand}/${trip.driver.car.model} - ${trip.driver.car.color}`;
        });

        elementProperty.getElement("#addressOrigin", element => {
            element.innerHTML = trip.origin.address;
        });

        elementProperty.getElement("#waypointsContainer", element => {
            element.innerHTML = '';
            
            if (trip.tripWayPoints && Array.isArray(trip.tripWayPoints) && trip.tripWayPoints.length > 0) {
                trip.tripWayPoints.forEach((waypoint, index) => {
                    if (!waypoint) return;
                    
                    const waypointDiv = document.createElement('div');
                    waypointDiv.className = 'waypoint-item';
                    
                    const address = waypoint.address || 
                                   waypoint.name || 
                                   (waypoint.origin && waypoint.origin.address) ||
                                   (waypoint.destination && waypoint.destination.name) ||
                                   `Parada ${index + 1}`;
                    
                    const spanElement = document.createElement('span');
                    spanElement.textContent = address;
                    waypointDiv.appendChild(spanElement);
                    element.appendChild(waypointDiv);
                });
            }
        });

        elementProperty.getElement("#addressDestination", element => {
            element.innerHTML = trip.destination.name;
        });
        
        elementProperty.getElement("#numberStar", element => {
            element.innerHTML = '';
            
            const imgElement = document.createElement('img'); 
            imgElement.setAttribute('src', '/webfiles/img/icons/star.png'); 
            imgElement.setAttribute('alt', 'Estrela de avaliação');
            element.appendChild(imgElement);

            const pElement = document.createElement('p');
            const rating = parseFloat(trip.driver.rating);

            if (!isNaN(rating)) {
                pElement.textContent = rating.toFixed(1);
                element.appendChild(pElement);
            } else {
                pElement.textContent = "5.0";
                element.appendChild(pElement);
            }
        });
        
        mapService.clearWaypoints();

        mapService.addPointClient({
            lat: parseFloat(trip.origin.latitude),
            lng: parseFloat(trip.origin.longitude)
        });

        if (trip.tripWayPoints && Array.isArray(trip.tripWayPoints) && trip.tripWayPoints.length > 0) {
            trip.tripWayPoints.forEach((waypoint, index) => {
                if (!waypoint) return;
                
                let lat = waypoint.latitude || 
                         (waypoint.origin && waypoint.origin.latitude) ||
                         (waypoint.destination && waypoint.destination.latitude);
                         
                let lng = waypoint.longitude || 
                         (waypoint.origin && waypoint.origin.longitude) ||
                         (waypoint.destination && waypoint.destination.longitude);
                
                if (lat && lng) {
                    mapService.addPointWaypoint({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng)
                    }, index);
                }
            });
        }

        mapService.addPointDestination({
            lat: parseFloat(trip.destination.latitude),
            lng: parseFloat(trip.destination.longitude)
        });
    }

    function initRealtimeTrip(tripReference) {
        const tripRouteRealtime = new TripRouteRealtime();

        const tripRealtime = new TripRealtime();
        tripRealtime.getTrip(tripReference, (trip, type) => {
            updateTrip(trip, type);

            tripRouteRealtime.close();

            /*tripRouteRealtime.getPositionDriver(tripReference, (result) => {
                const {position, polyline} = result;

                const positionWait = getDestination(trip);

                mapService.updateRouteInMap(positionWait, position, polyline);
            })*/
        });

    }

    function getRoute(trip) {
        return new Promise((resolve, reject) => {
            const destination = {
                lat: 0, lng: 0
            };
            const origin = {
                lat: parseFloat(trip.driver.location.latitude),
                lng: parseFloat(trip.driver.location.longitude),
            };
            switch (trip.status) {
                case "accepted":
                case "boarding": {
                    destination.lat = parseFloat(trip.origin.latitude);
                    destination.lng = parseFloat(trip.origin.longitude);

                    break;
                }
                case "in_progress": {

                    destination.lat = parseFloat(trip.destination.latitude);
                    destination.lng = parseFloat(trip.destination.longitude);
                    mapService.addPointDestination(destination)
                    break;
                }
                default: {
                    reject();
                    return;
                }
            }

            resolve({origin, destination});
        });
    }

    function getDestination(trip) {
        if (trip.status === STATUS_ACCEPTED || trip.status === STATUS_BOARDING || trip.status === STATUS_PRE_ACCEPTED)
            return {
                lat: parseFloat(trip.origin.latitude),
                lng: parseFloat(trip.origin.longitude)
            };
        if (trip.status === STATUS_IN_PROGRESS)
            return {
                lat: parseFloat(trip.destination.latitude),
                lng: parseFloat(trip.destination.longitude)
            };
    }

});