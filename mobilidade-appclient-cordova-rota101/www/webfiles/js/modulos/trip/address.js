function getAddressCurrent({data: place}) {
    if (!place)
        return setTimeout(() => document.querySelector("#origin").focus(), 1000);

    priceTrip.setPlace(place);

    CityController.getConfigByPosition({lat: place.latitude, lng: place.longitude}).then(({status, data}) => {
        if (!status)
            return;

        Session.set("cityConfig", data);

        managerPlaceStop.amount = parseInt(data.quantityTripWayPoints);
    });

    Session.set(`neighborhood-origin`, place.neighborhood);

    viewController.elementProperty.getElement("#origin", element => element.value = place.address);
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

function createLayoutDefault() {
    viewController.elementProperty.getElement("#containerCustomerPlaces", element => {
        element.innerHTML = `<li class="local-trip-customer" value="home-customer">
                        <i class="material-icons">
                           home
                        </i>
                        <span>${getTextTranslate("home","span-add-home")}</span>
                    </li>
                    <li class="local-trip-customer" value="work-customer">
                        <i class="material-icons">
                            work
                        </i>
                        <span>${getTextTranslate("home","span-add-work")}</span>
                    </li>
                    ${verifyTripWithoutDestination()}
                    <li class="point-trip-customer">
                        <i class="material-icons">
                            pin_drop
                        </i>
                        <span>${getTextTranslate("home","span-add-pin-drop")}</span>
                    </li>
                    <li class="local-trip-customer" value="favorite-customer">
                        <i class="material-icons">
                            add
                        </i>
                        <span>${getTextTranslate("home","span-add-local")}</span>
                    </li>`;
    })
}

function verifyTripWithoutDestination() {
    if (ConfigGeneral().get("enable_open_price_trip") == false)
        return "";

    return `<li class="option-trip-without-destination">
                        <i class="material-icons">
                            local_taxi
                        </i>
                        <span>${getTextTranslate("home","span-add-travel-without-destination")}</span>
                    </li>`;
}

function updateInfoPlaces() {
    createLayoutDefault();

    viewController.elementProperty.getElement(".local-trip-customer", element => {
        const type = element.getAttribute("value");

        if (!(type === "home-customer" || type === "work-customer"))
            return;

        const place = Session.get("customerPlace").filter(place => {
            return element.getAttribute("value") === place.alias;
        })[0];

        if (place) {
            element.innerHTML = `<i class="material-icons">${infoPlace[type].icon}</i>
                <div>
                    <span>${infoPlace[type].descriptionExist}</span>
                    <label>${place.address}</label>
                </div>
                <i class="material-icons remove-place-customer"
                 value='${JSON.stringify(place)}'>delete_outline</i>`;

            element.classList.add("exist-place");

            element.setAttribute("place", JSON.stringify(place));

            return;
        }

        element.innerHTML = `<i class="material-icons">${infoPlace[type].icon}</i><span>${infoPlace[type].description}</span>`;

        element.classList.remove("exist-place");
    });

    addPlaceFavorite();

    initEventsPlace();
}

function addPlaceFavorite() {
    viewController.elementProperty.getElement(".another-customer-place", element => {
        element.remove();
    });

    viewController.elementProperty.getElement("#containerCustomerPlaces", element => {
        element.innerHTML += Session.get("customerPlace").filter(place => {
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

function showPanelHistoryTrip() {
    if (this.getAttribute)
        Session.set("currentInputAddress", this.getAttribute("id"));

    updateInfoPlaces();

    viewController.elementProperty.getElement(".menu-close", element => {
        if (element.classList.contains("open")) {

            viewController.elementProperty.addEventInElement(".search-address-location", "onblur", (e) => {
                Session.set("lastInputSearch", e.srcElement.getAttribute("id"));
            });

            viewController.elementProperty.getElement(".history-trips", element => {
                element.classList.add("active");
            });

            //return;
        }
    });
}

function initEventsPlace() {
    viewController.elementProperty.addEventInElement(".option-trip-without-destination", "onclick", function () {
        openAddressWithoutDestination();
    });
    viewController.elementProperty.addEventInElement(".local-trip-customer", "onclick", function () {
        Session.set("addPlace", this.getAttribute("value"));
        viewController.addParams("add-place", this.getAttribute("value"));
        Route.redirectDynamic("Place", "AddLocal")
    });
    viewController.elementProperty.addEventInElement(".exist-place", "onclick", function () {
        const place = JSON.parse(this.getAttribute("place"));

        Session.set(`city-${Session.get("lastInputSearch")}`, place.cityId, false);

        setPlaceSelect(place, Session.get("lastInputSearch"));

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

    viewController.elementProperty.addEventInElement(".history-trips", "ontouchstart", function () {
        //Keyboard.hide();
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

        mapService.pointCenter = mapService.makeMarker(mapService.map.getCameraTarget(), mapService.map);

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

            mapService.pointCenter.remove();
            mapService.pointCenter = null;
        }, COMPONENT_CREATE_TRIP);
    });

    viewController.elementProperty.addEventInElement("#btnConfirmationPointLocalUser", "onclick", function () {
        viewController.elementProperty.getElement("#namePointUser", element => {
            const place = JSON.parse(element.getAttribute("value"));

            if (place == null)
                return;

            Session.set(`neighborhood-${Session.get("lastInputSearch")}`, place.neighborhood);

            setPlaceSelect({
                latitude: place.latitude,
                longitude: place.longitude,
                address: place.address,
            }, Session.get("lastInputSearch"));


            Route.backPage();
        });
    });
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
