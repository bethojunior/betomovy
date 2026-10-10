function isTripConfirmationScreenVisible() {
    var footerTrip = document.querySelector(".footer-container-trip");
    var footerPayment = document.querySelector(".footer-payment-form");
    var footerSchedule = document.querySelector(".footer-schedule-form");
    return (footerTrip && footerTrip.classList.contains("active")) ||
        (footerPayment && footerPayment.classList.contains("active")) ||
        (footerSchedule && footerSchedule.classList.contains("active"));
}

window.closeTripAndGoBack = function closeTripAndGoBack() {
    try {
        if (typeof mapService !== "undefined" && typeof mapService.removeRoute === "function") mapService.removeRoute();
    } catch (err) {
        console.warn("menuBase: mapService.removeRoute error", err);
    }
    try {
        if (typeof mapService !== "undefined" && typeof mapService.resetToCentralView === "function") mapService.resetToCentralView();
    } catch (err) {
        console.warn("menuBase: mapService.resetToCentralView error", err);
    }
    try {
        if (typeof initProcessingCallTrip === "function") initProcessingCallTrip(true, true);
    } catch (err) {
        console.warn("menuBase: initProcessingCallTrip error", err);
    }
    try {
        if (typeof verifyListTripActivePartner === "function") verifyListTripActivePartner();
    } catch (err) {
        console.warn("menuBase: verifyListTripActivePartner error", err);
    }
    if (typeof managerTripViewCurrent !== "undefined") managerTripViewCurrent.isVisible = true;
    var btn = document.getElementById("optionMenu");
    if (btn) btn.classList.remove("open");
    var footerTrip = document.querySelector(".footer-container-trip");
    var footerPayment = document.querySelector(".footer-payment-form");
    var footerSchedule = document.querySelector(".footer-schedule-form");
    if (footerTrip) footerTrip.classList.remove("active");
    if (footerPayment) footerPayment.classList.remove("active");
    if (footerSchedule) footerSchedule.classList.remove("active");
    var containerLogo = document.querySelector(".container-logo");
    if (containerLogo) containerLogo.classList.remove("remove");
    var mapWrapper = document.getElementById("mapWrapper");
    if (mapWrapper) mapWrapper.classList.remove("active", "in-trip");
    var btnCancelProcessing = document.querySelector(".btn-cancel-processing-trip");
    if (btnCancelProcessing) btnCancelProcessing.classList.remove("active");
    var containerMenu = document.querySelector(".container-menu");
    if (containerMenu) containerMenu.classList.add("active");
    if (containerLogo) containerLogo.classList.add("active");
    if (typeof Route !== "undefined" && typeof Route.backPage === "function") Route.backPage();
    try {
        if (typeof scheduleMapResize === "function") scheduleMapResize();
    } catch (err) {
        console.warn("menuBase: scheduleMapResize error", err);
    }
};

document.addEventListener("DOMContentLoaded", function () {

    const elementProperty = new ElementProperty();
    const WHATSAPP_CONFIG_KEY = 'enable_whatsapp_central';
    const WHATSAPP_GROUP_CONFIG_KEY = 'enable_whatsapp_group_central';

    function handleOptionMenuClick(e, menuCloseElement) {
        var menuClose = menuCloseElement || (e && e.target && e.target.closest ? e.target.closest("#optionMenu") : null);
        if (!menuClose) return;
        e.stopPropagation();
        e.preventDefault();
        var shouldCloseTrip = menuClose.classList.contains("open") || isTripConfirmationScreenVisible();
        if (shouldCloseTrip) {
            closeTripAndGoBack();
            return;
        }
        optionOpenMenu.call(menuClose, e);
    }

    document.addEventListener("click", function (e) {
        var menuClose = e.target.closest("#optionMenu");
        if (!menuClose) return;
        e.stopPropagation();
        e.preventDefault();
        handleOptionMenuClick(e, menuClose);
    }, true);

    elementProperty.addEventInElement("#selectCentralChange", "onchange", function () {
        const centralId = Session.get("centralSelected")?.id;
        if (centralId) {
            sessionStorage.removeItem(`${WHATSAPP_CONFIG_KEY}_${centralId}`);
        }
        Session.set("centralSelected", (JSON.parse(this.value)));
        location.reload()
    });

    window.updateDataUserMenu = function () {
        const userLogged = Session.get('user');
        const keyAppPartner = JSON.parse(localStorage.getItem("keyAppPartner"));

        elementProperty.getElement("#nameUser", element => {
            element.innerHTML = userLogged.nickname;
        });

        elementProperty.getElement("#appPartnerName", element => {
            if (!keyAppPartner) {
                element.innerHTML = "";
                element.style.display = "none";
                return;
            }

            element.innerHTML = `App parceiro: ${keyAppPartner.toLocaleUpperCase()}`;
            element.style.display = "block";
        });
    };

    function optionOpenMenu(e) {
        e.stopPropagation();
        showMenu();

        Route.startClassesInComponent([
            {component: ".menu-close", class: "open"}
        ], () => {
            this.classList.remove("open");
            showMenu(false);
            closeOptionsMenu();
        });

    }

    function isMenuItemVisible(li) {
        const isHidden = li.style.display === 'none' || window.getComputedStyle(li).display === 'none';
        if (isHidden) return false;
        return li.textContent.trim().length > 0 || li.querySelector('a, button') !== null;
    }

    function applyMenuItemStagger() {
        const menu = document.getElementById('menuOptionUser');
        if (!menu) return;
        let visibleIndex = 0;
        Array.from(menu.children).forEach((li) => {
            li.style.removeProperty('opacity');
            li.style.removeProperty('transition-delay');
            if (!isMenuItemVisible(li)) return;
            visibleIndex += 1;
            li.style.transitionDelay = `${(0.16 + visibleIndex * 0.04).toFixed(2)}s`;
        });
    }

    function resetMenuItemStagger() {
        const menu = document.getElementById('menuOptionUser');
        if (!menu) return;
        Array.from(menu.children).forEach((li) => {
            li.style.removeProperty('opacity');
            li.style.removeProperty('transition-delay');
        });
    }

    function showMenu(result = true) {
        elementProperty.getElement(".container-menu-options", element => {
            if (result) {
                const inner = document.getElementById('containerMenuOptions');
                if (inner) inner.scrollTop = 0;
                element.classList.add("active");
                applyMenuItemStagger();
                return;
            }
            element.classList.remove("active");
            resetMenuItemStagger();
        });
    }

    function executeCloseMenuDrawer() {
        showMenu(false);
        const optionMenu = document.getElementById("optionMenu");
        if (optionMenu) {
            optionMenu.classList.remove("open");
        }
    }

    window.closeMenuDrawer = executeCloseMenuDrawer;

    function handleMenuDrawerCloseClick(e) {
        e.stopPropagation();
        e.preventDefault();
        executeCloseMenuDrawer();
    }

    function handleMenuDrawerCloseKeydown(e) {
        if (e.key !== "Enter" && e.key !== " ") {
            return;
        }
        e.preventDefault();
        executeCloseMenuDrawer();
    }

    elementProperty.addEventInElement("#btnCloseMenuDrawer", "onclick", handleMenuDrawerCloseClick);
    elementProperty.addEventInElement("#btnCloseMenuDrawer", "onkeydown", handleMenuDrawerCloseKeydown);

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

    elementProperty.getElement("#registerClient", function (element) {
        element.onclick = function (event) {
            event.stopPropagation();
            if (document.querySelector(".modal-create-customer")) {
                viewController.elementProperty.addClass(".modal-create-customer", "active");
                document.querySelector("#nameCustomer")?.focus();
            } else {
                window.location.href = "/customer/new";
            }
        }
    });

    elementProperty.getElement(".menu-option", function (element) {
        element.onclick = function () {
            const icon = this.querySelector(".menu-accordion-btn");
            if (this.classList.contains("active") && icon?.classList.contains("active")) {
                this.classList.remove("active");
                icon?.classList.remove("active");
                return;
            }
            this.classList.add("active");
            icon?.classList.add("active");
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

    elementProperty.addEventInElement("#logout", 'onclick', function () {
        Session.delete("user");
        localStorage.removeItem("keyAppPartner");
        window.reload(true);
    });


    elementProperty.addEventInElement("#btnBalanceClient", "onclick", function () {
        Route.redirectDynamic("Payment", "Index")
    });


    window.getBalanceClient = () => {
        /*customerController.find(userLogged.idUser).then(({message, status, data}) => {
            if (!status) {
                getBalanceClient();
                return;
            }

            Session.set("currentBalanceClient", data.tripBalance);
        }).catch(getBalanceClient);*/
    };

    function getWhatsappCacheKey() {
        const centralId = Session.get('centralSelected')?.id;
        return centralId ? `${WHATSAPP_CONFIG_KEY}_${centralId}` : WHATSAPP_CONFIG_KEY;
    }

    function isWhatsappConfigEnabled(status, response) {
        if (!status) return false;
        if (response === '0' || response === 0 || response === false) return false;
        return true;
    }

    function isOnWhatsappRoute() {
        return window.location.pathname.includes('/whatsapp');
    }

    function setWhatsappMenuVisible(isVisible) {
        const shouldShow = isVisible || isOnWhatsappRoute();
        const menuItem = document.getElementById('menuItemWhatsapp');
        if (menuItem) {
            menuItem.style.display = shouldShow ? '' : 'none';
            menuItem.dataset.whatsappEnabled = isVisible ? '1' : '0';
            if (shouldShow && document.querySelector('.container-menu-options')?.classList.contains('active')) {
                applyMenuItemStagger();
            }
        }
        const btn = document.getElementById('showWhatsappTripActive');
        if (btn) btn.style.display = isVisible ? 'inline-flex' : 'none';
    }

    function applyWhatsappGroupVisibility(isVisible) {
        const groupContainer = document.getElementById('container-whatsapp-group');
        if (groupContainer) groupContainer.style.display = isVisible ? '' : 'none';
    }

    function whatsappIsEnable() {
        const cacheKey = getWhatsappCacheKey();
        const cachedValue = sessionStorage.getItem(cacheKey);
        if (cachedValue === '1') setWhatsappMenuVisible(true);
        if (cachedValue === '0') setWhatsappMenuVisible(false);

        const menuItem = document.getElementById('menuItemWhatsapp');
        if (menuItem?.dataset.whatsappEnabled === '1') {
            setWhatsappMenuVisible(true);
        }

        if (typeof ConfigRepository === 'undefined') {
            console.warn('menuBase: ConfigRepository indisponível — visibilidade do WhatsApp veio do servidor/cache');
            return;
        }

        ConfigRepository.getConfigBykey(WHATSAPP_CONFIG_KEY)
            .then(({ status, response }) => {
                const isEnabled = isWhatsappConfigEnabled(status, response);
                sessionStorage.setItem(cacheKey, isEnabled ? '1' : '0');
                setWhatsappMenuVisible(isEnabled);
                if (!isEnabled) return;

                ConfigRepository.getConfigBykey(WHATSAPP_GROUP_CONFIG_KEY)
                    .then(({ status: groupStatus, response: groupResponse }) => {
                        applyWhatsappGroupVisibility(isWhatsappConfigEnabled(groupStatus, groupResponse));
                    })
                    .catch(() => applyWhatsappGroupVisibility(false));
            })
            .catch(() => {
                if (cachedValue === null && menuItem?.dataset.whatsappEnabled !== '1' && !isOnWhatsappRoute()) {
                    setWhatsappMenuVisible(false);
                }
            });
    }

    function antiUberIsEnable() {
        ConfigRepository.getConfigBykey('enable_anti_uber_central').then(({ status, response }) => {
            if (!status || response === '0') return;

            const container = document.getElementById('container-anti-uber');
            if (container) container.style.display = '';
        });
    }

    updateDataUserMenu();
    whatsappIsEnable();
    antiUberIsEnable();

    elementProperty.addEventInElement("#notificationCustomer", "onclick", function () {
        elementProperty.getElement(".container-notification", element => {
            if (element.classList.contains("active")) {
                element.classList.remove("active");
                return;
            }

            element.classList.add("active");
        });
    });

    elementProperty.addEventInElement(".hidden-menu", 'onclick', closeMenuDefault);

    window.addEventListener("click", closeMenuDefault);

    function closeMenuDefault() {
        elementProperty.getElement(".menu-close", element => {
            elementProperty.getElement(".container-menu-options", menu => {
                if (element.classList.contains("open") && menu.classList.contains("active")) {
                    Route.backPage();
                }

            });
        });
    }

    elementProperty.addEventInElement("#containerMenuOptions", "onclick", stopPropagation);
    elementProperty.addEventInElement(".container-logo", "onclick", stopPropagation);
    elementProperty.addEventInElement(".history-trips", "onclick", stopPropagation);

    function stopPropagation(event) {
        event.stopPropagation();
    }

    const currCentral = Session.get("centralSelected");
    if (currCentral && currCentral.id) {
        CentralRepository.get(currCentral.id)
            .then(({message, status, response}) => {
                if (!status || !response)
                    return;

                Session.set("centralSelected", response);

                if (response.centralCallDriver !== "only_app") {
                    const menuItemDriver = document.querySelector("#menuItemDriver");
                    if (menuItemDriver) {
                        menuItemDriver.innerHTML = `
                            <div><a href="/driver/list"><i class="material-icons nav-icon">person</i>Motoristas</a></div>
                        `;
                    }
                    if (document.querySelector('.container-menu-options')?.classList.contains('active')) {
                        applyMenuItemStagger();
                    }
                }

            }).catch(e => {
                console.warn("Could not fetch central details", e);
            });
    }
});
