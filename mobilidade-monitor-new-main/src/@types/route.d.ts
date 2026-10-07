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
