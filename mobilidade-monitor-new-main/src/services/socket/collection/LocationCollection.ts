import AppSocket from "../index";

export default class LocationCollection {
  private onConnectWithQueryParams(query = {}) {
    return new AppSocket({ query });
  }

  getLocationsByTripReference(tripReference: string, callback: (data: RouteDTO) => void) {
    console.log("teadadqewqweqweqwe21", tripReference)
    const socketConnected = this.onConnectWithQueryParams({
      tripReference
    });

    socketConnected.on(`location-${tripReference}`, ( data: RouteDTO ) =>
      callback(data)
    );
  }
}
