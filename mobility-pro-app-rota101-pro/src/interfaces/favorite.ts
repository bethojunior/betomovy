export interface FavoriteTripType {
  name: string;
  tripTypeId: number;
}

export interface FavoriteDrivers {
  idFavorite: number;
  idDriver: number;
  statusDriver: string;
  driverName: string;
  driverNickname: string;
  driverImage: string;
  plate: string;
  // A API pode retornar como JSON string ou array já parseado
  tripTypes: string | FavoriteTripType[];
}
