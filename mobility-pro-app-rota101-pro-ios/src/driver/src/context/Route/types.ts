export interface RoutesProps {
  getNew: (lat: number, lng: number) => any;
  getReleased: () => any;
  getOffered: () => any;
  listRoutes: ListRoutesProps[];
  requestRoute: (routeId: number) => void;
  offerRoute: (
    routeId: number,
    schedule: string,
    tripItems: any,
    seatsAvailable: number,
  ) => Promise<boolean>;
  cancelOffer: (tripReference: string) => void;
}

export interface ListRoutesProps {
  name: string;
  id: number;
  estimatedDistance: string;
  estimatedTime: string;
  active: string;
  tripReference: string;
  routeWayPoints: [
    {
      routePitStopType: string;
      tag: string;
      address: string;
    },
  ];
  driverAccept: {
    active: string;
  };
  routeTripItemTypes: [
    {
      id: number;
      name: string;
      value: string;
    },
  ];
  price: string;
  ride: {
    riders: [
      {
        id: number;
        profileImage: string;
        name: string;
        phone: string;
      },
    ];
    tripReference: string;
    schedule: string;
    rideItems: [
      {
        routeTripItemTypeId: number;
      },
    ];
  };
  destination: {
    address: string;
  };
  origin: {
    address: string;
  };
}
