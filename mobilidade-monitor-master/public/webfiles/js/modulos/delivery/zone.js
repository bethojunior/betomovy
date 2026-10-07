document.addEventListener("DOMContentLoaded", function () {
    const city = Session.getLocal("citySelected");
    let circleMap = null;
    Mask.setMoneyField(".input-mask-money");
    updateListZone();
    const mapService = new MapService();
    const mapServiceEdit = new MapService();

    mapService.setLibraries("drawing");

    mapService.importScriptWithPlaces().then(() => {
        mapService.initMap({lat: 0, lng: 0}, 15, document.getElementById('map'))
        mapServiceEdit.initMap({lat: 0, lng: 0}, 15, document.getElementById('mapEdit'))
    })


    elementProperty.addEventInElement("#btnSearchLocal", "onclick", function () {
        const host = `https://nominatim.openstreetmap.org/search.php?q=${document.querySelector("#nameZone").value} ${Session.getLocal("citySelected").nome}&polygon_geojson=1&format=jsonv2`;

        preload(true);
        fetch(host).then(result => result.json()).then((result) => {
            preload(false);
            document.querySelector("#contentMap").hidden = false;
            if (result.length === 0)
                return SwalCustom.messageDialog("Informe mais detalhadamente o nome do bairro", "Nenhum bairro foi encontrado");

            document.querySelector("#listGroupAddress").innerHTML = result.filter(item => {
                return item.geojson.type === "Polygon";
            }).map(item => {
                return `<li class="list-group-item item-address" style="cursor: pointer" value='${btoa(JSON.stringify(item))}'><small>${item.display_name.substring(0, 50)}</small></li>`
            }).join("");

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
        })
    });

    elementProperty.addEventInElement("#btnSearchLocalEdit", "onclick", function () {
        const host = `https://nominatim.openstreetmap.org/search.php?q=${document.querySelector("#nameZoneEdit").value} ${Session.getLocal("citySelected").nome}&polygon_geojson=1&format=jsonv2`;

        preload(true);
        fetch(host).then(result => result.json()).then((result) => {
            preload(false);
            document.querySelector("#contentMapEdit").hidden = false;
            if (result.length === 0)
                return SwalCustom.messageDialog("Informe mais detalhadamente o nome do bairro", "Nenhum bairro foi encontrado");

            document.querySelector("#listGroupAddressEdit").innerHTML = result.filter(item => {
                return item.geojson.type === "Polygon";
            }).map(item => {
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
        DeliveryNeighborhoodController.list(city.cityId).then(({response, status}) => {
            document.querySelector("#listZone").innerHTML = response.map(zone => {
                return `<tr>
                        <td>${zone.name}</td>
                        <td>${zone.city.nome}</td>
                        <td><a href="#" value="${zone.id}" class="remove-zone">Excluir</a></td>
                        <td><a href="#" value='${JSON.stringify(zone)}' class="edit-zone">Editar</a></td>
                    </tr>`
            }).join("");

            elementProperty.addEventInElement(".edit-zone", "onclick", function () {
                const zone = JSON.parse(this.getAttribute("value"));
                document.querySelector("#nameZoneEdit").value = zone.name;
                console.log(zone)
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
                //    document.querySelector("#priceZoneEdit").value = Mask.maskMoney(zone.deliveryPrice);

                $("#editDeliveryZone").modal("show");

                elementProperty.addEventInElement("#btnEditZone", "onclick", function () {
                    SwalCustom.dialogConfirm("Deseja salvar as alterações?", "", status => {
                        if (!status)
                            return;

                        const area = getAreaPolygon();

                        if (area.length === 0) {
                            SwalCustom.messageDialog("", "Nenhuma aréa selecionanda", "info");
                            return;
                        }

                        const data = {
                            name: document.querySelector("#nameZoneEdit").value,
                            deliveryPrice: 0,
                            cityId: city.cityId,
                            area
                        };

                        if (data.name.length <= 0)
                            return alert("Informe o nome da zona");

                        preload(true);

                        DeliveryNeighborhoodController.update(zone.id, data).then(({message, status}) => {
                            SwalCustom.messageDialog("", message, status ? "success" : "info");

                            if (status) {
                                $("#editDeliveryZone").modal("hide");
                                updateListZone();
                            }
                        }).finally(() => {
                            preload(false)
                        })
                    });
                });
            });

            elementProperty.addEventInElement(".remove-zone", "onclick", function () {
                SwalCustom.dialogConfirm("Deseja remover essa zona?", "", status => {
                    if (!status)
                        return;

                    preload(true);
                    DeliveryNeighborhoodController.delete(this.getAttribute("value")).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info");

                        if (status) {
                            $("#addDeliveryZone").modal("hide");
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
            deliveryPrice: Mask.removeMaskMoney(document.querySelector("#deliveryPrice").value),
            cityId: city.cityId,
            area
        };

        if (data.name.length <= 0)
            return alert("Informe o nome da zona");

        preload(true);
        DeliveryNeighborhoodController.insert(data).then(({status, message}) => {
            SwalCustom.messageDialog("", message, status ? "success" : "info");

            if (status) {
                $("#addDeliveryZone").modal("hide");
                updateListZone();
            }
        }).finally(() => {
            preload(false)
        })
    });
});