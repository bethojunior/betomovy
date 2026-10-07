export interface TravelContextData {
  getTravel: (
    status: boolean | string,
    page: number,
    setDataPage: (data: PageProps) => void,
  ) => Promise<any>;
  travels: TravelProps[];
  setTravels: (data: TravelProps[]) => void;
}

export interface PageProps {
  currentPage: number;
  endRange: number;
  lastPage: number;
  nextPage: number;
  previousPage: number;
  showEndButton: false;
  showStartButton: false;
  startRange: number;
  startRow: number;
  totalRows: string;
}

export interface TravelProps {
  customerName: string;
  date: string;
  dateFormatted: string;
  destinationAddress: string;
  destinationLatitude: string;
  destinationLongitude: string;
  driverName: string;
  endDate: string;
  originAddress: string;
  originLatitude: string;
  originLongitude: string;
  price: string;
  schedule: any;
  status: string;
  tripReference: string;
  tripWayPoints: any;
  type: string;
}

export type TravelContextProps = {
  children: React.ReactNode;
};
