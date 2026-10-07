Route.waitView().then(() => {
    window.addEventListener("batterystatus", result => {
        Session.set("battery", result.level, false);
        Session.set("isPlugged", result.isPlugged, false);
        if (Session.getValueInSession("user", "status") !== "corrida")
            verifyBattery(result.level);
    });

    window.verifyBattery = (battery) => {
        const elementProperty = new ElementProperty();
        if (battery <= 5) {
            const isPlugged = !Array.isArray(Session.get("isPlugged"));

            if (!isPlugged)
                elementProperty.getElement("#toggleStatusDriver", element => {
                    if (element.checked)
                        SwalCustom.messageDialog("", "Nível de bateria baixo, você não poderá receber corridas"
                            , () => {
                                activeSearchTrip(false)
                            }, "warning");
                });

            return isPlugged;
        }

        return true;
    }

});