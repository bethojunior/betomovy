function updateLocation() {
    Position.getPosition(position => {
        Session.setLocal("location", {lat: position.coords.latitude, lng: position.coords.longitude});
    });
}