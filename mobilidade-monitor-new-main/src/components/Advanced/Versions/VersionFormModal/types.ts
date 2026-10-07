import { VersionsProps } from "../../../../pages/Advanced/Versions/types";

export type VersionFormMode = "create" | "edit";

export interface AppProps {
  idApp: number;
  name: string;
}

export interface AppOption {
  label: string;
  value: number;
}

export interface VersionFormValues {
  idApp: string | null;
  platform: string | null;
  linkApp: string;
  versionApp: string;
}

export interface VersionPayload {
  appId: string;
  platform: string;
  link: string;
  version: string;
}

export interface VersionFormModalProps {
  mode: VersionFormMode;
  initialValues?: VersionsProps | null;
  showModal: boolean;
  setShowModal: (data: boolean) => void;
  getAllVersions: () => void;
  setLoading: (data: boolean) => void;
  listVersions: VersionsProps[];
}
