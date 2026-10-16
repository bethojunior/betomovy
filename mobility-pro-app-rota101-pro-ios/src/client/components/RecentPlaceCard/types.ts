import {Place} from '../../hooks/place';

export interface RecentPlaceCardProps {
  place: Place;
  /** Distância já formatada (ex: "3,2 km") — calculada fora, componente é burro. */
  distanceLabel?: string;
  onPress: () => void;
  onOptionsPress: () => void;
  hasBorder?: boolean;
}
