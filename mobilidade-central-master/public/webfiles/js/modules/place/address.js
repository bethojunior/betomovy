function getAddressCurrent(address) {
    priceTrip.setPrace(address);

    priceTrip.getCityByPlace(address).then((cityId) => {
        Session.set(`city-origin`, cityId);

        ConfigRepository.getConfigByLocation(address.latitude, address.longitude)
            .then(({status, response}) => {

                if (!status || !response)
                    return;

                if (!response.typeMoney) {
                    response.typeMoney = '$';
                }

                Session.setLocal("cityConfig", response);
                try {
                    localStorage.setItem("cityConfig", JSON.stringify(response));
                } catch (e) {}

                managerPlaceStop.amount = parseInt(response.quantityTripWayPoints || 0);
            });
    });

    Session.setLocal(`neighborhood-origin`, priceTrip.searchInPlace("sublocality_level_1", address));

    viewController.elementProperty.getElement("#origin", element => element.value = address.formatted_address);
}

function getConfigCentral(central) {
    if (!central) {
        central = Session.get("centralSelected");
    }
    const lat = central ? parseFloat(central.latitude) : NaN;
    const lng = central ? parseFloat(central.longitude) : NaN;
    if (isNaN(lat) || isNaN(lng)) {
        return;
    }
    ConfigRepository.getConfigByLocation(lat, lng)
        .then(({status, response}) => {
            if (!status || !response)
                return;

            if (!response.typeMoney) {
                response.typeMoney = '$';
            }

            Session.setLocal("cityConfig", response);
            try {
                localStorage.setItem("cityConfig", JSON.stringify(response));
            } catch (e) {}

            managerPlaceStop.amount = parseInt(response.quantityTripWayPoints || 0);
        }).catch(e => console.log(e));
}


const infoPlace = {
    "home-customer": {
        icon: "home",
        description: "Adicionar casa",
        descriptionExist: "Casa"
    },
    "work-customer": {
        icon: "work",
        description: "Adicionar trabalho",
        descriptionExist: "Trabalho"
    },
};

function verifyFieldAddress() {
    if (this.value.length === 0) {
        showPanelHistoryTrip();
        return;
    }

    removePanelHistoryTrip();
}

function updateInfoPlaces() {
    createLayoutDefault();

    addPlaceFavorite();

    initEventsPlace();
}

function addPlaceFavorite() {
    viewController.elementProperty.getElement(".another-customer-place", element => {
        element.remove();
    });

    viewController.elementProperty.getElement("#containerCustomerPlaces", element => {
        element.innerHTML += Session.getLocal("customerPlace").filter(place => {
            return !(place.alias === "home-customer" || place.alias === "work-customer");
        }).map(place => {
            return `<li class="local-trip-customer exist-place another-customer-place"
                        place='${JSON.stringify(place)}'>
                    <i class="material-icons">star_border</i>
                    <div>
                        <span>${place.alias}</span>
                        <label>${place.address}</label>
                    </div>
                    <i class="material-icons remove-place-customer" 
                         value='${JSON.stringify(place)}'>delete_outline</i>
                </li>`;
        }).join("");
    });
}

function showPanelHistoryTrip(event) {
    if (event) {
        if (event.target) {
            Session.set("lastInputSearch", event.target.getAttribute("id"));
            if (event.target.value.length > 0)
                return event.target.select();

        }
    }

    updateInfoPlaces();

    viewController.elementProperty.addEventInElement(".back-address","onclick", function(){
        viewController.elementProperty.removeClass(".container-search-local","active");
        updateBtnCallTripVisibility();
    });

    viewController.elementProperty.getElement(".menu-close", element => {
        if (element.classList.contains("open")) {

            viewController.elementProperty.addEventInElement(".search-address-location", "onblur", (e) => {
                Session.set("lastInputSearch", e.srcElement.getAttribute("id"));
            });

            viewController.elementProperty.getElement(".history-trips", element => {
                element.classList.add("active");
            });
        }
    });
}

function initEventsPlace() {
    viewController.elementProperty.addEventInElement(".local-trip-customer", "onclick", function () {
        viewController.addParams("add-place", this.getAttribute("value"));
        Route.redirectDynamic("Place", "AddLocal")
    });
    viewController.elementProperty.addEventInElement(".exist-place", "onclick", function () {
        setPlaceSelect(JSON.parse(this.getAttribute("place")), Session.get("lastInputSearch"));

    });
    viewController.elementProperty.addEventInElement(".remove-place-customer", "onclick", function (event) {
        event.stopPropagation();

        const place = JSON.parse(this.getAttribute("value"));

        SwalCustom.dialogConfirm("Deseja remover local salvo ?", "", "info").then(() => {
            new CustomerPlaceController().delete({placeId: place.idPlace}).then(() => {
                getCustomerPlace().then(showPanelHistoryTrip);
            })
        });
    });

    viewController.elementProperty.addEventInElement(".point-trip-customer", "onclick", function () {
        mapService.verifyAddressByCenter();

        viewController.elementProperty.getElement(".container-menu", element => {
            element.style.display = "none";
        });

        viewController.elementProperty.getElement(".notification-item", element => {
            element.style.display = "none";
        });

        viewController.elementProperty.getElement(".menu-close", element => {
            element.style.display = "none";
        });

        mapService.pointCenter.setMap(mapService.map);

        Route.startClassesInComponent([{component: ".container-point-local-map", class: "active"}], () => {
            viewController.elementProperty.getElement(".container-menu", element => {
                element.style = "";
            });

            viewController.elementProperty.getElement(".notification-item", element => {
                element.style = "";
            });

            viewController.elementProperty.getElement(".menu-close", element => {
                element.style = "";
            });

            viewController.elementProperty.removeClass(".container-point-local-map", "active");

            mapService.pointCenter.setMap(null);
        }, COMPONENT_CREATE_TRIP);
    });

    viewController.elementProperty.addEventInElement("#btnConfirmationPointLocalUser", "onclick", function () {
        viewController.elementProperty.getElement("#namePointUser", element => {
            const place = JSON.parse(element.getAttribute("value"));

            if (place == null)
                return;

            document.querySelector(`*[place=${ Session.getLocal("getPositionPlaceSelected")}]`).value = place.address;

            Session.setLocal(`neighborhood-${ Session.getLocal("getPositionPlaceSelected")}`, place.neighborhood || "");
            Session.setLocal(`city-${ Session.getLocal("getPositionPlaceSelected")}`, place.cityId);

            getPoint({
                latitude: place.latitude,
                longitude: place.longitude,
                address: place.address,
                neighborhood: place.neighborhood,
            }, Session.getLocal("getPositionPlaceSelected"));


            Route.backPage();
        });
    });
}

function createLayoutDefault() {
    viewController.elementProperty.getElement("#containerCustomerPlaces", element => {
        element.innerHTML = `
                    <li class="point-trip-customer">
                        <i class="material-icons">
                            pin_drop
                        </i>
                        <span>Defina o local no mapa</span>
                    </li>`;
    })
}

function removePanelHistoryTrip() {
    viewController.elementProperty.getElement(".history-trips", element => {
        element.classList.remove("active");
    })
}

function getCustomerPlace() {
    return new Promise((resolve, reject) => {
        new CustomerPlaceController().getAll().then(({status, data}) => {
            if (!status)
                return;

            resolve();
            Session.set("customerPlace", data);
        }).catch(reject);
    });
}
