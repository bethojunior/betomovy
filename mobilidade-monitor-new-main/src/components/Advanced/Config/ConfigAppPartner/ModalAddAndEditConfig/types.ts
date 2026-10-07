import * as yup from "yup";
import { schemaFormConfigApp } from "./schema";
import { ConfigsAppsPartnerProps } from "../../../../../pages/Advanced/Configs/ConfigsAppPartner/types";

export interface ModalAddAndEditConfigProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  configAppSelected: ConfigsAppsPartnerProps | null;
  setConfigAppSelected: (data: ConfigsAppsPartnerProps | null) => void;
  getConfigsAppPartner: () => void;
}

export type SchemaFormConfigApp = yup.InferType<typeof schemaFormConfigApp>;
