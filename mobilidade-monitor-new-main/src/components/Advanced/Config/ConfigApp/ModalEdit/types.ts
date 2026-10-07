import { ConfigAppsProps } from "../../../../../pages/Advanced/Configs/ConfigApp/types";

export interface ModalEditProps {
  showModal: boolean;
  setShowModal: (data: boolean) => void;
  listConfigSelected: ConfigAppsProps[];
  configSelected: ConfigAppsProps | null;
  setConfigSelected: (data: ConfigAppsProps | null) => void;
  setLoading: (data: boolean) => void;
  typeModal: "driver" | "client";
  getAppConfig: () => void;
}

export interface ContentLogoProps {
  isExistsLogo: boolean;
}

export interface LogoLabelProps {
  bgImage: string;
}
