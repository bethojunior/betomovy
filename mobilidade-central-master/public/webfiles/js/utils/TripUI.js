function updateBtnCallTripVisibility() {
    const footer = document.querySelector(".footer-container-trip");
    const isFooterActive = footer?.classList.contains("active");
    const isAddressSearchActive = document
        .querySelector(".container-search-local")
        ?.classList.contains("active");
    const isAddressPanelActive = document
        .querySelector(".container-menu")
        ?.classList.contains("active");
    const isTripSidebarActive = document
        .querySelector(".list-trips-active-partner")
        ?.classList.contains("active");
    const isSearchingDriverActive = document
        .querySelector(".search-driver-in-trip")
        ?.classList.contains("active");
    const isTripClientActive = document
        .querySelector(".trip-client")
        ?.classList.contains("active");
    const isTripInProgress = typeof managerTrip !== "undefined" && (Boolean(managerTrip?.isSearch) || Boolean(managerTrip?.tripCurrent));

    const elementProperty = viewController?.elementProperty;

    if (!elementProperty) {
        return;
    }

    const shouldHide = isFooterActive || isAddressSearchActive || isAddressPanelActive || isTripSidebarActive || isSearchingDriverActive || isTripClientActive || isTripInProgress;
    const method = shouldHide ? "addClass" : "removeClass";
    elementProperty[method](".btn-call-trip", "active");

    const btnCallTripEl = document.querySelector(".btn-call-trip");
    if (btnCallTripEl) {
        if (shouldHide) {
            btnCallTripEl.style.setProperty("display", "none", "important");
            btnCallTripEl.style.setProperty("visibility", "hidden", "important");
            btnCallTripEl.style.setProperty("pointer-events", "none", "important");
        } else {
            btnCallTripEl.style.removeProperty("display");
            btnCallTripEl.style.removeProperty("visibility");
            btnCallTripEl.style.removeProperty("pointer-events");
        }
    }

    if (method === "addClass" && typeof FooterMonitorManager !== "undefined" && FooterMonitorManager.isExpanded()) {
        FooterMonitorManager.collapse();
    }
    elementProperty[method](".footer-monitoring-trip", "hidden-by-overlay");
}

function scheduleMapResize(delayMs = 700) {
    if (typeof mapService === "undefined" || !mapService.resizeMap) {
        return;
    }
    mapService.resizeMap();
    setTimeout(() => mapService.resizeMap(), delayMs);
}
