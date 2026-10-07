function enableInputAddress() {
    viewController.elementProperty.getElement("#destination", element => element.disabled = false);
    viewController.elementProperty.getElement("#origin", element => element.disabled = false);
}

function changeOrigin() {
    enableInputAddress();
    backInfoDestination();
    viewController.elementProperty.getElement("#origin", element => {
        element.value = "";
        element.focus();
    })
}

function changeDestination() {
    enableInputAddress();
    backInfoDestination();
    viewController.elementProperty.getElement("#destination", element => {
        element.value = "";
        element.focus();
    })
}

function backInfoDestination() {
    viewController.elementProperty.getElement("#callRunning", element => {
        element.setAttribute("class", "container-logo active");
    });
    viewController.elementProperty.getElement(".footer-container-trip", element => {
        element.classList.remove("active");
        updateBtnCallTripVisibility();
    });
    viewController.elementProperty.getElement("#mapWrapper", element => {
        element.classList.remove("active");
    });
    scheduleMapResize();
    viewController.elementProperty.getElement(".footer-payment-form", element =>
        element.classList.remove("active"));
}