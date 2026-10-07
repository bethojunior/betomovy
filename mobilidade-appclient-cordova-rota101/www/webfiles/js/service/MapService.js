class MapService {
    constructor() {
        this.map = null;
        this.locationClient = null;
        this.locationDestination = null;
        this.infoOrigin = null;
        this.infoDestination = null;
        this.infoSearch = null;
        this.pointDriver = null;
        this.locationClientTrip = null;
        this.iconDriver = {
            scale: .5,
            strokeColor: '#9a5e00',
            strokeOpacity: 1,
            strokeWeight: .5,
            fillOpacity: 1,
            fillColor: '#ff9a00',
            offset: '5%',
            // rotation: parseInt(heading[i]),
        };
        this.futurePosition = null;
        this.currentPosition = null;
        this.lastPosition = null;
        this.timeOut = null;
        this.numDeltas = 100;
        this.delay = 5; //milliseconds
        this.index = 0;
        this.deltaLat = 0;
        this.deltaLng = 0;
        this.isImportMap = false;
        this.key = null;
        this.waypoints = [];
        this.inRoute = false;
        this.bounds = [];
        this.waypointFinishedAnotherTrip = null;
        this.waypointFinishedAnotherTripInfo = null;
        this.pointCustomer = null;
        this.pointTimeArrival = [];
        this.eventLoadMap = [];

        this.polylineRoute = null;

        this.backgroundEvents = {};
        this.isBackground = false;
    }

    checkMapLoad(callback) {
        if (this.isImportMap)
            return callback();

        this.eventLoadMap.push(callback);

    }

    initMap(id, position, callback = undefined) {

        const mapDiv = document.getElementById(id);

        this.map = plugin.google.maps.Map.getMap(mapDiv, {
            'mapType': plugin.google.maps.MapTypeId.NORMAL,
            'controls': {
                'compass': false,
                'myLocationButton': false,
                'indoorPicker': false,
                'zoom': false,
            },
            camera: {
                'tilt': 20,
                'target': position,
                'zoom': 17
            },
            gestures: {
                'scroll': true,
                'tilt': false,
                'rotate': true,
                'zoom': true
            },
            preferences: {
                padding: {
                    left: 20,
                    top: 50,
                    bottom: 130,
                    right: 20
                }
            },
            styles: this.getStyleMapDefault()
        });

        this.map.one(plugin.google.maps.event.MAP_READY, () => {
            this.map.getMyLocation({}, result => {
                this.map.animateCamera({
                    target: result.latLng,
                    zoom: 17,
                    duration: 500
                }, function () {

                });
            }, error => console.log(error));

            /*BackgroundGeolocation.on('background', () => {
                this.isBackground = true;
            });

            BackgroundGeolocation.on('foreground', () => {
                this.isBackground = false;
                Object.keys(this.backgroundEvents).map(key => {
                    this.backgroundEvents[key]();
                });
                this.backgroundEvents = {};
            });*/

            this.map.setMyLocationEnabled(true);

            this.pointCenter = null;

            this.timeoutAddressPoint = null;

            this.map.on(plugin.google.maps.event.MAP_DRAG, () => {
                this.inRoute = false;
                viewController.elementProperty.addClass(".option-gps-route", "active");
            });

            this.map.on(plugin.google.maps.event.CAMERA_MOVE, () => {
                if (this.pointCenter != null) {
                    this.pointCenter.setPosition(this.map.getCameraTarget());

                    this.verifyAddressByCenter();
                }
            });

            this.isImportMap = true;

            this.eventLoadMap.map(callback => {
                callback();
            });

            this.eventLoadMap = [];

            callback();
        });
    }

    runEventForeground(key, callback) {
        if (this.isBackground)
            return this.backgroundEvents[key] = callback;

        callback();
    }

    verifyAddressByCenter() {
        viewController.elementProperty.getElement("#namePointUser", element => {
            element.innerHTML = "";
            element.setAttribute("value", JSON.stringify(null));
        });

        clearTimeout(this.timeoutAddressPoint);

        this.timeoutAddressPoint = setTimeout(() => {

            const {lat, lng} = this.map.getCameraTarget();

            ConnectionServer.sendRequest(`geocoding/search?latlng=${lat},${lng}`, 'GET', null, ({status, data}) => {

                viewController.elementProperty.getElement("#namePointUser", element => {
                    if (!status)
                        return element.innerHTML = "Informações não encontrada";

                    data.latitude = lat;
                    data.longitude = lng;

                    element.setAttribute("value", JSON.stringify(data));
                    element.innerHTML = data.address;
                });
            })
        }, 500);
    }

    addPointClient(position) {

        if (this.locationClient !== null) {
            this.locationClient.remove();

            this.map.animateCamera({
                target: position,
                duration: 500
            });
        }

        this.locationClient = this.makeMarker(position, this.map)

    }

    addPointClientWait(position) {
        this.runEventForeground("add_point_client_wait", () => {
            if (this.locationClientTrip !== null)
                return this.locationClientTrip.setPosition(position);


            this.locationClientTrip = this.makeMarker(position, this.map, {}, 2)
        });
    }

    createCar({lat, lng}, map, icon = null) {
        if (icon == null)
            icon = device.platform !== "iOS" ? "webfiles/img/icon/car.png" : ConfigGeneral().get("map_vehicle_icon_link");

        return this.makeMarker({lat, lng}, map, {
            url: icon,
            size: {width: 35, height: 50}
        });
    }

    updateRouteInMap(positionWait, positionDriver, polyline, icon = null) {
        if (this.isBackground)
            return;

        const pointPolyline = plugin.google.maps.geometry.encoding.decodePath(polyline);

        if (this.polylineRoute == null) {
            this.polylineRoute = this.map.addPolyline({
                'points': pointPolyline,
                'color': '#000000',
                'width': 5,
                'geodesic': true,
                'clickable': false
            });
        } else {
            this.polylineRoute.setPoints(pointPolyline);
        }

        if (this.inRoute)
            this.zoomBetweenPoints();

        if (this.pointDriver === null) {
            this.pointDriver = this.createCar(positionDriver, this.map, icon);
            this.pointDriver.setIconAnchor(12, 20);
            this.currentPosition = positionDriver;
            this.lastPosition = positionDriver;
            return;
        }

        if (this.getDistanceFromLatLonInMeters(this.currentPosition, positionDriver) < 5)
            return;

        this.futurePosition = positionDriver;

        this.transition();
    }

    transition() {
        clearTimeout(this.timeOut);

        this.index = 0;
        this.deltaLat = (this.futurePosition.lat - this.currentPosition.lat) / this.numDeltas;
        this.deltaLng = (this.futurePosition.lng - this.currentPosition.lng) / this.numDeltas;

        this.moveMarker();
    }

    moveMarker() {

        if (this.pointDriver == null) {
            clearTimeout(this.timeOut);
            this.timeOut = null;
            return;
        }

        this.lastPosition = new plugin.google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng);

        this.currentPosition.lat = this.currentPosition.lat + this.deltaLat;
        this.currentPosition.lng = this.currentPosition.lng + this.deltaLng;

        const last = new plugin.google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng);

        this.iconDriver.rotation = plugin.google.maps.geometry.spherical.computeHeading(this.lastPosition, last);

        this.pointDriver.setPosition(last);

        this.pointDriver.setRotation(this.iconDriver.rotation);

        if (this.index !== this.numDeltas) {
            this.index++;

            this.timeOut = setTimeout(() => {
                this.moveMarker();
            }, this.delay);

            return;
        }

        clearTimeout(this.timeOut);
        this.timeOut = null;
    }


    createWaypointInfoPreAccepted(position) {
        this.waypointFinishedAnotherTripInfo.map(item => {
            if (item != null) {
                item.remove();
                item = null;
            }
        });

        this.createPopupCustom(
            `<div class="map-container-info-trip tooltip-customer">
                <p>Terminando uma viagem nas redondezas</p>
            </div>`, {query: ".map-container-info-trip"}, (url) => {
                let marker = this.makeMarker(position, this.map, {
                    url,
                    size: {width: 150, height: 40}
                }, 1, {anchor: [75, 90]});

                this.waypointFinishedAnotherTripInfo.push(marker);

                document.querySelector(".map-container-info-trip").remove();
            });

        this.waypointFinishedAnotherTrip = this.makeMarker(position, this.map);
        this.waypointFinishedAnotherTrip.setTitle("Terminando uma viagem nas redondezas")
    }

    showTimeArrival(position, time) {
        viewController.elementProperty.getElement(".label-time-arrival",element=> {
            element.innerHTML = time.split(" ")[0] || "-";
        });
        this.locationClientTrip.setPosition(position);
        this.locationClientTrip.setTitle(`${getTextTranslate("home", "estimate-time-text")} ${time}`);
        this.locationClientTrip.showInfoWindow();
    }

    clearTimeArrival() {

        this.pointTimeArrival.map(item => {
            if (item != null) {
                item.remove();
                item = null;
            }
        });

        this.pointTimeArrival = [];
    }

    clearWaypointInfoPreAccepted() {
        if (this.waypointFinishedAnotherTrip != null) {
            this.waypointFinishedAnotherTrip.setMap(null);
            this.waypointFinishedAnotherTrip = null;
        }

        if (this.waypointFinishedAnotherTripInfo != null) {
            this.waypointFinishedAnotherTripInfo.remove();
            this.waypointFinishedAnotherTripInfo = null;
        }

        this.waypointFinishedAnotherTripInfo = null;
    }

    addPointDestination(position) {
        if (this.locationDestination !== null) {
            this.locationDestination.remove();
        }
        this.locationDestination = this.makeMarker(position, this.map)
    }

    makeMarker(position, map, icon = '#000', zIndex = 1, options = {}) {
        if (this.isBackground)
            return null;

        return this.map.addMarker({
            position,
            zIndex,
            icon,
            ...options
        });
    }

    getAddressByLatLng(position) {
        return new Promise((resolve, reject) => {
            function requestInfo() {
                ConnectionServer.sendRequest(`geocoding/search?latlng=${position.lat},${position.lng}`, 'GET', null, result => {
                    Session.set("lastInfoLocalCustomer", result);
                    resolve(result)
                }, reject);
            }

            const lastInfoLocalCustomer = Session.get("lastInfoLocalCustomer");

            if (Array.isArray(lastInfoLocalCustomer)) {
                requestInfo();
            } else if (!lastInfoLocalCustomer.status) {
                requestInfo();
            } else {
                const lastPosition = {
                    lat: lastInfoLocalCustomer.data.latitude,
                    lng: lastInfoLocalCustomer.data.longitude
                };

                if (this.getDistanceFromLatLonInMeters(lastPosition, position) <= 10) {
                    resolve(lastInfoLocalCustomer)
                } else {
                    requestInfo();
                }
            }

        });
    }

    getDetailPlace(address) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`geocoding/search?address=${address}`, 'GET', null, resolve, reject);
        });
    }

    addSearchInInput(input, callback, preCallback, positionCurrent = null) {
        let timeout = null;

        function getAddressWithoutKeywords(address) {
            return address.toUpperCase().replace(/(\bAVENIDA)|(\bAV)|(\bAV.)|(\bRUA)|(\bTV)|(\bTRAVESSA)|(\bTRV])\w+/g, "");
        }

        input.oninput = function () {

            clearTimeout(timeout);

            if (preCallback)
                preCallback();

            const value = getAddressWithoutKeywords(this.value);

            if (value.length <= 3)
                return callback({data: []});

            timeout = setTimeout(() => {
                const {lat, lng} = positionCurrent || Session.get("location");

                PlaceController.searching(this.value, `${lat},${lng}`).then(callback)
            }, 2000);
        };
    }

    addWaypointInMap(waypoints) {
        this.waypoints.map((point) => {
            point = this.removeMakerMap(point);
        });

        this.waypoints = waypoints.map(point => {
            return this.makeMarker(point, this.map)
        });
    }

    showRoute(origin, destination, waypoints = [], polyline) {
        if (this.isBackground)
            return;

        this.addWaypointInMap(waypoints);

        const pointPolyline = this.checkPolylineDrawing(origin, destination, waypoints, polyline);

        Session.set("findPolylineSearch", plugin.google.maps.geometry.encoding.encodePath(pointPolyline));


        if (this.polylineRoute == null) {
            this.polylineRoute = this.map.addPolyline({
                'points': pointPolyline,
                'color': '#000000',
                'width': 2,
                'geodesic': true,
                'clickable': false
            });
        } else {
            this.polylineRoute.setPoints(pointPolyline);
        }

        this.map.animateCamera({
            target: this.polylineRoute.getPoints().getArray(),
            duration: 1000,
            padding: 60,
        });

        this.map.setMyLocationEnabled(false);
    }

    checkPolylineDrawing(origin, destination, waypoints = [], polyline) {
        const cityConfig = Session.get("cityConfig");

        if (!Array.isArray(cityConfig)) {
            if (cityConfig.enableRouteDrawingInTicketScreen == true) {
                return plugin.google.maps.geometry.encoding.decodePath(polyline);
            } else {
                return this.createCurvePolyline(origin, destination, waypoints);
            }
        }

        return plugin.google.maps.geometry.encoding.decodePath(polyline);
    }

    createCurvePolyline(origin, destination, waypoint) {
        if (waypoint.length === 0) {
            return this.makePolylineCurve(origin, destination, 1);
        } else {
            let lastPoint = null;
            let path = [];
            waypoint.map(point => {
                if (lastPoint == null) {
                    path.push(...this.makePolylineCurve(origin, point, 1));
                    lastPoint = point;
                } else {
                    path.push(...this.makePolylineCurve(lastPoint, point, 1));
                    lastPoint = point;
                }
            });

            path.push(...this.makePolylineCurve(lastPoint, destination, 1));

            return path;
        }
    }

    makePolylineCurve(origin, destination, radius) {
        let d = plugin.google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
        let h = plugin.google.maps.geometry.spherical.computeHeading(origin, destination);

        let p = plugin.google.maps.geometry.spherical.computeOffset(origin, d * 0.5, h);

        let x = (1 - radius * radius) * radius * 0.5 / (2 * radius);
        let r = (1 + radius * radius) * d * 0.5 / (2 * radius);

        let c = plugin.google.maps.geometry.spherical.computeOffset(p, x, h + 90.0);

        let h1 = plugin.google.maps.geometry.spherical.computeHeading(c, origin);
        let h2 = plugin.google.maps.geometry.spherical.computeHeading(c, destination);

        let numpoints = 100;
        let step = (h2 - h1) / numpoints;

        let list = [];

        for (let i = 0; i < numpoints; i++) {
            list.push(plugin.google.maps.geometry.spherical.computeOffset(c, r, h1 + i * step));
        }

        return list;
    }

    addLegends(addressOrigin, addressDestination, duration) {
        this.infoOrigin = this.removeMakerMap(this.infoOrigin);
        this.infoDestination = this.removeMakerMap(this.infoDestination);

        return new Promise((resolve1) => {
            Promise.all([
                new Promise(resolve => {
                        this.createPopupCustom(`<div class="popup-custom-origin">
                                <span>${addressOrigin}</span>
                            </div>`, {query: ".popup-custom-origin"},
                            (url) => {
                                if (this.locationClient == null)
                                    return;

                                this.infoOrigin = this.makeMarker(this.locationClient.getPosition(), this.map, {
                                    url,
                                    size: {width: 150, height: 40},
                                    anchor: [75, 90]
                                }, 1);

                                document.querySelector(".popup-custom-origin").remove();
                                resolve();
                            });
                    },
                    new Promise(resolve => {
                        this.createPopupCustom(`<div class="popup-custom-destination">
                                    <span>
                                        <span class="time">${parseInt(duration)}</span>
                                        <span class="minute">min</span>
                                    </span>
                                    <p>${addressDestination}</p>
                                </div>`, {query: ".popup-custom-destination"},
                            (url) => {
                                if (this.locationDestination == null)
                                    return;

                                this.infoDestination = this.makeMarker(this.locationDestination.getPosition(), this.map, {
                                    url,
                                    size: {width: 150, height: 40},
                                    anchor: [75, 90]
                                }, 1);

                                document.querySelector(".popup-custom-destination").remove();
                                resolve();
                            });
                    })
                )]).then(() => {
                setTimeout(() => resolve1(), 500);
            });
        });
    }

    createPopupCustom(html, options, callback) {
        let element = document.createElement("div");
        element.style.position = "absolute";
        element.innerHTML = html;
        document.getElementById("popUpCustom").appendChild(element);

        html2canvas(document.querySelector(options.query)).then(canvas => {
            callback(canvas.toDataURL());
        });
    }

    removeRoute() {
        this.runEventForeground("remove_route_map", () => {
            this.locationClient = this.removeMakerMap(this.locationClient);
            this.locationDestination = this.removeMakerMap(this.locationDestination);
            this.infoOrigin = this.removeMakerMap(this.infoOrigin);
            this.infoDestination = this.removeMakerMap(this.infoDestination);
            this.addWaypointInMap([]);
        });
    }

    removeMakerMap(marker) {
        if (marker !== null) {
            marker.setVisible(false);
            // marker.remove();
            marker = null;
        }

        return null;
    }

    removeDetailMap() {
        this.runEventForeground("remove_detail_map", () => {
            this.locationDestination = this.removeMakerMap(this.locationDestination);
            this.infoOrigin = this.removeMakerMap(this.infoOrigin);
            this.infoDestination = this.removeMakerMap(this.infoDestination);
            this.pointDriver = this.removeMakerMap(this.pointDriver);
            this.polylineRoute = this.removeMakerMap(this.polylineRoute);
            this.locationClient = this.removeMakerMap(this.locationClient);
            this.locationClientTrip = this.removeMakerMap(this.locationClientTrip);
        });
    }

    removeOnlyRoute() {
        this.runEventForeground("remove_only_route", () => {
            this.infoOrigin = this.removeMakerMap(this.infoOrigin);
            this.infoDestination = this.removeMakerMap(this.infoDestination);
        });
    }

    removePointClient() {
        this.runEventForeground("remove_point_client", () => {
            this.locationClient = this.removeMakerMap(this.locationClient);
        });
    }

    removePointDestination() {
        this.runEventForeground("remove_point_destination", () => {
            this.locationDestination = this.removeMakerMap(this.locationDestination);
        });
    }

    zoomBetweenPoints(isDefault = true) {
        if (pages.length > 1 && isDefault)
            return;

        viewController.elementProperty.removeClass(".option-gps-route", "active");

        if (this.polylineRoute) {
            if (this.polylineRoute.getPoints().getArray().length < 3) {
                return this.map.animateCamera({
                    target: this.polylineRoute.getPoints().getArray()[0],
                    duration: 500,
                    zoom: 18
                });
            }

            this.map.animateCamera({
                target: this.polylineRoute.getPoints().getArray(),
                duration: 500
            });
        }
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

    focusInRoute() {
        this.inRoute = true;

        this.zoomBetweenPoints();
    }

    searchDriver(trip) {
        const position = new plugin.google.maps.LatLng(parseFloat(trip.origin.latitude),
            parseFloat(trip.origin.longitude));

        this.map.animateCamera({
            target: position,
            duration: 500
        });
    }

    getStyleMapDefault() {
        return [
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#d6e2e6"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#cfd4d5"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7492a8"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "lightness": 25
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#dde2e3"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#cfd4d5"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#dde2e3"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7492a8"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#dde2e3"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#588ca4"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "saturation": -100
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#a9de83"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#bae6a1"
                    }
                ]
            },
            {
                "featureType": "poi.sports_complex",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#c6e8b3"
                    }
                ]
            },
            {
                "featureType": "poi.sports_complex",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#bae6a1"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#41626b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "saturation": -45
                    },
                    {
                        "lightness": 10
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#c1d1d6"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#a6b5bb"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#9fb6bd"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "saturation": -70
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#b4cbd4"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#588ca4"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#008cb5"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": -5
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#a6cbe3"
                    }
                ]
            }
        ];
    }
}
