import { TripLongDistanceValue } from '../List/types';

export interface RewardTripLongDistance {
  value: number;
  rewardTripType: string;
}

export interface RewardCampaignTripItem {
  id: number;
  rewardTripType: string;
  value: number;
  rewardTripTypeId: number;
  tripReference: string;
  discountCouponCode?: string | null;
}

export interface BonusSectionProps {
  rewardTripLongDistance: RewardTripLongDistance | null | undefined;
  rewardCampaignTrip: RewardCampaignTripItem[] | undefined;
  tripLongDistance: TripLongDistanceValue | null | undefined;
}
