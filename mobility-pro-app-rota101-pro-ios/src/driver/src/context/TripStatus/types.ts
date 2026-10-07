import {TripInfo} from '../Trip/types';

export interface TripStatusContextType {
  clearDataTrip: () => void;
  getDistanceLocation: (
    location1: positionProps,
    location2: positionProps,
  ) => Promise<number>;
  informArrival: () => Promise<any>;
  showArrivalDriver: () => Promise<any>;
  initTrip: () => Promise<boolean | ''>;
  confirmStop: () => Promise<boolean | ''>;
  finishTrip: (trip?: TripInfo) => Promise<boolean | void>;
  checkStatusTrip: () => Promise<
    | {callback: string | boolean; status: string; waypoint?: undefined}
    | {callback: string | boolean; status: string; waypoint: boolean}
  >;
  statusTrip: string;
  setStatusTrip: (statusTrip: string) => void;
  hasRecalculation: boolean;
  finishTripRecalculated: (chooseRecalc: boolean) => Promise<boolean>;
  recalculated: RecalculatedProps;
  onlyFinishTripOffline: (trip: TripInfo) => Promise<void>;
  countTakeVolume: number;
  setCountTakeVolume: (countTakeVolume: number) => void;
  buttonTargetVisibility: boolean;
  setButtonTargetVisibility: (val: boolean) => void;
  metersRound: number;
  minutesTraveled: number;
  mountTripPreAccepted: (trip: TripInfo, tripOnly?: TripInfo) => Promise<void>;
  initTripsActive: () => Promise<void>;
}

export interface TripStatusContextChildren {
  children: React.ReactNode;
}

interface positionProps {
  latitude: number;
  longitude: number;
}

export interface RecalculatedProps {
  price: number;
  km: number;
  minute: number;
}
