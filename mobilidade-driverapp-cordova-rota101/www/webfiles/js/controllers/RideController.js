class RideController {
    static new({routeId, schedule, tripItems,seatsAvailable}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                "Ride/New",
                "POST",
                {
                    routeId,
                    schedule,
                    tripItems,
                    seatsAvailable
                },
                resolve,
                reject,
                undefined,
                false
            );
        });
    }

    static cancel({tripReference, cancellationReasonsId}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("ride/cancel", "POST",
                {tripReference, cancellationReasonsId},
                resolve, reject, undefined, false);
        });
    }
}
