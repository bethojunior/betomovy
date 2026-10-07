let haveObservationScheduleTrip = false;

function verifyScheduledTrip(){
    if(haveObservationScheduleTrip)
        return;
    haveObservationScheduleTrip = true;

    const tripRepository = new TripRepository();
    const tripPreAcceptedRepository = new TripRepository();

    function eventTripChange(result) {
        if (result.length > 0) {
            const trip = result[0];

            if(trip.type !== tripRepository.typeAdded)
                return;

            if(trip.data.schedule != null) {

                viewController.elementProperty.addClass(".container-notification-scheduled-trip", "active");

                viewController.elementProperty.getElement("#nameDriverScheduledTrip", element => {
                    element.innerHTML = Session.getValueInSession("user", "nickname");
                });

                viewController.elementProperty.addEventInElement("#btnCloseNotificationScheduledTrip", "onclick", () => {
                    viewController.elementProperty.removeClass(".container-notification-scheduled-trip", "active");
                });

                navigator.notification.beep();
            }

            getUpdateTrip();
        }
    }

    tripRepository.checkTripAccepted(Session.getValueInSession("user", "idUser"), STATUS_ACCEPTED,eventTripChange)
    tripPreAcceptedRepository.checkTripAccepted(Session.getValueInSession("user", "idUser"), STATUS_PRE_ACCEPTED,eventTripChange)
}
