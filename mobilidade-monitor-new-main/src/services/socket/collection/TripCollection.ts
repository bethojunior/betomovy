import AppSocket from "../index";

interface TripsData {
  data: TripDto[];
}

export default class TripCollection {
  private onConnectWithQueryParams(query = {}) {
    return new AppSocket({ query });
  }

  getTripsByCity(cityId: string, callback: (data: TripDto[]) => void) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: "get_trips_by_city_id",
      cityId,
    });

    socketConnected.on(`trips_city_${cityId}`, ({ data }: TripsData) =>
      callback(data)
    );
  }
}
