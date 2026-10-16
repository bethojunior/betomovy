import { StatusVariant } from '../../../common/theme/statusVariantColors';

export type DriverRegisterStatusId = '1' | '2' | '3' | '4' | '5';

export interface DriverRegisterStatusInfo {
  variant: StatusVariant;
  titleKey: string;
  descriptionKey: string;
}

/** Valores reais confirmados no backend (data.sql / DriverRegisterStatusConst). */
export const DRIVER_REGISTER_STATUS_MAP: Record<DriverRegisterStatusId, DriverRegisterStatusInfo> = {
  '1': { variant: 'success', titleKey: 'driverRegisterStatus.active_title', descriptionKey: 'driverRegisterStatus.active_description' },
  '2': { variant: 'warning', titleKey: 'driverRegisterStatus.pending_title', descriptionKey: 'driverRegisterStatus.pending_description' },
  '3': { variant: 'error', titleKey: 'driverRegisterStatus.blocked_title', descriptionKey: 'driverRegisterStatus.blocked_description' },
  '4': { variant: 'warning', titleKey: 'driverRegisterStatus.awaiting_review_title', descriptionKey: 'driverRegisterStatus.awaiting_review_description' },
  '5': { variant: 'error', titleKey: 'driverRegisterStatus.blacklist_title', descriptionKey: 'driverRegisterStatus.blacklist_description' },
};

export function resolveDriverRegisterStatus(statusId?: string | null): DriverRegisterStatusInfo {
  return DRIVER_REGISTER_STATUS_MAP[statusId as DriverRegisterStatusId] ?? DRIVER_REGISTER_STATUS_MAP['4'];
}
