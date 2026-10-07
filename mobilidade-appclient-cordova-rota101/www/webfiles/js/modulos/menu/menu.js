Route.waitView().then(function () {
    const elementProperty = new ElementProperty();

    const userLogged = Session.get("user");

    const customerController = new CustomerController();

    elementProperty.addEventInElement(".menu-close", "onclick", optionOpenMenu);

    window.updateDataUserMenu = function () {
        const userLogged = Session.get("user");

        if (userLogged.profileImage !== null) {
            elementProperty.getElement("#imageUserMenu", element => {
                element.style.backgroundImage = `url('${userLogged.profileImage}')`;
            });
        }

        elementProperty.getElement("#nameUser", element => {
            element.innerHTML = userLogged.nickname;
        });

        elementProperty.getElement("#ratingCustomerProfile", element => {
            element.innerHTML = `${parseFloat(userLogged.rating).toFixed(2)}<span class="material-icons">star_rate</span>`;
        });
    };

    function checkPermissionMenu() {
        elementProperty.getElement("#accountCustomer", element => {
            if (ConfigGeneral().get("enable_account_menu") == true) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        });

        elementProperty.getElement("#itemFavoriteDriver", element => {
            if (ConfigGeneral().get("enable_favorite_customer_and_driver") == true) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        });
    }

    function optionOpenMenu(e) {
        e.stopPropagation();

        if (this.classList.contains("open")) {
            Route.backPage();
        }

        showMenu();

        Route.startClassesInComponent(
            [{component: ".menu-close", class: "open"}],
            () => {
                this.classList.remove("open");
                showMenu(false);
                closeOptionsMenu();
            }
        );
        //this.classList.add("open");
    }

    function showMenu(result = true) {
        checkPermissionMenu();
        elementProperty.getElement(".container-menu-options", element => {
            if (result) {
                element.classList.add("active");
                return;
            }
            element.classList.remove("active");
        });
    }

    elementProperty.getElement("#menuOptionUser", element => {
        const list = element.getElementsByTagName("li");

        for (let i = 0; i < list.length; i++) {
            list[i].onclick = function () {
                if (this.classList.contains("active")) {
                    removeActiveList(element);
                    return;
                }
                removeActiveList(element);
                this.classList.add("active");
            };
        }

        function removeActiveList(element) {
            const list = element.getElementsByTagName("li");

            for (let i = 0; i < list.length; i++) {
                list[i].classList.remove("active");
            }
        }
    });

    function closeOptionsMenu() {
        elementProperty.getElement("#menuOptionUser", element => {
            const list = element.getElementsByTagName("li");

            for (let i = 0; i < list.length; i++) {
                list[i].classList.remove("active");
            }
        });
    }

    elementProperty.addEventInElement("#logout", "onclick", function () {
        const dataLogin = Session.get("dataLogin");
        const listAddressCache = Session.get("listAddressCache");
        localStorage.clear();
        Session.set("dataLogin", dataLogin);
        Session.set("listAddressCache", listAddressCache);
        Route.redirect("Main", "Login");
    });

    elementProperty.getElement("#version", element => {
        cordova.getAppVersion.getVersionNumber().then(function (version) {
            element.innerHTML = `${getTextTranslate("menu","version")} ${version}`;
            if (environment.name === "test") {
                element.innerHTML += " teste";
            }
        });
    });

    elementProperty.addEventInElement("#shareApp", "onclick", function () {
        const objectLink = Session.get("configGeneral").find(item => item.key === "link_customer_pre_register");

        window.plugins.socialsharing.shareWithOptions(
            {
                message: ConfigGeneral().get("appSharingCustomerMessage"),
                subject: '',
                url: `${objectLink.value.replace("{userId}", btoa(userLogged.idUser))}`
            },
            result => {
            },
            error => {
            }
        );
    });

    elementProperty.addEventInElement("#btnBalanceClient", "onclick", function () {
        Route.redirectDynamic("Payment", "Index");
    });

    window.getBalanceClient = () => {
        customerController
            .find(userLogged.idUser)
            .then(({message, status, data}) => {
                if (!status) {
                    setTimeout(getBalanceClient, 2000);
                    return;
                }

                Session.set("currentBalanceClient", data.tripBalance);
            })
            .catch(() => {
                setTimeout(getBalanceClient, 2000)
            });
    };

    updateDataUserMenu();

    elementProperty.addEventInElement(
        "#notificationCustomer",
        "onclick",
        function () {
            elementProperty.getElement(".container-notification", element => {
                if (element.classList.contains("active")) {
                    element.classList.remove("active");
                    return;
                }

                element.classList.add("active");
            });
        }
    );

    elementProperty.addEventInElement(
        ".hidden-menu",
        "onclick",
        closeMenuDefault
    );

    window.addEventListener("click", closeMenuDefault);

    function closeMenuDefault() {
        elementProperty.getElement(".menu-close", element => {
            elementProperty.getElement(".container-menu-options", menu => {
                if (
                    element.classList.contains("open") &&
                    menu.classList.contains("active")
                ) {
                    /*element.classList.remove("open");
                              showMenu(false);
                              closeOptionsMenu();*/
                    Route.backPage();
                }
            });
        });
    }

    elementProperty.addEventInElement(
        "#containerMenuOptions",
        "onclick",
        stopPropagation
    );
    elementProperty.addEventInElement(
        ".container-logo",
        "onclick",
        stopPropagation
    );
    elementProperty.addEventInElement(
        ".history-trips",
        "onclick",
        stopPropagation
    );
    elementProperty.addEventInElement("#openProfileInsta", "onclick", function () {
        cordova.InAppBrowser.open(
            "instagram://user?username=fabrica704",
            "_system",
            "location=yes"
        );
    });

    elementProperty.addEventInElement("#openFacebookApp", "onclick", function () {
        const config = Session.get("cityConfig");
        cordova.InAppBrowser.open(config.urlFacebook, "_system", "location=yes");
    });
    elementProperty.addEventInElement("#openInstagramApp", "onclick", function () {
        const config = Session.get("cityConfig");
        cordova.InAppBrowser.open(config.urlInstagram, "_system", "location=yes");
    });

    
    function stopPropagation(event) {
        event.stopPropagation();
    }

    const config = Session.get("configGeneral");
    const titleForHome = config.find(item => { return item.key === 'title_for_home'; });

    if (titleForHome === undefined) {
        return;
    } 

    const firstName = userLogged.nickname.split(' ')[0];
    document.querySelector("#titleForHome").innerHTML = `Olá, ${firstName}! ${titleForHome.value}`;

});
