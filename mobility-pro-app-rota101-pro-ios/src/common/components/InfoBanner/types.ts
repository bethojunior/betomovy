import { ReactNode } from 'react';
import { StatusVariant } from '../../theme/statusVariantColors';

export interface InfoBannerProps {
  icon: (color: string) => ReactNode;
  title: string;
  description?: string;
  variant?: StatusVariant;
}
