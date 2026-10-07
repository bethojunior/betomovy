import {LocationObject} from 'expo-location';
import {Fare, Trip} from '~/interfaces/trip';

export interface TaximeterContextProps {
  trip: Trip;
  isPaused: boolean;
  updatePrice: (price: number) => void;
  restoreTrip: (trip: Trip) => void;
  clearTrip: () => void;
  start: (tripTypeId: string, priceId: string, multiplierDynamic: string, location: LocationObject) => Promise<Trip>;
  stop: (distance: number, price: number) => Promise<any>;
  updateMetrics: (distance: number, estimatedTime: number, price: number) => Promise<void>;
  updateRouteDistance: (latitude: number, longitude: number) => number;
  getPrices: (tripTypeId: string, location: LocationObject) => Promise<Fare>;
  clearStorage: () => void;
  pause: () => void;
  resume: () => void;
}
