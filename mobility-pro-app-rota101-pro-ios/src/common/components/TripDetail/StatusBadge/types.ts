import { StatusVariant } from '../../../theme/statusVariantColors';

export type StatusBadgeVariant = StatusVariant;

export interface StatusBadgeProps {
  label: string;
  variant: StatusBadgeVariant;
}
