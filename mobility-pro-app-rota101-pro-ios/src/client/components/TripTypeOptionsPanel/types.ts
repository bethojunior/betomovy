import { ReactElement } from 'react';

export interface TripTypeImage {
  picture?: string;
  name?: string;
  description?: string;
}

export interface TripTypeOption {
  tripTypeId: number;
  tag?: string;
  estimatedTripTime?: string | number;
  tripType?: TripTypeImage;
}

export interface TripTypeOptionsPanelProps {
  title: string;
  isLoading: boolean;
  options: any[];
  renderOptionItem: ({ item }: { item: any }) => ReactElement | null;
  onPressInfo: () => void;
}
