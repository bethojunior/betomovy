viewController.setObserver("heat-map", () => {
    let circles = [];

    const map = plugin.google.maps.Map.getMap(document.getElementById('heatMap'),
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
                'target': Session.get("lastPosition"),
                'zoom': 17
            },
            gestures: {
                'scroll': true,
                'tilt': false,
                'rotate': true,
                'zoom': true
            },
            styles: [
                {
                    "featureType": "poi",
                    "stylers": [
                        {"visibility": "off"}
                    ]
                }
            ],
        });

    viewController.elementProperty.addEventInElement(".button-option-heat-map", "onclick", function () {
        Route.startClassesInComponent([
            {
                component: ".container-option-type-dynamic",
                class: "active"
            }
        ], () => {
            viewController.elementProperty.removeClass(".container-option-type-dynamic", "active");
        })
    });

    viewController.elementProperty.addEventInElement("#backPageHeatMap", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement("#buttonCloseOptionDynamic", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement(".item-option-heat-map-selected", "onclick", function () {
        viewController.elementProperty.removeClass(".item-option-heat-map-selected","active");
        this.classList.add("active");
        Route.backPage();
        document.querySelector(".preload-heat-map").classList.add("active");
        getDynamicByType(this.getAttribute("value")).then(({data}) => {
            getDynamicSelected(data);
        })
    });

    function getDynamicByType(value) {
        switch (value) {
            case "lastDynamicPlaces":
                return DynamicController.lastDynamicPlaces(Session.get("lastPosition"));
            case "expensiveDynamicsPlaces":
                return DynamicController.expensiveDynamicsPlaces(Session.get("lastPosition"));
            case "placesMoreTripsDayAgo":
                return DynamicController.placesMoreTripsDayAgo(Session.get("lastPosition"));
            case "placesMoreTripsWeekAgo":
                return DynamicController.placesMoreTripsWeekAgo(Session.get("lastPosition"));
        }
    }

    map.setMyLocationEnabled(true);


    function getDynamicSelected(data) {
        document.querySelector(".preload-heat-map").classList.remove("active");

        clearMap();

        data.map(circle => {
            circles.push(map.addCircle({
                'center': {lat: parseFloat(circle.latitude), lng: parseFloat(circle.longitude)},
                'radius': 150,
                'strokeColor': '#444444',
                'strokeWidth': 0,
                'fillColor': 'rgba(220,251,51,0.25)'
            }));
            circles.push(map.addCircle({
                'center': {lat: parseFloat(circle.latitude), lng: parseFloat(circle.longitude)},
                'radius': 100,
                'strokeColor': '#444444',
                'strokeWidth': 0,
                'fillColor': 'rgba(251,195,36,0.25)'
            }));
            circles.push(map.addCircle({
                'center': {lat: parseFloat(circle.latitude), lng: parseFloat(circle.longitude)},
                'radius': 50,
                'strokeColor': '#444444',
                'strokeWidth': 0,
                'fillColor': 'rgba(251,108,52,0.25)'
            }));
        })
    }

    DynamicController.lastDynamicPlaces(Session.get("lastPosition")).then(({data}) => {
        viewController.elementProperty.removeClass(".item-option-heat-map-selected","active");
        document.querySelector(".item-option-heat-map-selected[value='lastDynamicPlaces']").classList.add("active");
        getDynamicSelected(data);
    });

    function clearMap() {
        circles.map(circle => {
            circle.setVisible(false);
        });

        circles = [];
    }
});
