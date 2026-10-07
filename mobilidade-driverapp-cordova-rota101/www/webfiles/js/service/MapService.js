class MapService {
    constructor() {

        this.lastPosition = null;

        this.positionDriver = null;

        this.positionDestination = null;

        this.timeoutDynamic = null;

        this.map = null;

        this.setting = Session.get("setting");

        this.setting = {
            zoom: 18,
            route: 20,
            duration: 100,
            meters: 15,
        };

        Session.set("setting", this.setting);


        this.zoom = this.setting.zoom;

        this.origin = null;
        this.originPreAccept = null;
        this.destination = null;
        this.destinationPreAccept = null;

        this.existTrip = false;

        this.route = [];

        this.polyline = null;
        this.polylinePreAccept = null;
        this.markerPreAccept = null;
        this.waypoints = [];
        this.waypointsMarker = [];

        this.isImportScript = false;

        this.delay = 5; //milliseconds
        this.index = 0;

        this.isStartMap = false;

        this.controllerMap = false;
        this.pathPolyline = [];
        this.pathPolylinePreAccept = [];

        this.timeErrorCalcRoute = null;

        this.steps = [];

        this.isFollowCar = true;

        this.areaPolygon = [];
        this.markerPolygon = [];
    }

    getKey() {
        return new Promise((resolve, reject) => {

            const position = Session.get("lastPosition");

            let params = "";

            if (!Array.isArray(position)) {
                params = `?latlng=${position.lat},${position.lng}`;
            }

            ConnectionServer.sendRequest(`Support/GoogleApiKey${params}`, 'GET', null, resolve, reject)
        });
    }

    importScriptWithPlaces() {
        return new Promise((resolve, reject) => {
            if (Array.isArray(Session.get("keyGoogle"))) {
                this.getKey().then(({data}) => {
                    Session.set("keyGoogle", data);
                    Route.importScriptByUrl(`https://maps.googleapis.com/maps/api/js?key=${data}&libraries=places`,
                        "scriptMapLibraries")
                        .then(() => {
                            this.isImportScript = true;
                            resolve();
                        });
                }).catch(reject);
                return;
            }

            Route.importScriptByUrl(`https://maps.googleapis.com/maps/api/js?key=${Session.get("keyGoogle")}&libraries=places`,
                "scriptMapLibraries")
                .then(() => {
                    this.isImportScript = true;
                    resolve();
                });
        });
    }

    setZoom(zoom) {
        this.zoom = zoom;
    }

    initMap(position, callback = undefined, id = 'map') {

        const user = Session.get("user");

        if (ConfigGeneral().get("lite_map_option") == true || user.isDeliveryMan == true) {
            callback();
            return;
        }

        this.map = plugin.google.maps.Map.getMap(document.getElementById(id),
            {
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
                    'zoom': this.zoom
                },
                gestures: {
                    'scroll': true,
                    'tilt': false,
                    'rotate': true,
                    'zoom': true
                },
                styles: this.checkMapMode(),
                preferences: {
                    'zoom': {
                        'minZoom': 14,
                        'maxZoom': 19
                    },
                }
            });

        this.map.setClickable(false);

        this.positionDriver = this.map.addMarker({
            icon: {
                url: 'webfiles/img/icon/compass.png',
                size: {
                    width: 25,
                    height: 25
                },
                //anchor: [25, 10],
            },
            visible: true,
            draggable: false,
            position: position,
            rotation: 0

        });

        this.map.one(plugin.google.maps.event.MAP_READY, callback);

        this.map.on(plugin.google.maps.event.MAP_DRAG, () => {
            viewController.elementProperty.addClass(".center-camera-map-position", "active");
            this.isFollowCar = false;
        });

    }

    setPositionDriver(position) {
        if (this.positionDriver === null)
            return;

        const meters = plugin.google.maps.geometry.spherical.computeDistanceBetween(position, this.positionDriver.getPosition());

        if (meters < this.setting.meters)
            return;

        if (this.existTrip) {
            if (!Array.isArray(Session.get("tripDriver"))) {
                const trip = Session.get("tripDriver");
                if (trip.tripCallTypeId !== TRIP_CALL_TAXIMETER || (trip.tripCallTypeId === TRIP_CALL_TAXIMETER && trip.status !== STATUS_IN_PROGRESS)) {
                    this.verifyRoute(position);
                }
            } else {
                this.verifyRoute(position);
            }

        }

        this.controllerViewMapDefault(position, meters);
    }

    controllerViewMapDefault(position, meters) {

        const rotation =
            (meters > 10) ?
                plugin.google.maps.geometry.spherical.computeHeading(this.positionDriver.getPosition(), position) :
                this.map.getCameraBearing();

        this.positionDriver.setPosition(position);

        if (this.isFollowCar) {
            this.setControllerMap(false);
            this.map.animateCamera({
                target: position,
                bearing: rotation,
                duration: 500
            }, () => {
                this.setControllerMap(true);
            });
        }

        if (this.isFollowCar && rotation !== 0) {
            this.positionDriver.setRotation(0);
        } else {
            this.positionDriver.setRotation((rotation - this.map.getCameraBearing()));
        }
    }

    getRotationInRoute(position) {
        if (this.steps.length > 0) {
            if (this.getDistanceFromLatLonInMeters(this.steps[0].start_location, position) > this.steps[0].distance.value) {
                this.steps.splice(0, 1);
            }

            if (this.steps.length === 0)
                return null;

            return plugin.google.maps.geometry.spherical.computeHeading(this.steps[0].start_location, this.steps[0].end_location);
        }
        return null;
    }

    addWaypoints(waypoints) {
        this.waypointsMarker.map((point) => {
            point.setVisible(false);
            point = null;
        });

        this.waypointsMarker = waypoints.map(point => {
            return this.makeMarker({lat: parseFloat(point.lat), lng: parseFloat(point.lng)},
                {
                    url: "webfiles/img/svg/waypoint.svg",
                    size: {
                        width: 30,
                        height: 30
                    }
                });
        });
    }

    setOrigin(position) {
        this.origin = position;
    }

    setDestination(position) {
        this.destination = position;

        if (this.map != null) {
            if (this.positionDestination == null) {
                this.positionDestination = this.map.addMarker({
                    icon: {
                        url: document.body.classList.contains("night-mode") ?
                            "webfiles/img/icon/destination-dark.png" :
                            "webfiles/img/icon/destination.png",
                        size: {
                            width: 30,
                            height: 30
                        }
                    },
                    anchor: [10, 25],
                    visible: true,
                    draggable: false,
                    position: this.destination,
                    rotation: 0

                });
            } else {
                this.positionDestination.setPosition(this.destination);
            }
        }
    }

    setWaypoints(waypoints) {
        this.waypoints = waypoints.map((position) => {
            return {lat: parseFloat(position.lat), lng: parseFloat(position.lng)};
        });
    }

    calculateAndDisplayRoute() {
        clearTimeout(this.timeErrorCalcRoute);

        if (Array.isArray(Session.getValueInSession("tripDriver", "tripReference")))
            return;

        const nowRequest = new Date();

        if (!Array.isArray(Session.get("lastRequestRoute"))) {
            const lastRequestRoute = new Date(Session.get("lastRequestRoute"));
            const time = (nowRequest - lastRequestRoute) / 1000;
            if (time < 30) {
                if (time >= 15) {
                    this.pathPolyline = plugin.google.maps.geometry.encoding.decodePath(Session.get("tripOverViewPolyline"));
                    this.sendPolyline();
                }
                return;
            }
        }

        Session.set("lastRequestRoute", nowRequest);


        if (this.waypoints.length > 0) {
            this.destination = this.waypoints[0];
        }

        PreloadRequest.progress(getTextTranslate("trip", "calculating-route"));

        DirectionController.searchNative(
            `${this.origin.lat},${this.origin.lng}`,
            `${this.destination.lat},${this.destination.lng}`)
            .then(({status, data}) => {

                Session.set("routeCache", {
                    idCache: mapService.destination.lat + mapService.destination.lng,
                    ...data
                });

                if (Array.isArray(Session.getValueInSession("tripDriver", "tripReference")))
                    return;

                if (!status) {
                    this.timeErrorCalcRoute = setTimeout(() => {
                        this.calculateAndDisplayRoute()
                    }, 3000);
                    return;
                }

                PreloadRequest.clear();

                const {lat, lng} = mapService.positionDriver != null ?
                    this.positionDriver.getPosition() : Session.get("lastPosition");

                Session.set("timePolyline", `${parseInt(data.duration / 60)} min`);

                DirectionController.updateRoute(
                    {
                        tripReference: Session.getValueInSession("tripDriver", "tripReference"),
                        polyline: data.overview_polyline.points,
                        time: Session.get("timePolyline"),
                        idDriver: Session.getValueInSession("user", "idDriver"),
                        position: {lat, lng},
                        kmProgressing: getKmRouteTraveled(),
                        minuteProgressing: getMinutesRouteTraveled()
                    }).then(data => {
                });

                this.pathPolyline = plugin.google.maps.geometry.encoding.decodePath(data.overview_polyline.points);

                if (this.polyline == null) {
                    if (this.map != null && this.pathPolyline.length > 0) {
                        Session.set("tripOverViewPolyline", data.overview_polyline.points);
                        this.polyline = this.map.addPolyline({
                            'points': this.pathPolyline,
                            'color': document.body.classList.contains("night-mode") ? '#498df3' : '#000',
                            'width': 10,
                            'geodesic': false,
                            'clickable': false
                        });
                    }
                } else {
                    this.polyline.setPoints(this.pathPolyline);
                }

                this.sendPolyline();

                this.existTrip = true;
            }).catch((e) => {
            this.timeErrorCalcRoute = setTimeout(() => {
                this.calculateAndDisplayRoute()
            }, 3000);
        })
    }
    
    addPolyline(origin, destination, tripPreAvailable) {
        DirectionController.searchNative(
            `${origin.lat},${origin.lng}`,
            `${destination.lat},${destination.lng}`).then((data) => {
                console.log(data.data)
                this.pathPolylinePreAccept = plugin.google.maps.geometry.encoding.decodePath(data.data.overview_polyline.points);
                // this.polyline = this.map.addPolyline({
                //     'points': this.pathPolyline,
                //     'color': document.body.classList.contains("night-mode") ? '#498df3' : '#000',
                //     'width': 10,
                //     'geodesic': false,
                //     'clickable': false
                // })
                this.polylinePreAccept = this.map.addPolyline({
                    'points': this.pathPolylinePreAccept,
                    'color': document.body.classList.contains("night-mode") ? '#498df3' : 'red',
                    'width': 10,
                    'geodesic': false,
                    'clickable': false
                });


                // marker
                this.markerPreAccept = this.map.addMarker({
                    icon: {
                        url:
                            "webfiles/img/icon/destination-dark.png",
                        size: {
                            width: 30,
                            height: 30
                        }
                    },
                    anchor: [10, 25],
                    visible: true,
                    draggable: false,
                    position: destination,
                    rotation: 0
                });

                return DirectionController.updateRoute(
                    {
                        tripReference: tripPreAvailable.tripReference,
                        polyline: plugin.google.maps.geometry.encoding.encodePath(this.pathPolylinePreAccept),
                        time: Session.get("timePolylineWayPoint"),
                        idDriver: Session.getValueInSession("user", "idDriver"),
                        position: positionDriver,
                        waypoint: [],
                        kmProgressing: 0,
                        minuteProgressing: 0
                    }).then(data => {
                });
            })     
    }


    makeMarker(position, icon = null) {
        return this.map.addMarker({
            icon,
            anchor: [10, 25],
            visible: true,
            draggable: false,
            position: position,
            rotation: 0

        });
    }
    
    removeRoute() {
        if (this.markerPreAccept) {
            this.markerPreAccept.remove()
        }
        if (this.polyline != null)
            this.polyline.setVisible(false);
        if (this.positionDestination != null)
            this.positionDestination.setVisible(false);
        if (this.polylinePreAccept != null)
            this.polylinePreAccept.remove();
        this.polyline = null;
        this.markerPreAccept = null
        this.polylinePreAccept = null;
        this.positionDestination = null;
        this.pathPolylinePreAccept = [];
        this.pathPolyline = [];
        this.route = [];
        this.existTrip = false;
        this.steps = [];
        Session.delete("lastRequestRoute");
        Session.delete("tripOverViewPolyline");
    }


    verifyRoute(position) {
        if (this.destination == null)
            return;
        if (ConfigGeneral().get("load_route_automatically") == false) {
            this.updateRouteInCache(position);
        } else {
            if (this.pathPolyline.length === 0) {
                this.setOrigin(position);
                this.calculateAndDisplayRoute();
            } else {
                const newPath = this.calculatePolylineInRoute(position, 70);
                if (newPath.length === 0) {
                    this.setOrigin(position);
                    this.calculateAndDisplayRoute();
                } else {
                    if (this.polyline != null) {
                        this.polyline.setPoints(newPath);
                        this.sendPolyline();
                    }
                }
            }
        }

        if (!Array.isArray(Session.get("preAvailableTrip")))
            this.updateRouteTripPreAccept(position, Session.get("preAvailableTrip"));
    }

    updateRouteInCache(position) {
        const idCache = this.destination.lat + this.destination.lng;

        this.setOrigin(position);

        const routeCache = Session.get("routeCache");

        if (Array.isArray(routeCache)) {
            this.calculateAndDisplayRoute();
        } else {
            if (routeCache.idCache === idCache) {
                this.pathPolyline = plugin.google.maps.geometry.encoding.decodePath(routeCache.overview_polyline.points);

                if (this.polyline == null) {
                    if (this.map != null && this.pathPolyline.length > 0) {
                        Session.set("tripOverViewPolyline", routeCache.overview_polyline.points);
                        this.polyline = this.map.addPolyline({
                            'points': this.pathPolyline,
                            'color': document.body.classList.contains("night-mode") ? '#498df3' : '#000',
                            'width': 10,
                            'geodesic': false,
                            'clickable': false
                        });
                    }
                } else {
                    this.polyline.setPoints(this.pathPolyline);
                }

                this.sendPolyline();

                this.existTrip = true;

            } else {
                this.calculateAndDisplayRoute();
            }
        }

    }

    updateRouteTripPreAccept(positionDriver, preAvailableTrip) {
        this.pathPolylinePreAccept = this.getNewPolylineInRoute(this.pathPolylinePreAccept, positionDriver, 70);

        if (this.pathPolylinePreAccept.length !== 0) {
            DirectionController.updateRoute(
                {
                    tripReference: preAvailableTrip.tripReference,
                    polyline: plugin.google.maps.geometry.encoding.encodePath(this.pathPolylinePreAccept),
                    time: Session.get("timePolylineWayPoint"),
                    idDriver: Session.getValueInSession("user", "idDriver"),
                    position: positionDriver,
                    waypoint: {lat: this.destination.lat, lng: this.destination.lng},
                    kmProgressing: 0,
                    minuteProgressing: 0
                }).then(data => {
            });

            return;
        }

        const nowRequest = new Date();

        if (!Array.isArray(Session.get("lastRequestRoute"))) {
            const lastRequestRoute = new Date(Session.get("lastRequestRoutePre"));
            const time = (nowRequest - lastRequestRoute) / 1000;
            if (time < 30) {
                if (Session.get("tripOverViewPolylinePre").length > 0 && time >= 15) {
                    this.pathPolyline = plugin.google.maps.geometry.encoding.decodePath(Session.get("tripOverViewPolylinePre"));
                    this.sendPolyline();
                }

                return;
            }
        }

        Session.set("lastRequestRoutePre", nowRequest);

        if(this.destination== null)
            return;

        DirectionController.searchNative(
            `${positionDriver.lat},${positionDriver.lng}`,
            `${preAvailableTrip.origin.latitude},${preAvailableTrip.origin.longitude}`,
            `${this.destination.lat},${this.destination.lng}`)
            .then(({status, data}) => {

                if (!status)
                    return;

                const {lat, lng} = this.positionDriver.getPosition();

                Session.set("timePolylineWayPoint", `${parseInt(data.duration / 60)} min`);

                DirectionController.updateRoute(
                    {
                        tripReference: preAvailableTrip.tripReference,
                        polyline: data.overview_polyline.points,
                        time: Session.get("timePolylineWayPoint"),
                        idDriver: Session.getValueInSession("user", "idDriver"),
                        position: {lat, lng},
                        waypoint: {lat: this.destination.lat, lng: this.destination.lng},
                        kmProgressing: getKmRouteTraveled(),
                        minuteProgressing: getMinutesRouteTraveled()
                    }).then(data => {
                });


                Session.set("tripOverViewPolylinePre", data.overview_polyline.points);

                this.pathPolylinePreAccept = plugin.google.maps.geometry.encoding.decodePath(data.overview_polyline.points);

                this.existTrip = true;
            }).catch((e) => {
            this.timeErrorCalcRoute = setTimeout(() => {
                this.updateRouteTripPreAccept(positionDriver, preAvailableTrip);
            }, 3000);
        })
    }

    sendPolyline() {
        const {lat, lng} = Session.get("lastPosition");

        if (Array.isArray(Session.get("tripDriver")))
            return;

        if (this.pathPolyline.length === 0)
            return;

        DirectionController.updateRoute(
            {
                tripReference: Session.getValueInSession("tripDriver", "tripReference"),
                polyline: plugin.google.maps.geometry.encoding.encodePath(this.pathPolyline),
                time: Session.get("timePolyline"),
                idDriver: Session.getValueInSession("user", "idDriver"),
                position: {lat, lng},
                kmProgressing: getKmRouteTraveled(),
                minuteProgressing: getMinutesRouteTraveled()
            }).then(data => {
        });
    }

    getDistanceFromLatLonInMeters(firstPosition, lastPosition) {
        if (firstPosition === null)
            return false;

        if (lastPosition === null)
            return false;


        let deg2rad = function (deg) {
                return deg * (Math.PI / 180);
            },
            R = 6371,
            dLat = deg2rad(lastPosition.lat - firstPosition.lat),
            dLng = deg2rad(lastPosition.lng - firstPosition.lng),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(deg2rad(firstPosition.lat))
                * Math.cos(deg2rad(firstPosition.lat))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseInt((R * c * 1000).toFixed());
    }


    setControllerMap(controller) {
        this.controllerMap = controller;
        this.map.setClickable(controller);
    }

    zoomBetweenPoints() {
        const bounds = new google.maps.LatLngBounds();

        bounds.extend(this.positionDriver.getPosition());

        bounds.extend(this.positionDestination.getPosition());

        this.zoomPoints = true;

        this.map.fitBounds(bounds);

        const childrenMap = document.getElementById("map").children[0];

        childrenMap.style.transform = `rotate(0deg)`;
    }

    zoomInDriver() {
        this.map.setCenter(this.positionDriver.getPosition());
        this.map.setZoom(this.setting.zoom);
        this.zoomPoints = false;
    }

    addSearchInInput(input, callback) {
        const searchBox = new google.maps.places.Autocomplete(input);
        searchBox.bindTo('bounds', this.map);
        searchBox.setFields(
            ['address_components', 'geometry', 'icon', 'name']);

        searchBox.addListener('place_changed', function () {
            const place = searchBox.getPlace();

            if (!place.address_components) {
                if (!input.classList.contains("error"))
                    input.classList.add("error");

                viewController.elementProperty.getElement(".pac-container", element => {
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

    calculatePolylineInRoute(position, meters) {
        let isRoute = false;

        return this.pathPolyline.filter((location) => {
            if ((plugin.google.maps.geometry.spherical.computeDistanceBetween(location, position) <= meters) || isRoute) {
                isRoute = true;
                return true;
            }

            return false;
        });

    }


    getNewPolylineInRoute(pathPolyline, position, meters) {
        let isRoute = false;

        return pathPolyline.filter((location) => {
            if ((plugin.google.maps.geometry.spherical.computeDistanceBetween(location, position) <= meters) || isRoute) {
                isRoute = true;
                return true;
            }

            return false;
        });

    }

    checkMapMode() {
        if (!document.body.classList.contains("night-mode")) {
            return MapStyle.lightMode();
        };

        return MapStyle.darkMode();
    }

    updateDynamicByArea(position) {
        function getFillColor(multiplierValue){
            let index = Math.round((multiplierValue - 1) * 10);

            index = index >= 10 ? 9 : index;
            index = index < 0 ? 0 : index;


            const colors = [
                "rgba(213, 222, 129,0.4)",
                "rgba(213, 222, 129,0.5)",
                "rgba(254, 232, 132,0.4)",
                "rgba(254, 232, 132,0.5)",
                "rgba(251, 194, 124,0.4)",
                "rgba(251, 194, 124,0.5)",
                "rgba(248, 141, 114,0.4)",
                "rgba(248, 141, 114, 0.5)",
                "rgba(246, 105, 107, 0.4)",
                "rgba(246, 105, 107,0.5)",
            ];

            return colors[index];
        }
    
        DynamicAreaController.findAll(position.lat, position.lng).then(({ data }) => {
            this.areaPolygon.forEach(item => {
                item.setVisible(false);
            });
            this.markerPolygon.forEach(item => {
                item.setVisible(false);
            });
    
            let minEndTime = Number.MAX_SAFE_INTEGER;
            this.areaPolygon = data.map(item => {
                const color = getFillColor(parseFloat(item.multiplierValue));
                const position = this.getLatLonCenterFromGeom(item.area);
                const id = parseInt(Math.random() * 9999999);
                this.createPopupCustom(`<h4 class="tag-dynamic-area-${id}" 
                    style="background-color: ${color}; font-weight: bold">x${Mask.maskMoney(parseFloat(item.multiplierValue))}</h4>`,
                    { query: ".tag-dynamic-area-" + id }, (url) => {
                        this.markerPolygon.push(this.makeMarker(position, {
                            url,
                            size: { width: 45, height: 30 },
                            anchor: [12, 50]
                        }, 1));
                        document.querySelector(".tag-dynamic-area-" + id).remove();
                    })
                    if (item.endTime) {
                        const now = new Date();
                        const endTimeToday = new Date(now.toISOString().split('T')[0] + 'T' + item.endTime);
                        if (endTimeToday > now && endTimeToday.getTime() < minEndTime) {
                            minEndTime = endTimeToday.getTime();
                        }
                    }
                    
                return this.map.addPolygon({
                    'points': item.area,
                    'strokeColor': color,
                    'strokeWidth': 1,
                    'fillColor': color
                });
            });
    
            if (minEndTime < Number.MAX_SAFE_INTEGER) {
                const delay = Math.max(0, new Date(minEndTime).getTime() + 60 * 1000 - Date.now());
                if (this.timeoutDynamic != null) {
                    clearTimeout(this.timeoutDynamic);
                }
                this.timeoutDynamic = setTimeout(() => this.updateDynamicByArea(position), delay);
            }
        }).catch(error => {
            console.error("Error updating dynamic areas: ", error);
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

    getLatLonCenterFromGeom = (coords) => {
        const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

        const centerLat = arrAvg(coords.map(c=>c.lat));
        const centerLon = arrAvg(coords.map(c=>c.lng));

        if (isNaN(centerLat)|| isNaN(centerLon))
            return null;
        else return {lat: centerLat, lng:centerLon};
    }

}
