import { TripTripRouteParam, TripDetailsResponse } from '../DetailsTrip/types';

export interface TripCalculationDetailsRouteParams {
  tripReference: string;
  trip: TripTripRouteParam;
  detailsTrip: TripDetailsResponse;
}
