export interface DriverData {
  id: number;
  routeId: number;
  driverId: number;
  active: number;
  statusId: number;
  created_at: string;
  updated_at: string;
  route: {
    id: number;
    name: string;
  };
  driver: {
    name: string;
    phone: string;
  };
}
