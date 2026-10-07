class DriverRideController {
  static offered() {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        "DriverRide/Offered",
        "GET",
        null,
        resolve,
        reject
      );
    });
  }
}
