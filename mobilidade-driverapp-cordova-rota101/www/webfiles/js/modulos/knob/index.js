Route.waitView().then(() => {
    viewController.elementProperty.addEventInElement("#btnKnobManual", "onclick", () => {
        Route.redirectDynamic("Knob", "CreateTrip");
    });

    viewController.elementProperty.addEventInElement(".container-qrcode-driver", "onclick", function () {
        if (this.classList.contains("active")) {
            if (mapService.map != null)
                mapService.setControllerMap(true);
            this.classList.remove("active");
            return;
        }

        if (mapService.map != null)
            mapService.setControllerMap(false);
        this.classList.add("active");
    });

    viewController.elementProperty.addEventInElement(".close-modal-qrcode", "onclick", function (event) {
        event.stopPropagation();
        if (mapService.map != null)
            mapService.setControllerMap(true);
        document.querySelector(".container-qrcode-driver").classList.remove("active");
    });

});
