document.addEventListener("DOMContentLoaded", function () {
    const mapService = new MapService();
    mapService.setLibraries("visualization");
    let pointArray = [];


    mapService.importScriptWithPlaces().then(() => {
        mapService.initMap({lat: 0, lng: 0}, 16, document.querySelector("#map"))
            .then(() => {

                pointArray = new google.maps.MVCArray([]);
                mapService.setBoundsInMap(Session.getLocal("pointsCity"));

                var lineSymbol = {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 0.5,
                    scale: 2.5
                };

                const polyline = new google.maps.Polyline({
                    path: Session.getLocal("pointsCity"),
                    geodesic: true,
                    icons: [{
                        icon: lineSymbol,
                        offset: '0',
                        repeat: '20px'
                    }],
                    // strokeColor: '#000000',
                    strokeOpacity: 0,
                    //strokeWeight: 2
                });

                polyline.setMap(mapService.map);
                const heatmap = new google.maps.visualization.HeatmapLayer({
                    data: pointArray,
                    map: mapService.map,
                });

                function changeGradient() {
                    const gradient = [
                        "rgba(0, 255, 255, 0)",
                        "rgba(0, 255, 255, 1)",
                        "rgba(0, 191, 255, 1)",
                        "rgba(0, 127, 255, 1)",
                        "rgba(0, 63, 255, 1)",
                        "rgba(0, 0, 255, 1)",
                        "rgba(0, 0, 223, 1)",
                        "rgba(0, 0, 191, 1)",
                        "rgba(0, 0, 159, 1)",
                        "rgba(0, 0, 127, 1)",
                        "rgba(63, 0, 91, 1)",
                        "rgba(127, 0, 63, 1)",
                        "rgba(191, 0, 31, 1)",
                        "rgba(255, 0, 0, 1)",
                    ];
                    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
                    heatmap.set("radius", 20);
                }

                changeGradient();

                updateMap();
            });
    });

    function updateMap(){
        preload(true);
        pointArray.clear();
        getLocations().then((result) => {
            preload(false);
            result.map(item=>{
                pointArray.push(item);
            })
        });
    }

    elementProperty.addEventInElement("#typeHeatMap", "onchange", updateMap);

    function getCustomers() {
        return new Promise((resolve, reject) => {
            const cityId = Session.getLocal("citySelected").cityId;
            ConnectionServer.sendRequest(`customer/${cityId}/locations`, "GET", null, (result) => {
                let newResult = result.response.map(item => {
                    return new google.maps.LatLng(parseFloat(item.last_lat), parseFloat(item.last_lon));
                });

                resolve(newResult);
            }, reject, true);
        })
    }

    function lastDynamicsPlaces() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dashboard/lastDynamicsPlaces?limit=30`, "GET", null, ({response}) => {
                resolve(response.map(item => {
                    return new google.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                }))
            }, reject, true);
        });
    }

    function expensiveDynamicsPlaces() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dashboard/expensiveDynamicsPlaces?limit=30`, "GET", null, ({response}) => {
                resolve(response.map(item => {
                    return new google.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                }))
            }, reject, true);
        });
    }

    function placesMoreTripsDayAgo() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dashboard/placesMoreTripsDayAgo?limit=30`, "GET", null, ({response}) => {
                resolve(response.map(item => {
                    return new google.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                }))
            }, reject, true);
        });
    }

    function placesMoreTripsWeekAgo() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`dashboard/placesMoreTripsWeekAgo?limit=30`, "GET", null, ({response}) => {
                resolve(response.map(item => {
                    return new google.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                }))
            }, reject, true);
        });
    }


    function getLocations() {
        switch (document.querySelector("#typeHeatMap").value) {
            case "customer":
                return getCustomers();
            case "lastDynamicsPlaces":
                return lastDynamicsPlaces();
            case "expensiveDynamicsPlaces":
                return expensiveDynamicsPlaces();
            case "placesMoreTripsDayAgo":
                return placesMoreTripsDayAgo();
            case "placesMoreTripsWeekAgo":
                return placesMoreTripsWeekAgo();
        }
    }
});