import {TripProps} from '../../contexts/Trip/types';

export interface TripPartnerCardProps {
  trip: TripProps;
  setVisible: (val: boolean) => void;
}
