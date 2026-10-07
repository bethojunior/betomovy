export interface MyTravelContextProps {
  getTrips: (
    status?: string,
    page?: number,
    date?: string,
    setDataPage?: any,
  ) => Promise<any>;
  getTrip: (tripReference: string) => Promise<any>;
  trips: MyTripProps[];
  setTrips: (trips: MyTripProps[]) => void;
  reportTrip: (tripReference: string, message: string) => Promise<any>;
}

export interface MyTripProps {
  address: string;
  colorAudit: string;
  date: string;
  destiny: string;
  driverId: string;
  establishmentId: any | null;
  idTrip: string;
  oldPrice: any | null;
  originAddress: string;
  originId: string;
  paymentForm: string;
  price: number;
  situation: string;
  stationId: null;
  status: string;
  tripAuditId: number;
  tripReference: string;
}
