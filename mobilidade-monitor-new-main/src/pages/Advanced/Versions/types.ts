import { ReactNode } from "react";
import { ColumnsType } from "antd/lib/table";

export interface VersionsProps {
  appId: number;
  appName: string;
  created_at: any;
  id: number;
  link: string;
  platform: string;
  statusId: number;
  updated_at: any;
  version: string;
}

export interface ListVersionsAppProps {
  appType: number;
  versions: string;
}

export interface ListVersionsAppFormatedProps {
  appType: number;
  versions: number[];
}

export interface ReturnVersionsCurrentAppsProps {
  client_final: {
    current_version_latest: ListVersionsAppProps | null;
    second_version_latest: ListVersionsAppProps | null;
  };
  driver: {
    current_version_latest: ListVersionsAppProps | null;
    second_version_latest: ListVersionsAppProps | null;
  };
  delivery: {
    current_version_latest: ListVersionsAppProps | null;
    second_version_latest: ListVersionsAppProps | null;
  };
  mobility_pro: {
    current_version_latest: ListVersionsAppProps | null;
    second_version_latest: ListVersionsAppProps | null;
  };
}

export interface DataDefaultPieChartProps {
  id: number;
  label: string;
  value: number;
}

export interface MessageAlertProps {
  readonly message: string;
  readonly color: string;
}

export interface PlatformTagProps {
  readonly color: string;
  readonly icon: ReactNode;
}

export interface UseVersionsResult {
  readonly canManageVersions: boolean;
  readonly listVersions: VersionsProps[];
  readonly loading: boolean;
  readonly setLoading: (value: boolean) => void;
  readonly loadingTable: boolean;
  readonly showModal: boolean;
  readonly setShowModal: (value: boolean) => void;
  readonly editingVersion: VersionsProps | null;
  readonly openCreateModal: () => void;
  readonly openEditModal: (version: VersionsProps) => void;
  readonly columns: ColumnsType<VersionsProps>;
  readonly currentPage: number;
  readonly totalPage: number | null;
  readonly handlePageChange: (page: number) => void;
  readonly getAllVersions: (page?: number) => Promise<void>;
  readonly isExistGraphic: boolean;
  readonly listVersionsActivesClientFinal: DataDefaultPieChartProps[];
  readonly listVersionsActivesDrivers: DataDefaultPieChartProps[];
  readonly listVersionsActivesDelivery: DataDefaultPieChartProps[];
  readonly listVersionsActivesMobilityPro: DataDefaultPieChartProps[];
  readonly switchMessageAlert: (qntVersionsActives: number) => MessageAlertProps | undefined;
}
