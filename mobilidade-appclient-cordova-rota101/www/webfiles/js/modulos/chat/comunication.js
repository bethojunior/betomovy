function openChat(trip) {
    Session.set("tripChat", trip);
    Route.redirectDynamic("Client", "Chat");
    InfoTrip.closeArrivalDriver();
}

function callDriver(trip) {
    location.href = "tel:" + trip.driver.phone.replace(/[^0-9\.]+/g, '');
    InfoTrip.closeArrivalDriver();
}
