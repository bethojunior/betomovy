class FreightController {
    static acceptScheduled(tripReference, driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `Freight/acceptScheduled`, `POST`,
                {tripReference, driverId}, resolve, reject,undefined,false);
        })
    }
}