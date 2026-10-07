import AppSocket from "../index";

interface DriverData {
  data: Driver[];
}

export default class DriverCollection {
  private onConnectWithQueryParams(query = {}) {
    return new AppSocket({ query });
  }

  getDriverLocationsByCityID(cityId: string, callback: (data: Driver[]) => void) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "driver",
      type: "get_location_by_city_id",
      cityId,
    });

    socketConnected.on(`driver_locations_${cityId}`, ({ data }: DriverData) =>
      callback(data)
    );
  }
}
