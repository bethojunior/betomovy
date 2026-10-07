class MapService {

    constructor() {
        this.map = null;
        this.markers = [];

        this.iconDriver = {
            path: "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z",
            scale: .4,
            strokeColor: 'white',
            strokeWeight: .10,
            fillOpacity: 1,
            fillColor: null,
            offset: '5%',
            // rotation: parseInt(heading[i]),
        };

        this.guests = [];

        this.drivers = {};
        this.routes = {};

        this.numDeltas = 100;
        this.delay = 10;
        this.markerCluster = null;
        this.infoTrip = {};
        this.infowindow = null;
        this.markersPoints = [];
        this.pointOrigin = null;
        this.pointDestination = null;
        this.libraries = "places";
        this.keys = [];
    }

    getKeys() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("webMapKey", "GET", null, resolve, reject, true);
        })
    }

    mapErrorEvent(callback) {
        let console = window.console
        if (!console) return

        function intercept(method) {
            let original = console[method]
            console[method] = function () {
                if (arguments[0] &&
                    (arguments[0].includes('Billing') ||
                        arguments[0].includes('InvalidKeyMapError') ||
                        arguments[0].includes('quota') ||
                        arguments[0].includes('exceeded')
                    )) {
                    callback();
                }

                if (original.apply) {
                    // Do this for normal browsers
                    original.apply(console, arguments)
                } else {
                    // Do this for IE
                    let message = Array.prototype.slice.apply(arguments).join(' ')
                    original(message)
                }
            }
        }

        let methods = ['error']; // only interested in the console.error method
        for (let i = 0; i < methods.length; i++)
            intercept(methods[i])
    }

    initMap(center, zoom, element = document.getElementById('map'), noMove = false) {
        return new Promise((resolve, reject) => {
            const options = {
                center,
                zoom,
                disableDefaultUI: true,
                clickableIcons: false,
                styles: [
                    {
                        "featureType": "poi",
                        "stylers": [
                            {"visibility": "off"}
                        ]
                    }
                ]
            };

            if (noMove) {
                options['gestureHandling'] = 'none';
                options['zoomControl'] = false;
            }

            try {
                this.mapErrorEvent(() => {
                    const keys = Session.getLocal("keys");
                    keys.shift();
                    Session.setLocal("keys",keys);
                    if (keys.length > 0) {
                        SwalCustom.messageDialog("","Ocorreu um problema ao tentar carregar o mapa").then(()=>{
                            location.reload();
                        })
                    }
                });

                this.map = new google.maps.Map(element, options);

                this.iconDriver.anchor = new google.maps.Point(10, 25);
                this.directionsService = new google.maps.DirectionsService;
                this.directionsDisplay = new google.maps.DirectionsRenderer;

                resolve();
            } catch (e) {
                console.log("aqui", e)
                reject();
            }
        })
    }

    setBounds(...bounds) {
        const bound = new google.maps.LatLngBounds();

        bounds.map(position => {
            bound.extend(position);
        });
        this.map.fitBounds(bound);
    }


    setBoundsArray(bounds) {
        const bound = new google.maps.LatLngBounds();

        bounds.map(position => {
            bound.extend(position);
        });
        this.map.fitBounds(bound);
    }

    setBoundsInMap(bounds) {
        const bound = new google.maps.LatLngBounds();

        bounds.map(position => {
            bound.extend(position);
        });
        this.map.fitBounds(bound);
    }

    clearMarkers() {
        this.markers.map(marker => {
            marker.setMap(null);
        });
    }

    createMaker(position, icon = null, title = "") {
        return new google.maps.Marker({
            position: position,
            map: this.map,
            title: title,
            icon: icon
        })
    }

    createMarker(position, icon) {
        return new google.maps.Marker({
            position,
            icon,
            map: this.map
        });
    }

    makeMarker(driver, status, color, inTrip = false) {

        this.iconDriver.fillColor = color;

        const position = {lat: parseFloat(driver.latitude), lng: parseFloat(driver.longitude)};

        if (!this.drivers[driver.idDriver]) {
            this.drivers[driver.idDriver] = {
                marker: new google.maps.Marker({
                    position: position,
                    map: this.map,
                    title: driver.name,
                    icon: this.iconDriver
                }),
                timeout: null,
                status,
                currentPosition: position
            };
            return;
        }

        this.drivers[driver.idDriver].marker.setIcon(this.iconDriver);
        this.drivers[driver.idDriver].status = status;
        this.drivers[driver.idDriver].futurePosition = position;


        const meter = this.getDistanceFromLatLonInMeters(this.drivers[driver.idDriver].currentPosition,
            position);


        this.transition(driver.idDriver);
    }

    clearGuest() {
        this.guests.map(guest => {
            guest.setMap(null);
        });

        this.guests = [];
    }

    addCallPosition(trip) {

        if (trip.status === STATUS_SEARCH || trip.status === STATUS_SEARCH_FAVORITE)
            this.showSearchTrip(trip, `<div class="container-search-car">
                    <span>Procurando carro</span>
                    <div>
                        <p><i class="material-icons">person_pin_circle</i> <span>${trip.customerName}</span></p>
                        <p><i class="material-icons">schedule</i>
                        <span id="timeSearchingTrip${trip.tripReference}">00:00</span></p>
                    </div>
                </div>`);

    }

    setZoomMap(zoom) {
        this.map.setZoom(zoom);
    }

    setPositionMap(position) {
        this.map.setCenter(position);
    }

    transition(id) {
        clearTimeout(this.drivers[id].timeout);

        this.drivers[id].index = 0;
        this.drivers[id].deltaLat = (this.drivers[id].futurePosition.lat - this.drivers[id].currentPosition.lat) / this.numDeltas;
        this.drivers[id].deltaLng = (this.drivers[id].futurePosition.lng - this.drivers[id].currentPosition.lng) / this.numDeltas;

        this.moveMarker(id);
    }

    moveMarker(id) {

        if (!this.drivers[id])
            return;

        this.drivers[id].currentPosition.lat = this.drivers[id].currentPosition.lat + this.drivers[id].deltaLat;
        this.drivers[id].currentPosition.lng = this.drivers[id].currentPosition.lng + this.drivers[id].deltaLng;

        const latlng = new google.maps.LatLng(this.drivers[id].currentPosition.lat, this.drivers[id].currentPosition.lng);

        const last = this.drivers[id].marker.getPosition();

        this.drivers[id].marker.setPosition(latlng);

        const icon = this.drivers[id].marker.getIcon();

        icon.rotation = google.maps.geometry
            .spherical.computeHeading(last, this.drivers[id].marker.getPosition());

        if (icon.rotation !== 0)
            this.drivers[id].marker.setIcon(icon);

        if (this.drivers[id].index !== this.numDeltas) {
            this.drivers[id].index++;

            this.drivers[id].timeout = setTimeout(() => {
                this.moveMarker(id);
            }, this.delay);
            return;
        }

        clearTimeout(this.drivers[id].timeout);
        this.drivers[id].timeout = null;
    }

    getKey() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestApi('Support/GoogleApiKey', 'GET', null, resolve, reject, false)
        });
    }

    setLibraries(name) {
        this.libraries = name;
    }

    async importScriptWithPlaces(executeResolve = false) {
        const {data} = await this.getKey();
        this.keys = await this.getKeys().then(({response}) => {
            return response.map(item => item.key);
        });

        let list = Session.getLocal("keys").length > 0 ? Session.getLocal("keys") : [data,...this.keys];

        Session.setLocal("keys",list);

        Session.set("googleApiKey", data);
        return await this.loadScriptMap(list[0]);
    }

    loadScriptMap(key) {
        return new Promise((resolve) => {
            const url = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=${this.libraries}`;

            const id = "scriptMapLibraries";

            if (document.getElementById(id) !== null) {
                window.google = undefined;
                document.getElementById(id).remove();
            }


            const script = document.createElement('script');

            script.setAttribute('src', url);

            script.setAttribute('id', id);

            script.async = true;

            script.defer = true;

            document.body.appendChild(script);

            script.addEventListener('load', resolve);
        });
    }

    getDistanceFromLatLonInMeters(lastPosition, currentPosition) {

        let deg2rad = function (deg) {
                return deg * (Math.PI / 180);
            },
            R = 6371,
            dLat = deg2rad(lastPosition.lat - currentPosition.lat),
            dLng = deg2rad(lastPosition.lng - currentPosition.lng),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(deg2rad(currentPosition.lat))
                * Math.cos(deg2rad(currentPosition.lat))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseInt((R * c * 1000).toFixed());
    }

    showMarkerCluster() {
        this.markerCluster = new MarkerClusterer(this.map, Object.keys(this.drivers).map(id => this.drivers[id].marker),
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }

    getImgMapTrip(key, origin, destination, markers = [], waypoints = []) {

        const pointMarkers = markers.map(marker => {
            return `&markers=color:${marker.color}%7C${marker.lat},${marker.lng}`;
        }).join("");

        return new Promise(resolve => {
            GoogleServiceController
                .getDirection(`${origin.lat},${origin.lng}`, `${destination.lat},${destination.lng}`, key)
                .then(result => {

                    resolve("https://maps.googleapis.com/maps/api/staticmap" +
                        "?size=600x300&path=weight:5%7Ccolor:black%7Cenc:" + result.routes[0].overview_polyline.points +
                        `&markers=color:green%7C${origin.lat},${origin.lng}` +
                        `&markers=color:red%7C${destination.lat},${destination.lng}` +
                        `${pointMarkers}` +
                        `&key=${key}`);
                });
        });
    }

    getImageStaticRoute(tripReference, key, origin, destination, markers = [], waypoints = [], tracing = null) {
        const pointMarkers = markers.map(marker => {
            return `&markers=color:${marker.color || 'red'}%7C${marker.lat},${marker.lng}`;
        }).join("");

        const waypointMarkers = waypoints.map(waypoint => {
            return `&markers=color:blue%7C${waypoint.lat},${waypoint.lng}`;
        }).join("");

        return new Promise(resolve => {
            if (tracing) {
                resolve("https://maps.googleapis.com/maps/api/staticmap" +
                    "?size=600x300&path=weight:5%7Ccolor:black%7Cenc:" + tracing +
                    `&markers=color:green%7C${origin.lat},${origin.lng}` +
                    `&markers=color:red%7C${destination.lat},${destination.lng}` +
                    `${pointMarkers}` +
                    `${waypointMarkers}` +
                    `&key=${key}`);
            } else {
                MapService.getRouteByTrip(tripReference).then(({status, response}) => {
                    resolve("https://maps.googleapis.com/maps/api/staticmap" +
                        "?size=600x300&path=weight:5%7Ccolor:black%7Cenc:" + response.points +
                        `&markers=color:green%7C${origin.lat},${origin.lng}` +
                        `&markers=color:red%7C${destination.lat},${destination.lng}` +
                        `${pointMarkers}` +
                        `${waypointMarkers}` +
                        `&key=${key}`);
                });
            }
        });
    }

    static getRouteByTrip(tripReference) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`trip/${tripReference}/driverPositions`, "GET", null,
                resolve, null, true);
        });
    }

    showSearchTrip(trip, content) {
        const elementProperty = new ElementProperty();

        const driverCalled = this.getNextDriver(trip.driversCalled);

        const path = [
            {
                lat: parseFloat(trip.originLatitude),
                lng: parseFloat(trip.originLongitude)
            },
            {
                lat: parseFloat(driverCalled.last_lat),
                lng: parseFloat(driverCalled.last_lon)
            }
        ];

        if (this.infoTrip[trip.tripReference] === undefined) {

            const latLng = new google.maps.LatLng(parseFloat(trip.originLatitude), parseFloat(trip.originLongitude));
            const startTime = new Date();

            this.infoTrip[trip.tripReference] = {
                popupClient: new Popup(latLng, content),
                popupDriver: this.getPopDriverQuestion(driverCalled),
                line: new google.maps.Polyline({
                    path,
                    geodesic: true,
                    strokeColor: '#00adff',
                    strokeOpacity: 1.0,
                    strokeWeight: 1,
                }),
                startTime: startTime,
                intervalId: null
            };

            this.infoTrip[trip.tripReference].line.setMap(this.map);
            this.infoTrip[trip.tripReference].popupClient.setMap(this.map);
            this.infoTrip[trip.tripReference].popupDriver.setMap(this.map);

            setTimeout(() => {
                this.startTimer(trip.tripReference);
            }, 100);
        }

        this.infoTrip[trip.tripReference].line.setPath(path);
        this.infoTrip[trip.tripReference].popupDriver.setMap(null);
        this.infoTrip[trip.tripReference].popupDriver = this.getPopDriverQuestion(driverCalled);
        this.infoTrip[trip.tripReference].popupDriver.setMap(this.map);

        elementProperty.addEventInElement(".container-search-car", "onclick", function () {
            if (!this.classList.contains("active")) {
                this.classList.add("active");
                return;
            }
            this.classList.remove("active");
        })
    }

    startTimer(tripReference) {
        const tripInfo = this.infoTrip[tripReference];
        
        if (!tripInfo || !tripInfo.startTime) {
            console.warn('startTimer: tripInfo ou startTime não encontrado', tripReference);
            return;
        }

        if (tripInfo.intervalId) {
            clearInterval(tripInfo.intervalId);
        }

        this.updateTimer(tripReference);

        tripInfo.intervalId = setInterval(() => {
            this.updateTimer(tripReference);
        }, 1000);
    }

    updateTimer(tripReference) {
        const tripInfo = this.infoTrip[tripReference];
        
        if (!tripInfo || !tripInfo.startTime) {
            return;
        }

        const now = new Date();
        let diff = Math.floor((now - tripInfo.startTime) / 1000);

        if (diff < 0) {
            diff = 0;
        }

        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;

        const pad = (num) => {
            return num < 10 ? '0' + num : num;
        };

        const timeString = `${pad(minutes)}:${pad(seconds)}`;

        const element = document.getElementById(`timeSearchingTrip${tripReference}`);
        if (element) {
            element.innerHTML = timeString;
        } else {
            console.warn('updateTimer: elemento não encontrado', `timeSearchingTrip${tripReference}`);
        }
    }

    stopTimer(tripReference) {
        const tripInfo = this.infoTrip[tripReference];
        if (tripInfo && tripInfo.intervalId) {
            clearInterval(tripInfo.intervalId);
            tripInfo.intervalId = null;
        }
    }

    existTripInMap(trips) {
        const _that = this;

        Object.keys(this.infoTrip).filter(tripReference => {
            return trips.filter(trip => {
                return tripReference === trip.tripReference;
            })[0] === undefined;
        }).map(tripReference => {
            _that.stopTimer(tripReference);
            _that.infoTrip[tripReference].popupClient.setMap(null);
            _that.infoTrip[tripReference].line.setMap(null);
            _that.infoTrip[tripReference].popupDriver.setMap(null);
            delete _that.infoTrip[tripReference];
        });
    }

    routeTrip(trips) {
        const _that = this;

        const tripsProgress = trips.filter(trip => {
            return STATUS_SEARCH !== trip.status
                || trip.status !== STATUS_SEARCH_FAVORITE
        });

        tripsProgress.map(trip => {
            if (_that.routes[trip.tripReference] === undefined)
                _that.initRoute(trip);

            _that.updateRoute(trip)
        });
    }

    initRoute(trip) {
        this.routes[trip.tripReference] = {
            directionsService: new google.maps.DirectionsService,
            directionsDisplay: new google.maps.DirectionsRenderer,
        };
    }

    updateRoute(trip) {
        const _that = this;

        if (_that.drivers[trip.driverId] === undefined)
            return;

        const positionDriver = _that.drivers[trip.driverId].marker.getPosition();

        const origin = {lat: positionDriver.lat(), lng: positionDriver.lng()};

        this.routes[trip.tripReference].directionsService.route({
            origin: origin,
            destination: _that.getDestinationByStatus(trip),
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {

                _that.routes[trip.tripReference].directionsDisplay.setOptions({
                    suppressMarkers: true,
                    preserveViewport: true
                });
                _that.routes[trip.tripReference].directionsDisplay.setDirections(response);
                _that.routes[trip.tripReference].directionsDisplay.setMap(_that.map);

            }
        });
    }

    getDestinationByStatus(trip) {
        switch (trip.status) {
            case "accepted":
            case "boarding": {
                return {
                    lat: parseFloat(trip.originLatitude),
                    lng: parseFloat(trip.originLongitude)
                }
            }
            case "in_progress": {
                return {
                    lat: parseFloat(trip.destinationLatitude),
                    lng: parseFloat(trip.destinationLongitude)
                }
            }
        }
    }

    clearFinishTrip(trips) {
        const _that = this;

        Object.keys(this.routes).filter(tripReference => {
            return trips.filter(trip => {
                return tripReference === trip.tripReference;
            })[0] === undefined;
        }).map(tripReference => {
            _that.routes[tripReference].directionsDisplay.setMap(null);
            delete _that.routes[tripReference];
        });
    }

    addInfoDriver(driverId, content) {
        this.infowindow = new google.maps.InfoWindow({
            content: content
        });

        this.infowindow.open(this.map, this.drivers[driverId].marker);
    }

    getNextDriver(driversCalled) {
        const drivers = driversCalled.filter(driver => {
            return driver.status === "calling";
        });

        if (drivers.length === 0)
            return [];

        if (drivers.length > 1)
            return false;

        return drivers[0];
    }

    getPopDriverQuestion(driverCalled) {
        const latLng = new google.maps.LatLng(
            parseFloat(driverCalled.last_lat),
            parseFloat(driverCalled.last_lon)
        );

        return new Popup(latLng, `
            <div class='container-question-driver'>
                <div style="background-image: url(${environment.hosts.hostImageDriver}${driverCalled.profileImage})"></div>
            </div>`);
    }

    showPointEventMap(origin, destination, events, callback = undefined) {
        this.clearEvent();

        this.pointOrigin = new google.maps.Marker({
            position: origin,
            map: this.map,
            title: "Origem",
            icon: `/webfiles/img/icon/origin.png`
        });

        this.pointDestination = new google.maps.Marker({
            position: destination,
            map: this.map,
            title: "Destino",
            icon: `/webfiles/img/icon/destination.png`
        });

        this.showEvent(events);

        if (callback)
            callback();

    }

    addSearchInInput(input, callback) {
        const searchBox = new google.maps.places.Autocomplete(input, {componentRestrictions: {country: "br"}});

        if (this.map !== null)
            searchBox.bindTo('bounds', this.map);

        searchBox.setFields(
            ['address_components', 'geometry', 'icon', 'name']);

        searchBox.addListener('place_changed', function () {
            const place = searchBox.getPlace();

            if (!place.address_components) {
                if (!input.classList.contains("error"))
                    input.classList.add("error");

                elementProperty.getElement(".pac-container", element => {
                    if (element.children.length > 0) {
                        setTimeout(function () {
                            element.style.display = "block";
                        }, 250)
                    }
                });
                return;
            }

            input.classList.remove("error");
            callback(place, input);
        });
    }

    showEvent(events) {
        this.markersPoints = events.map((event, index) => {
            return new google.maps.Marker({
                position: {
                    lat: parseFloat(event.data.driver.location.latitude),
                    lng: parseFloat(event.data.driver.location.longitude)
                },
                map: this.map,
                title: event.message,
                icon: `/webfiles/img/icon/point-${index}.png`
            })
        });
    }

    clearEvent() {
        this.markersPoints.map(marker => {
            marker.setMap(null);
        });

        if (this.pointOrigin !== null)
            this.pointOrigin.setMap(null);

        if (this.pointDestination)
            this.pointDestination.setMap(null);

        this.markersPoints = [];
    }

    createPolyline(path) {
        return new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: '#000',
            strokeOpacity: 1.0,
            strokeWeight: 2.5,
        })
    }

    static decodePolyline(encoded) {
        if (!encoded) {
            return [];
        }
        var poly = [];
        var index = 0, len = encoded.length;
        var lat = 0, lng = 0;

        while (index < len) {
            var b, shift = 0, result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);

            var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);

            var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lng += dlng;

            var p = {
                lat: lat / 1e5,
                lng: lng / 1e5,
            };
            poly.push(p);
        }
        return poly;
    }
}