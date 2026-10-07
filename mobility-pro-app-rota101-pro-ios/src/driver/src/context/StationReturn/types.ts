export interface PropsStationReturn {
  address: string;
  driverId: string;
  latitude: number;
  longitude: number;
  name: string;
  null: string;
  stationTypeId: number;
}

export interface PropsProvider {
  selectedStation: PropsStationReturn;
  setSelectedStation: (station: PropsStationReturn) => void;
  getStationReturn: () => void;
  createStationReturn: (data: PropsStationReturn) => any;
  getStationTypeAll: () => any;
  getStationReturnById: () => any;
  stationsById: any;
  updateStationReturn: (data: PropsStationReturn, idStation: number) => any;
  activeStationReturn: (idStation: string) => any;
  loading: boolean;
}
