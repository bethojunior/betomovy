document.addEventListener("DOMContentLoaded",function () {
    getListFavorites().then(data => {
        Session.set("favorites", data);
    })
});

function getListFavorites() {
    return new Promise((resolve, reject) => {
        /*const favoriteDriveController = new FavoriteDriverController();
        favoriteDriveController.list(parseInt(Session.getValueInSession("user", "idCustomer")))
            .then(({status, data}) => {
                if (!status) {
                    reject();
                    return;
                }

                resolve(data);
            }).catch(() => {
            reject();
        });*/
    });
}

function checkFavoritesDriver(trip) {
    getListFavorites().then(favorites => {
        if (favorites.length === 0) {
            trip.favorites = null;
            checkTypeCustomerByTrip(trip);
            return;
        }

        Route.startClassesInComponent([
                {component: ".favorite-driver-trip",class:"active"}
            ],
            () => {
                viewController.elementProperty.removeClass(".favorite-driver-trip", "active");
            }, COMPONENT_CREATE_TRIP);

        viewController.elementProperty.getElement("#listDriverFavoritesOnline", element => {
            const favoritesOnline = favorites.filter(driver => {
                return driver.statusDriver === "disponivel";
            });

            element.innerHTML = favoritesOnline.map(driver => {
                return `
                <li class="driver-favorite active" value='${JSON.stringify(driver)}'>
                    <img style="background-image: url('${environment.hosts.hostImageDriver}${driver.driverImage}')">
                    <div>
                        <div class="name-driver">${driver.driverName}</div>
                        <div class="plate-driver">${driver.plate === null ? "NÃO INFORMADO" : driver.plate}</div>
                        <i class="material-icons">check</i>
                    </div>
                </li>
            `;
            }).join("");

            viewController.elementProperty.removeClass(".offline-driver-favorite", "active");
            viewController.elementProperty.addClass(".list-driver-favorite", "active");

            if (favoritesOnline.length === 0) {
                Route.removeGroupComponent(COMPONENT_CREATE_TRIP);

                viewController.elementProperty.addClass(".offline-driver-favorite", "active");
                viewController.elementProperty.addClass(".favorite-driver-trip", "drivers-disabled");
                viewController.elementProperty.removeClass(".list-driver-favorite", "active");

                setTimeout(() => {
                    viewController.elementProperty.removeClass(".favorite-driver-trip", "active");
                    viewController.elementProperty.removeClass(".favorite-driver-trip", "drivers-disabled");

                    trip.favorites = null;

                    checkTypeCustomerByTrip(trip);

                }, 5000);
            }

            viewController.elementProperty.addEventInElement(".driver-favorite", "onclick", function () {
                if (!this.classList.contains("active")) {
                    this.classList.add("active");
                    return;
                }

                this.classList.remove("active");
            });

            viewController.elementProperty.addEventInElement("#initTripModalFavorites", "onclick", function () {
                viewController.elementProperty.removeClass(".favorite-driver-trip", "active");
                viewController.elementProperty.removeClass(".favorite-driver-trip", "drivers-disabled");

                const drivers = [];
                viewController.elementProperty.getElement(".driver-favorite", element => {
                    if (element.classList.contains("active")) {
                        const driver = JSON.parse(element.getAttribute("value"));
                        drivers.push(driver.idDriver);
                    }
                });

                trip.favorites = drivers.length === 0 ? null : drivers;

                checkTypeCustomerByTrip(trip);
            });
        });
    }).catch(() => {
       // preload(false);
    });

    viewController.elementProperty.addEventInElement(".close-modal-check-favorite", "onclick", function () {
        viewController.elementProperty.removeClass(".favorite-driver-trip", "active");
        viewController.elementProperty.removeClass(".favorite-driver-trip", "drivers-disabled");
    });
}