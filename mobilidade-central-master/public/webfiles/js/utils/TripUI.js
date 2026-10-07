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
    const elementProperty = viewController?.elementProperty;

    if (!elementProperty) {
        return;
    }

    const method = (isFooterActive || isAddressSearchActive || isAddressPanelActive || isTripSidebarActive) ? "addClass" : "removeClass";
    elementProperty[method](".btn-call-trip", "active");

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
