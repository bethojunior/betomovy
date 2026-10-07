let object_control;
let originRoute = null;
let destinyRoute = null;
let wayPoinstSelected;
let defaultLayout;
let wayPoints = [];
let indiceWayPoint = 0;
let routeDistance;
let routeDuration;
let routeTripItemType = [];
const mapService = new MapService();
let mapPoints = [];
let polylineMap = null;
let count = 0;

Mask.setMoneyField("#price-route");
Mask.setMoneyField(".value-item");

const position = {lat: 0, lng: 0};

navigator.geolocation.getCurrentPosition(
    ({coords: {latitude: lat, longitude: lng}}) => {
        position.lat = lat;
        position.lng = lng;
    },
    () => console.log(),
    {}
);

$(".js-example-basic-single").select2();

$(document).ready(function () {
    $(".js-example-basic-single").select2();
});

elementProperty.addEventInElement("#origin-route", "onclick", function () {
    $("#modal-origin-route").modal("show");
    $(".js-example-basic-single").select2();
});

elementProperty.addEventInElement("#destiny-route", "onclick", function () {
    $("#modal-destiny-route").modal("show");
    $(".js-example-basic-single").select2();
});

elementProperty.getElement("#object-route", these => {
    preload(true);
    RouteController.listTripItem().then(({response}) => {
        let content = "";
        if(response.tripItemType.length !== 0){
            content += response.tripItemType
                .map(item => {
                    return `
                <option value='${JSON.stringify(item)}'>${item.name}</option>
            `;
                })
                .join("");
            these.innerHTML = content;
        } else {
            document.querySelector(".objects-content").style.display = "none";
        }

        preload(false);

    });
});

elementProperty.addEventInElement("#add-new-object", "onclick", function () {
    let object = JSON.parse(document.getElementById("object-route").value);
    let content = "";
    count = count + 1;
    content += `
        <div class="col-lg-8 row" id="content-${count}" style="margin-top: 0.5vw">
            <b style="margin-top: 0.5vw;" class="col-lg-6">${object.name}</b>
            <input id="value-item-${object.id}" placeholder="R$" class="col-lg-4 form-control value-item" value="">
            <button id="${count}" type="button" class="material-icons btn btn-danger btn-sm ml-2 btn-delete">delete</button>
        </div>
    `;

    let itemType = {
        tripItemTypeId: object.id
    };

    routeTripItemType.push(itemType);
    document.getElementById("mount-list-object").innerHTML += content;
    Mask.setMoneyField(".value-item");

    elementProperty.addEventInElement(".btn-delete", "onclick", function () {
        let id = this.getAttribute("id");
        document.querySelector(`#content-${id}`).remove();
    });
});

elementProperty.addEventInElement("#add-new-stop", "onclick", function () {
    $("#modal-stop-route").modal("show");
    $(".js-example-basic-single").select2();
});

elementProperty.addEventInElement("#save-new-stop", "onclick", function () {
    let name = document.getElementById("name-stop").value;
    let reference = document.getElementById("reference-stop").value;
    let place = wayPoinstSelected;
    let waypoint = {
        routePitStopTypeId: document.querySelector("#pitStopType").value,
        descriptionTypePitStop: document.querySelector("#pitStopType").selectedOptions[0].innerHTML,
        routePitStop: {
            tag: name,
            complement: reference,
            address: place.address,
            latitude: place.latitude,
            longitude: place.longitude
        }
    };
    wayPoints.push(waypoint);
    indiceWayPoint = wayPoints.length;
    updateWaypointContent();
    updateDistanceInMap();

    document.getElementById("name-stop").value= "";
    document.getElementById("reference-stop").value = "";
    document.querySelector("#pitStopType").value = "";
    document.querySelector("#place-waypoint").value = "";
    document.querySelector("#mount-places-by-waypoint").innerHTML = "";
});

function updateWaypointContent() {
    document.getElementById("mount-list-stop").innerHTML = wayPoints.map((item, index) => {
        return `<div  class="waypoint-item wayPoint-${index}" id="wayPoint-${index}" style="margin-top: 0.5vw">
            <p><span>Nome:</span><span>${item.routePitStop.tag}</span></p>
            <p><span>Referencia:</span><span>${item.routePitStop.complement}</span></p>
            <p><span>Endereço:</span><span>${item.routePitStop.address}</span></p>
            <p>
                <span>Tipo:</span>
                <span>${item.descriptionTypePitStop}</span></p>
            <button class="btn btn-danger deleteWayPoint" index="${index}"><i class="material-icons">clear</i></button>
        </div>`
    }).join("");

    elementProperty.addEventInElement(".deleteWayPoint", "onclick", function () {
        let id = this.getAttribute("index");
        wayPoints.splice(id,1);
        document.getElementById("wayPoint-" + id).remove();
        updateWaypointContent();
        updateDistanceInMap();
    });
}

let timeActiveKeySearchingOrigin = null;
let timeActiveKeySearchingDestiny = null;
let timeActiveKeySearchingWaypoint = null;

elementProperty.addEventInElement("#place-origin", "onkeydown", function () {
    clearTimeout(timeActiveKeySearchingOrigin);

    timeActiveKeySearchingOrigin = setTimeout(() => {
        elementProperty.getElement("#mount-places-by-origin", these => {
            SettingsController.getPlaces(this.value, position).then(({data}) => {
                these.innerHTML = data.map(item => {
                    return `<li class="list-group-item item-place-origin" data='${JSON.stringify(
                        item
                    )}'>${item.address}</li>
                    `;
                }).join("");

                elementProperty.addEventInElement(".item-place-origin", "onclick", function () {
                    const optionSelected = this;
                    elementProperty.removeClass(".item-place-origin", "active");
                    if (optionSelected != null) {
                        optionSelected.classList.add("active");
                        originRoute = JSON.parse(optionSelected.getAttribute("data"));

                        document.querySelector("#place-origin").value = originRoute.address;

                        SettingsController.getLocationByAddress(originRoute.address).then(
                            ({data: {latitude, longitude}}) => {
                                originRoute.latitude = latitude;
                                originRoute.longitude = longitude;
                                updateDistanceInMap();
                            }
                        );
                        originRoute.name = document.getElementById("name-address-origin").value;
                        originRoute.refference = document.getElementById(
                            "alias-address-origin"
                        ).value;


                    }
                });
            });
        });
    }, 750);
});

elementProperty.addEventInElement("#place-destiny", "onkeydown", function () {
    clearTimeout(timeActiveKeySearchingDestiny);

    timeActiveKeySearchingDestiny = setTimeout(() => {
        elementProperty.getElement("#mount-places-by-destiny", these => {
            SettingsController.getPlaces(this.value, position).then(callback => {
                if(callback == null)
                    return;

                these.innerHTML = callback.data.map(item => {
                        return `
                        <li class="list-group-item item-place-destiny" data='${JSON.stringify(
                            item
                        )}'>${item.address}</li>  
                    `;
                    }).join("");

                elementProperty.addEventInElement(".item-place-destiny", "onclick", function () {
                    const optionSelected = this;
                    elementProperty.removeClass(".item-place-destiny", "active");
                    if (optionSelected != null) {
                        optionSelected.classList.add("active");
                        destinyRoute = JSON.parse(optionSelected.getAttribute("data"));

                        document.querySelector("#place-destiny").value = destinyRoute.address;

                        SettingsController.getLocationByAddress(destinyRoute.address).then(
                            ({data: {latitude, longitude}}) => {
                                destinyRoute.latitude = latitude;
                                destinyRoute.longitude = longitude;
                                updateDistanceInMap();
                            }
                        );
                        destinyRoute.name = document.getElementById(
                            "name-address-destiny"
                        ).value;
                        destinyRoute.refference = document.getElementById(
                            "alias-address-destiny"
                        ).value;


                    }
                });
            });
        });

    }, 750);
});

elementProperty.addEventInElement("#place-waypoint", "onkeydown", function () {
    clearTimeout(timeActiveKeySearchingWaypoint);

    timeActiveKeySearchingWaypoint = setTimeout(() => {
        elementProperty.getElement("#mount-places-by-waypoint", these => {
            SettingsController.getPlaces(this.value, position).then(callback => {
                these.innerHTML = callback.data
                    .map(item => {
                        return `
                            <li class="list-group-item item-place-waypoint" data='${JSON.stringify(item)}'>
                            ${item.address}
                            </li>  
                        `;
                    }).join("");
                elementProperty.addEventInElement(".item-place-waypoint", "onclick", function () {
                    const optionSelected = this;
                    elementProperty.removeClass(".item-place-waypoint", "active");
                    if (optionSelected != null) {
                        optionSelected.classList.add("active");
                        wayPoinstSelected = JSON.parse(optionSelected.getAttribute("data"));
                        document.querySelector("#place-waypoint").value = wayPoinstSelected.address;
                        SettingsController.getLocationByAddress(wayPoinstSelected.address).then(
                            ({data: {latitude, longitude}}) => {
                                wayPoinstSelected.latitude = latitude;
                                wayPoinstSelected.longitude = longitude;
                            }
                        );
                    }
                });
            });
        });
    }, 2000);
});

elementProperty.addEventInElement(".save-origin", "onclick", function () {
    document.getElementById("name-origin-show").value = originRoute.address;
});

elementProperty.addEventInElement(".save-destiny", "onclick", function () {
    document.getElementById("name-destiny-show").value = destinyRoute.address;
});


elementProperty.addEventInElement(
    "#calculate-estimed-time",
    "onclick",
    function () {
        if (originRoute == null || destinyRoute == null)
            return swal(
                "ops",
                "Você precisa preencher os dados de origem e destino",
                "info"
            );

        updateDistanceInMap();
    }
);

function updateDistanceInMap() {
    if (originRoute == null || destinyRoute == null)
        return;

    let origin = originRoute.latitude + "," + originRoute.longitude;
    let destination = destinyRoute.latitude + "," + destinyRoute.longitude;

    mapPoints.map(item => {
        item.setMap(null);
    });

    mapPoints = [];

    let myWayPoints = wayPoints.map(item => {
        mapPoints.push(mapService.createMaker({lat: parseFloat(item.routePitStop.latitude), lng: parseFloat(item.routePitStop.longitude)},{
            url: "/webfiles/img/svg/waypoint.svg",
            scaledSize: new google.maps.Size(35, 35)
        }));
        return `${item.routePitStop.latitude},${item.routePitStop.longitude}`;
    }).join("|");

    const originPosition = {lat: parseFloat(originRoute.latitude), lng: parseFloat(originRoute.longitude)};
    const destinationPosition = {lat: parseFloat(destinyRoute.latitude), lng: parseFloat(destinyRoute.longitude)};

    mapPoints.push(mapService.createMaker(originPosition,{
        url: "/webfiles/img/svg/origin.svg",
        scaledSize: new google.maps.Size(35, 35)
    }));
    mapPoints.push(mapService.createMaker(destinationPosition,{
        url: "/webfiles/img/svg/destination.svg",
        scaledSize: new google.maps.Size(35, 35)
    }));

    let get = `origin=${origin}&destination=${destination}`;

    if (myWayPoints.length > 0) {
        get = `origin=${origin}&destination=${destination}&waypoints=${myWayPoints}`;
    }

    SettingsController.calculateRoute(get).then(response => {
        let data = response.data;
        routeDuration = data.duration;
        routeDistance = data.distance;
        defaultLayout = data.overview_polyline.points;
        const polyline = decodePolyline(defaultLayout);
        mapService.setBoundsArray([originPosition, ...polyline, destinationPosition]);
        if (polylineMap != null)
            polylineMap.setMap(null);

        polylineMap = mapService.createPolyline(polyline);
        polylineMap.setMap(mapService.map);

        elementProperty.addClass(".map-example", "active")

        let duration = data.duration;
        let minutes = duration / 60;
        minutes = minutes.toString();
        let estimed = minutes.split(".");
        document.getElementById("time-estimed-route").value =
            estimed[0] + " minutos";
    });
}

elementProperty.addEventInElement("#save-route", "onclick", function () {
    if (originRoute == null)
        return alert("Informe o endereço de origem");
    if (destinyRoute == null)
        return alert("Informe o endereço de destino");
    if (document.querySelector("#tripType").value === "")
        return alert("Informe o tipo de chamado");

    routeTripItemType.map(item => {
        let valor = document.getElementById("value-item-" + item.tripItemTypeId).value;
        valor = valor.toString();
        valor = valor.replace(",", ".");
        item.value = valor;
    });


    preload(true);


    let priceRoute = document.getElementById("price-route").value;
    priceRoute = priceRoute.replace(",", ".");
    let route = {
        name: document.getElementById("name-new-route").value,
        defaultLayout: defaultLayout,
        tripTypeId: document.querySelector("#tripType").value,
        price: priceRoute,
        estimatedDistance: routeDistance,
        estimatedTime: routeDuration,
        allowCustomerStops: document.getElementById("allowCustomerStops").checked,
        routeWayPoints: [...wayPoints],
        routeTripItemType: [...routeTripItemType],
        origin: {
            tag: originRoute.name,
            complement: originRoute.refference,
            latitude: originRoute.latitude,
            longitude: originRoute.longitude,
            address: originRoute.address
        },
        destination: {
            tag: destinyRoute.name,
            complement: destinyRoute.refference,
            latitude: destinyRoute.latitude,
            longitude: destinyRoute.longitude,
            address: destinyRoute.address
        }
    };

    RouteController.createRoute(route).then(({status, response, message}) => {
        preload(false);
        if (!status) return swal(response[0], "", "info");
        if (status) return swal("Rota criada com sucesso", "", "success").then(() => location.reload());
    });
});


TripTypeController.getAll().then(({status, response}) => {
    if (!status)
        return;

    elementProperty.getElement("#tripType", element => {
        element.innerHTML += response.map(item => {
            return `<option value="${item.idTripType}">${item.type}</option>`
        }).join("");
    })
});

mapService.importScriptWithPlaces(true).then(() => {
    mapService.initMap({lat: 0, lng: 0}, 15, document.querySelector(".map-example"))
});


function decodePolyline(encoded) {
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

RouteController.routePitStopType().then(({response}) => {
    document.querySelector("#pitStopType").innerHTML = response.map(item => {
        return `<option value="${item.id}">${item.name}</option>`
    }).join("")
})