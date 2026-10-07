viewController.setObserver("delivery-occurrence", function () {
    const order = Session.get("orderDeliverySelected");
    const {lat: latitude, lng: longitude} = Session.get("lastPosition");
    document.querySelector("#textDeliveryOccurrence").value = "";

    viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement("#btnSendDeliveryOccurrence", "onclick", function () {
        const message = document.querySelector("#textDeliveryOccurrence").value;

        if (message.trim().length === 0)
            return SwalCustom.messageDialog("", "Descreva sua ocorrência");

        const deliveryOrderId = order.id;

        this.disabled = true;

        DeliveryOrderController.occurrence({message, deliveryOrderId, latitude, longitude}).then(() => {
            this.disabled = false;

            document.querySelector("#textDeliveryOccurrence").value = "";

            Route.backPage();

            SwalCustom.messageDialog("", "Ocorrência enviada", undefined, "success");
        })
    });
});
