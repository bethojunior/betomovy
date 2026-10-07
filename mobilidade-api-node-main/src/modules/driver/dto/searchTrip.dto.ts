export class SearchTripDto {
  driverId: number;
  listTripsDenied: Array<string>;
  tripReference?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
