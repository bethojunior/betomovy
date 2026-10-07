import { ReactNode } from 'react';

export interface PartnerCardProps {
  label: string;
  name: string;
  photoUrl?: string | null;
  rating?: number | string | null;
  tripsCount?: number | null;
  tripsCountLabel?: string;
  children?: ReactNode;
}
