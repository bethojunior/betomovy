import type { FormInstance } from "antd/es/form";
import type { GroupSelectOption } from "../management-wpp-scheduled-trip.types";

export interface SpecificNotificationCityRef {
  readonly id: number;
  readonly nome: string;
}

export interface SpecificNotificationTripTypeRef {
  readonly idTripType: number;
  readonly type: string;
}

export interface SpecificNotificationRow {
  readonly id: number;
  readonly group_id: string;
  readonly group_name: string;
  readonly reference: string;
  readonly message: string;
  readonly status: boolean;
  readonly cityId: number | null;
  readonly tripTypeId: number | null;
  readonly city: SpecificNotificationCityRef | null;
  readonly trip_type: SpecificNotificationTripTypeRef | null;
}

export interface TripTypeOption {
  readonly idTripType: number;
  readonly type: string;
}

export interface SpecificNotificationFormValues {
  readonly groupSelectValue: string;
  readonly cityId?: number;
  readonly tripTypeId?: number;
  readonly status: boolean;
  readonly message?: string;
}

export interface SpecificNotificationBody {
  readonly group_id: string;
  readonly group_name: string;
  readonly reference: string;
  readonly cityId: number | null;
  readonly tripTypeId: number | null;
  readonly status: boolean;
  readonly message: string;
}

export interface UseSpecificNotificationsResult {
  readonly form: FormInstance<SpecificNotificationFormValues>;
  readonly rows: SpecificNotificationRow[];
  readonly loadingRows: boolean;
  readonly saving: boolean;
  readonly deletingId: number | null;
  readonly errorBanner: string | null;
  readonly modalOpen: boolean;
  readonly editingRow: SpecificNotificationRow | null;
  readonly groupSelectOptions: GroupSelectOption[];
  readonly groupOptionsCount: number;
  readonly groupsLoadError: string | null;
  readonly groupsEmptyHint: string | null;
  readonly tripTypeOptions: TripTypeOption[];
  readonly cityOptions: readonly { readonly cityId: number; readonly nome: string }[];
  readonly openCreateModal: () => void;
  readonly openEditModal: (row: SpecificNotificationRow) => void;
  readonly closeModal: () => void;
  readonly regenerateMessage: (overrides: { cityId?: number | null; tripTypeId?: number | null }) => void;
  readonly handleSubmit: (values: SpecificNotificationFormValues) => Promise<void>;
  readonly handleDelete: (row: SpecificNotificationRow) => Promise<void>;
  readonly dismissErrorBanner: () => void;
  readonly dismissGroupsLoadError: () => void;
  readonly dismissGroupsEmptyHint: () => void;
}
