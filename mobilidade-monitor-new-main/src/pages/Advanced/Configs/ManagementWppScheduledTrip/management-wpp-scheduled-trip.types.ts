import type { FormInstance } from "antd/es/form";

export interface ManagementWppNotificationRow {
  readonly id: number;
  readonly group_id: string;
  readonly group_name: string;
  readonly reference: string;
  readonly message: string;
  readonly status: boolean;
  readonly cityId: number | null;
  readonly tripTypeId: number | null;
  readonly created_at: string | null;
  readonly updated_at: string | null;
}

export interface WhatsAppGroupOption {
  readonly groupId: string;
  readonly groupName: string;
}

export interface ManagementWppNotificationPutBody {
  readonly group_id: string;
  readonly group_name: string;
  readonly status: boolean;
}

export interface ManagementWppNotificationPutInput {
  readonly groupId: string;
  readonly groupName: string;
  readonly status: boolean;
}

export interface ManagementWppScheduledTripFormValues {
  readonly status: boolean;
}

export interface GroupSelectOption {
  readonly value: string;
  readonly label: string;
}

export interface WhatsappGroupPreview {
  readonly groupId: string;
  readonly groupName: string;
}

export interface UseManagementWppScheduledTripResult {
  readonly form: FormInstance<ManagementWppScheduledTripFormValues>;
  readonly loadingPage: boolean;
  readonly saving: boolean;
  readonly activeRow: ManagementWppNotificationRow | null;
  readonly whatsappMainSelectValue: string | undefined;
  readonly onWhatsappMainSelectChange: (value: string | null | undefined) => void;
  readonly errorBanner: string | null;
  readonly groupsLoadError: string | null;
  readonly groupsEmptyHint: string | null;
  readonly selectOptions: GroupSelectOption[];
  readonly groupOptionsCount: number;
  readonly handleSubmit: (values: ManagementWppScheduledTripFormValues) => Promise<void>;
  readonly dismissErrorBanner: () => void;
  readonly dismissGroupsLoadError: () => void;
  readonly dismissGroupsEmptyHint: () => void;
}
