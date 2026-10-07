declare type RouteDTO = {
  tripReference: string;
  polyline: string;
  time: string; //tempo por extenso
  idDriver: string;
  position: {
    lat: number;
    lng: number;
  };
  kmProgressing: number;
  minutesProgressing: number;
};

declare type LocationDTO = {
  api_token: string;
  deviceModel: ?string;
  deviceId: ?string;
  created_at: ?string;
  driverId: number;
  tripReference: ?string;
  latitude: number;
  longitude: number;
  isFromMockProvider: ?boolean;
};
