const managerEventConfigLoad = {
    isLoad: false,
};

function handleKnobTrip({ data, type }) {
    if (tripRealtime && type === tripRealtime.typeAdded) {
        updateTripDriver();
    }
}

Session.observeStorage("cityConfig", () => {
    const user = Session.get("user");
    const cityId = Session.getValueInSession("cityConfig", "cityId");

    if (!cityId || !user) return;

    if (!managerEventConfigLoad.isLoad) {
        if (tripRealtime) {
            tripRealtime.getKnobTrip(user?.idDriver, handleKnobTrip);
            initSearchTripOffer();
            initListFreightAccepted();
        }
        initSummaryTrip(user, cityId);
        initListTripOffers();
        managerEventConfigLoad.isLoad = true;
    }
});
