import {TripInfo, TollProps} from '../Trip/types';

export interface TripStatusContextType {
  clearDataTrip: () => Promise<void>;
  getDistanceLocation: (
    location1: positionProps,
    location2: positionProps,
  ) => Promise<number>;
  informArrival: () => Promise<any>;
  showArrivalDriver: () => Promise<any>;
  initTrip: () => Promise<boolean | ''>;
  confirmStop: () => Promise<boolean | ''>;
  finishTrip: (trip?: TripInfo) => Promise<boolean | void>;
  previewFinishTrip: (trip?: TripInfo) => Promise<boolean | void>;
  confirmFinishTrip: (trip?: TripInfo) => Promise<boolean>;
  checkStatusTrip: () => Promise<any>;
  statusTrip: string;
  setStatusTrip: (statusTrip: string) => void;
  hasRecalculation: boolean;
  finishTripRecalculated: (
    chooseRecalc: boolean,
    trip?: TripInfo,
    completeTripAfterRecalc?: boolean,
  ) => Promise<boolean>;
  recalculated: RecalculatedProps;
  confirmRecalcPrice: (priceValue: number, chooseRecalc: boolean) => void;
  resetRecalcPrice: () => void;
  getSavedRecalcPrice: () => { priceValue: number; chooseRecalc: boolean } | null;
  countTakeVolume: number;
  setCountTakeVolume: (countTakeVolume: number) => void;
  buttonTargetVisibility: boolean;
  setButtonTargetVisibility: (val: boolean) => void;
  metersRound: number;
  minutesTraveled: number;
  mountTripPreAccepted: (trip: TripInfo, tripOnly?: TripInfo) => Promise<void>;
  restoreRecalculation: () => void;
  resetRecalculation: () => void;
  cancelPreviewFinishTrip: () => void;
  waitingFees: () => Promise<void>;
  shouldShowFinishModal: boolean;
  setShouldShowFinishModal: (val: boolean) => void;
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
  tolls?: TollProps[];
  tollsValue?: number;
}
