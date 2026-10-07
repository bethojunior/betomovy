function saveAddressInCache(destination) {
    let listAddressCache = Session.get("listAddressCache");

    const exist = listAddressCache.find(item => {
        return item.address === destination.address;
    }) != null;

    if (!exist) {
        Session.set("listAddressCache", [
            destination,
            ...listAddressCache
        ].splice(0, 3))
    } else {
        listAddressCache.sort((a, b) => {
            if (a.address === destination.address && b.address !== destination.address) return -1;
            if (a.address !== destination.address && b.address === destination.address) return 1;
            return 0;
        });

        Session.set("listAddressCache", listAddressCache)
    }
}

function createListAddressShortcut() {
    const clientStatus = Session.get('user').customerRegisterStatusId;
    if (clientStatus != '3') {
        document.querySelector("#listAddressShortcutDestination").innerHTML = Session.get("listAddressCache").map(destination => {
            return `<li class="address-shortcut" value='${btoa(unescape(encodeURIComponent(JSON.stringify(destination))))}'>
                        <i class="material-icons">schedule</i>
                        <p>${destination.address}</p>
                    </li>`;
        }).join("");
    }

    viewController.elementProperty.addEventInElement(".address-shortcut", "onclick", function (event) {
        event.stopPropagation();
        activeMenu();
        Route.startClassesInComponent(
            [
                {component: ".btn-call-trip", class: "active"},
                {component: ".container-publicity-app", class: "hidden"},
                {component: ".floating-icon-coupon", class: "active"}
            ],
            () => {
                initProcessingCallTrip();
                verifyListTripActivePartner();
                managerTripViewCurrent.isVisible = true;

                viewController.elementProperty.getElement(".pac-container", element => {
                    element.style.display = "none";
                });

                viewController.elementProperty.getElement(".input-custom", element => {
                    element.disabled = true;
                });
            },
            COMPONENT_CREATE_TRIP
        );

        const destination = JSON.parse(decodeURIComponent(escape(atob(this.getAttribute("value")))));

        trip.origin = Session.get("location");

        mapService.addPointClient(trip.origin);

        mapService.getAddressByLatLng(trip.origin).then(result => {
            getAddressCurrent(result);
            setPlaceSelect(destination, "destination");
        });

    });

    setTimeout(() => {
        document.querySelector("#listAddressShortcutDestination").classList.add("active")
    }, 2000);
}
