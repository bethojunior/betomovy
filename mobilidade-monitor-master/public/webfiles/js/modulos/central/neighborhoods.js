document.addEventListener("DOMContentLoaded", function () {
    const city = Session.getLocal("citySelected");
    let circleMap = null;
    Mask.setMoneyField(".input-mask-money");
    updateListZone();
    const mapService = new MapService();
    const mapServiceEdit = new MapService();

    mapService.setLibraries("drawing");
    mapService.importScriptWithPlaces().then(() => {
        mapService.initMap({ lat: 0, lng: 0 }, 15, document.getElementById('map'));
  
        let polyOptions = {
           strokeWeight: 0,
           fillOpacity: 0.45,
           editable: true,
        };
  
        drawingManager = new google.maps.drawing.DrawingManager({
           drawingMode: google.maps.drawing.OverlayType.POLYGON,
           drawingControl: true,
           drawingControlOptions: {
              drawingModes: [google.maps.drawing.OverlayType.POLYGON],
           },
           markerOptions: {
              draggable: true,
           },
           polylineOptions: {
              editable: true,
           },
           polygonOptions: polyOptions,
        });
        drawingManager.setMap(mapService.map);
        google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
           drawingManager.setDrawingMode(null);
  
           drawingManager.setOptions({
              drawingControl: false,
           });
  
           let path = polygon.getPath();
           let coordinates = [];
  
           for (let i = 0; i < path.length; i++) {
              coordinates.push({
                 lat: path.getAt(i).lat(),
                 lng: path.getAt(i).lng(),
              });
           }
           circleMap.setPath(coordinates);
  
           polygon.setMap(null);
        });
     });

    mapService.importScriptWithPlaces().then(() => {
        mapService.initMap({lat: 0, lng: 0}, 15, document.getElementById('map'))
        mapServiceEdit.initMap({lat: 0, lng: 0}, 15, document.getElementById('mapEdit'))
    })


    elementProperty.addEventInElement("#btnSearchLocal", "onclick", function () {
        const host = `https://nominatim.openstreetmap.org/search.php?q=${document.querySelector("#nameZone").value} ${Session.getLocal("citySelected").nome}&polygon_geojson=1&format=jsonv2`;
        const stringPolygon = Session.getLocal("citySelected").polygon;
        const arrayPolygon = stringPolygon.split(',');
        const firstPosition = arrayPolygon[1].split(' ');
        const secondPosition = arrayPolygon[2].split(' ');
        const finalPosition = [{lat: parseFloat(firstPosition[0]), lng: parseFloat(firstPosition[1])}, {lat: parseFloat(secondPosition[0]), lng: parseFloat(secondPosition[1])}];

        preload(true);
        fetch(host).then(result => result.json()).then((result) => {
            const polygons = result.filter(item => {
                return item.geojson.type === "Polygon";
            });

            preload(false);
            
            document.querySelector("#contentMap").hidden = false;

            document.querySelector("#listGroupAddress").innerHTML = polygons.map(item => {
                return `<li class="list-group-item item-address" style="cursor: pointer" value='${btoa(JSON.stringify(item))}'><small>${item.display_name.substring(0, 50)}</small></li>`
            }).join("");

            if(polygons.length === 0 || polygons[0].geojson.type != 'Polygon'){
                if (circleMap == null) {
                    circleMap = new google.maps.Polygon({
                        paths: finalPosition,
                        draggable: false, // turn off if it gets annoying
                        editable: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35
                    });

                } else {
                    circleMap.setPath(finalPosition);
                }
                circleMap.setMap(mapService.map);

                mapService.setBoundsArray(finalPosition)
            } else {
            elementProperty.addEventInElement(".item-address", "onclick", function () {
                elementProperty.removeClass(".item-address", "active");
                this.classList.add("active");
                const item = JSON.parse(atob(this.getAttribute("value")));
                
                const bounds = item.geojson.coordinates[0].map(position => {
                    return {lat: position[1], lng: position[0]}
                });
                
                if (circleMap == null) {
                    circleMap = new google.maps.Polygon({
                        paths: bounds,
                        draggable: false, // turn off if it gets annoying
                        editable: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35
                    });

                } else {
                    circleMap.setPath(bounds);
                }
                circleMap.setMap(mapService.map);

                mapService.setBoundsArray(bounds)
            });
        }
        })
    });

    elementProperty.addEventInElement("#btnSearchLocalEdit", "onclick", function () {
        const host = `https://nominatim.openstreetmap.org/search.php?q=${document.querySelector("#nameZoneEdit").value} ${Session.getLocal("citySelected").nome}&polygon_geojson=1&format=jsonv2`;

        preload(true);
        fetch(host).then(result => result.json()).then((result) => {
            preload(false);
            document.querySelector("#contentMapEdit").hidden = false;

            const polygons = result.filter(item => {
                return item.geojson.type === "Polygon";
            });

            if (polygons.length === 0){
                return SwalCustom.messageDialog("Informe mais detalhadamente o nome do bairro", "Nenhum bairro foi encontrado");
            }

            document.querySelector("#listGroupAddressEdit").innerHTML = polygons.map(item => {
                return `<li class="list-group-item item-address-edit" style="cursor: pointer" value='${btoa(JSON.stringify(item))}'><small>${item.display_name.substring(0, 50)}</small></li>`
            }).join("");

            elementProperty.addEventInElement(".item-address-edit", "onclick", function () {
                elementProperty.removeClass(".item-address-edit", "active");
                this.classList.add("active");
                const item = JSON.parse(atob(this.getAttribute("value")));

                const bounds = item.geojson.coordinates[0].map(position => {
                    return {lat: position[1], lng: position[0]}
                });

                if (circleMap == null) {
                    circleMap = new google.maps.Polygon({
                        paths: bounds,
                        draggable: false, // turn off if it gets annoying
                        editable: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35
                    });
                } else {
                    circleMap.setPath(bounds);
                }
                circleMap.setMap(mapServiceEdit.map);

                mapServiceEdit.setBoundsArray(bounds)
            });
        })
    });

    function updateListZone() {
        document.querySelector("#listGroupAddress").innerHTML = "";
        document.querySelector("#listGroupAddressEdit").innerHTML = "";
        preload(true);
        CentralNeigthborhoodsController.list().then(({response, status}) => {    
            document.querySelector("#listZone").innerHTML = response.map(zone => {
                return `<tr>
                        <td>${zone.name}</td>
                        <td></td>
                        <td><a href="#" value="${zone.id}" class="remove-zone">Excluir</a></td>
                    </tr>`
            }).join("");

            elementProperty.addEventInElement(".edit-zone", "onclick", function () {
                const zone = JSON.parse(this.getAttribute("value"));
                document.querySelector("#nameZoneEdit").value = zone.name;
                if (circleMap == null) {
                    circleMap = new google.maps.Polygon({
                        paths: zone.area,
                        draggable: false, // turn off if it gets annoying
                        editable: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35
                    });
                } else {
                    circleMap.setPath(zone.area);
                }
                circleMap.setMap(mapServiceEdit.map);
                setTimeout(() => {
                    mapServiceEdit.setBoundsArray(zone.area)
                }, 1000)                
               
            });

            elementProperty.addEventInElement(".remove-zone", "onclick", function () {
                SwalCustom.dialogConfirm("Deseja remover essa zona?", "", status => {
                    if (!status)
                        return;

                    preload(true);
                    CentralNeigthborhoodsController.delete(this.getAttribute("value")).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info");

                        if (status) {
                            $("#addNeighborhoodZone").modal("hide");
                            updateListZone();
                        }
                    }).finally(() => {
                        preload(false)
                    })
                });
            });
        }).finally(() => {
            preload(false);
        });
    }

    function getAreaPolygon() {
        if (!circleMap)
            return [];

        let len = circleMap.getPath().getLength();

        let polygon = [];

        for (let i = 0; i < len; i++) {
            const position = circleMap.getPath().getAt(i);
            polygon.push({lat: position.lat(), lng: position.lng()});
        }

        if (polygon[0])
            polygon.push(polygon[0]);

        return polygon;
    }

    elementProperty.addEventInElement("#btnAddZone", "onclick", function () {
        const area = getAreaPolygon();

        if (area.length === 0) {
            SwalCustom.messageDialog("", "Nenhuma aréa selecionanda", "info");
            return;
        }
        const data = {
            name: document.querySelector("#nameZone").value,
            cityId: city.cityId,
            area
        };

        if (data.name.length <= 0)
            return alert("Informe o nome da zona");

        preload(true);
        CentralNeigthborhoodsController.insert(data).then(({status, message}) => {
            SwalCustom.messageDialog("", message, status ? "success" : "info");

            if (status) {
                $("#addNeighborhoodZone").modal("hide");
                updateListZone();
            }
        }).finally(() => {
            preload(false)
        })
    });
});