import { ReactNode } from 'react';
import { StatusBadgeVariant } from '../StatusBadge/types';

export interface TripSummaryCardProps {
  vehicleTypeLabel: string;
  dateLabel: string;
  timeLabel: string;
  statusLabel: string;
  statusVariant: StatusBadgeVariant;
  priceLabel: string;
  priceCaption: string;
  paymentMethodLabel: string;
  paymentMethodCaption: string;
  children?: ReactNode;
}
