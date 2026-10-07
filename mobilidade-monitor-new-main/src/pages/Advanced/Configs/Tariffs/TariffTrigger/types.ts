export interface PriceDynamicScheduledProps {
  city: string;
  cityId: number;
  endDate: Date;
  id: number;
  multiplierValue: number;
  startDate: Date;
  statusId: Date;
  tag: string;
  tripType: string;
  tripTypeId: number;
}

export interface TripTypesProps {
  tripTypeId: number;
  id?: number;
  type: string;
}
