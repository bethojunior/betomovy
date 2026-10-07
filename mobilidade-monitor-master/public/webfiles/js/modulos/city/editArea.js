document.addEventListener("DOMContentLoaded", function () {
    let drawingManager = null;
    let mapPolygon = null;

    document.querySelector("#cities").innerHTML += Session.getLocal64("cities").map(item => {
        return `<option value='${btoa(JSON.stringify(item))}'>${item.nome}</option>`;
    }).join("");

    const mapService = new MapService();

    mapService.setLibraries("drawing");

    preload(true);
    mapService.importScriptWithPlaces().then(() => {
        mapService.initMap({lat: 0, lng: 0}, 15, document.querySelector(".map")).then(() => {
            preload(false);

            let polyOptions = {
                strokeWeight: 0,
                fillOpacity: 0.45,
                editable: true
            };

            mapPolygon = new google.maps.Polygon({
                paths: [],
                draggable: false, // turn off if it gets annoying
                editable: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    drawingModes: [
                        google.maps.drawing.OverlayType.POLYGON,
                    ]
                },
                markerOptions: {
                    draggable: true
                },
                polylineOptions: {
                    editable: true
                },
                polygonOptions: polyOptions,
            });

            google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
                drawingManager.setDrawingMode(null);

                drawingManager.setOptions({
                    drawingControl: false
                });

                let path = polygon.getPath();
                let coordinates = [];

                for (let i = 0; i < path.length; i++) {
                    coordinates.push({
                        lat: path.getAt(i).lat(),
                        lng: path.getAt(i).lng()
                    });
                }

                mapPolygon.setPath(coordinates);

                polygon.setMap(null);

            });
            drawingManager.setMap(mapService.map);
            mapPolygon.setMap(mapService.map);
        });
    });


    let estateId = null;
    document.querySelector("#cities").onchange = function () {
        const city = JSON.parse(atob(this.value));
        preload(true);
        CityController.getCityByCityId(city.cityId).then(({status, response}) => {
            estateId = response.estado;
            preload(false);
            if (!status)
            return SwalCustom.messageDialog("", "Ocorreu um erro ao trazer os dados da cidade");
            
            let citiesOfSession = Session.getLocal64("cities");
            let result = citiesOfSession.find((res) => res.cityId === city.cityId);

            document.getElementById("shortName").value = result.shortName;
            const path = getPathByPolygon(response.polygon);
            mapPolygon.setPath(path);
            mapPolygon.setMap(mapService.map);
            mapService.setBoundsInMap(path);
    
            drawingManager.setDrawingMode(null);
            document.querySelector("#updateCityArea").disabled = false;
        })

    };

    function getPathByPolygon(stringPolygon) {
        stringPolygon = stringPolygon.replace("POLYGON((", "").replace("))", "");

        return stringPolygon.split(",").map((locationString) => {
            const location = locationString.split(" ");

            return {lat: parseFloat(location[0]), lng: parseFloat(location[1])};
        });
    }

    function changeShortName(city) {
        const shortName = document.getElementById("shortName").value;
        CityController.updateCityShortName(city.cityId, shortName).then((res) => {
            if (!res.status)
            return;
            location.reload();
        });
    }

    document.querySelector("#updateCityArea").onclick = () => {
        const city = JSON.parse(atob(document.querySelector("#cities").value));
        const shortName = document.getElementById("shortName").value;

        const length = mapPolygon.getPath().getLength();

        if (length === 0)
            return SwalCustom.messageDialog("", "Desenhe a area do mapa");

        let polygon = [];

        for (let i = 0; i < length; i++) {
            let position = mapPolygon.getPath().getAt(i);
            polygon.push({lat: position.lat(), lng: position.lng()});
        } 

        polygon.push(polygon[0]);
        preload(true)
        CityAreaController.updateRoute(city.cityId, polygon, estateId, shortName, city.nome).then(({status, response, message}) => {
            preload(false);
            if (status) {
                SwalCustom.messageDialog("", message, status ? "success" : "info").then((val) => changeShortName(city));
            }
        })
    }
});