viewController.setObserver("add-place", (typeLocal) => {
    const elementProperty = new ElementProperty();
    const mapService = new MapService();
    const cityGoogleMaps = new CityGoogleMaps();
    const customerPlaceController = new CustomerPlaceController();


    const managerPlace = {
        marker: null,
        place: null,
        data: {
            "alias": typeLocal,
            "address": "",
            "neighborhood": "",
            "cityId": "",
            "latitude": null,
            "longitude": null
        }
    };


    mapService.initMap("mapAddPlace", Session.get("location"), () => {
        elementProperty.getElement("#searchPlaceAdd", element => {
            element.focus();
            mapService.addSearchInInput(element, ({data}) => {
                elementProperty.getElement(".places-list", element => {
                    element.innerHTML = data.map((place) => {
                        return `<li class="detail-place-selected" value='${JSON.stringify(place)}'>
                                    <i class="material-icons">place</i>
                                    <p>${place.address}</p>
                                </li>`;
                    }).join("");
                });

                elementProperty.addEventInElement(".detail-place-selected", "onclick", function () {
                    elementProperty.getElement(".places-list", element => {
                        element.innerHTML = "";
                    });

                    const place = JSON.parse(this.getAttribute("value"));

                    document.getElementById("searchPlaceAdd").value = place.address;

                    mapService.getDetailPlace(place.address).then(getPlace);
                });
            }, () => {
                elementProperty.getElement(".places-list", element => {
                    element.innerHTML = "";
                })
            });
        });
    });

    function getPlace({data: place, status, message}) {
        if (!status)
            return SwalCustom.messageDialog("", message, () => {
                const searchPlaceAdd = document.getElementById("searchPlaceAdd");
                searchPlaceAdd.select();
                searchPlaceAdd.focus();

            }, "info");

        const position = {lat: place.latitude, lng: place.longitude};

        mapService.map.animateCamera({
            target: position,
            duration: 500,
            padding: 60,
        });
        if (managerPlace.marker != null) {
            managerPlace.marker.remove();
            managerPlace.marker = null;
        }
        managerPlace.place = place;
        managerPlace.marker =
            mapService.makeMarker(position, mapService.map);
        elementProperty.addClass(".confirmation-place", "active");

        managerPlace.data.cityId = null;
        managerPlace.data.neighborhood = place.neighborhood;
        managerPlace.data.address = document.getElementById("searchPlaceAdd").value;
        managerPlace.data.latitude = position.lat;
        managerPlace.data.longitude = position.lng;
        managerPlace.data.alias = typeLocal;

        let dataPlace = {
            cityId: null,
            neighborhood: place.neighborhood,
            address: document.getElementById("searchPlaceAdd").value,
            latitude: position.lat,
            longitude: position.lng,
            alias: Session.get("addPlace"),
        };

        elementProperty.addEventInElement(".confirmation-place", "onclick", () => {
            if (dataPlace.alias === "favorite-customer") {
                swal("Digite o nome do local:", {
                    content: "input",
                }).then((value) => {
                    if (value === null || value.length === 0) {
                        SwalCustom.messageDialog("", "Por favor, digite o nome do local", undefined, "info");
                        return;
                    }

                    dataPlace.alias = value;

                    savePlace(dataPlace);
                });
                return;
            }
            savePlace(dataPlace);
        });
    }

    viewController.onBack(() => {
        elementProperty.addClass(".menu-close", "open");
        clearScreen();
        elementProperty.removeClass(".pac-container", "auto-search-add-place");
        elementProperty.removeClass(".confirmation-place", "active");
    });

    elementProperty.addEventInElement(".go-back", "onclick", () => Route.backPage());

    elementProperty.addEventInElement("#clearInputSearchPlaceAdd", "onclick", typeAgainAddress);


    function savePlace(dataPlace) {
        preload(true);
        customerPlaceController.insert(dataPlace).then(({status, data, message}) => {
            if (!status) {
                preload(false);
                SwalCustom.messageDialog("", message, undefined, "warning");
                return;
            }

            getCustomerPlace().then(() => {
                preload(false);
                showPanelHistoryTrip();
                Route.backPage();
            });
        }).catch(() => {
            preload(false);
            SwalCustom.messageDialog("", "Ocorreu um erro ao tentar salvar local", undefined, "warning");
        });
    }

    function clearScreen() {
        elementProperty.removeClass("#clearInputSearchPlaceAdd", "active");
        elementProperty.removeClass(".confirmation-place", "active");
        elementProperty.getElement("#searchPlaceAdd", element => element.value = '');

        if (managerPlace.marker !== null)
            managerPlace.marker.remove();

        managerPlace.marker = null;
        managerPlace.place = null;

        managerPlace.data = {
            "alias": typeLocal,
            "address": "",
            "neighborhood": "",
            "cityId": "",
            "latitude": null,
            "longitude": null
        };
    }

    function typeAgainAddress() {
        preload(false);
        elementProperty.getElement("#searchPlaceAdd", element => element.focus());
        clearScreen();

    }
});