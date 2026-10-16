import { TravelProps } from '../../contexts/travel/types';

export type { TripStatusVariant } from '../../../common/components/TripListCard/types';

export interface TripListCardProps {
  trip: TravelProps;
  isSpeedMob?: boolean;
}
