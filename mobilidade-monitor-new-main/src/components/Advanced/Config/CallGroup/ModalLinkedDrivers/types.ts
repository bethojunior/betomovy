import * as yup from "yup";
import { schemaLinkedDrivers } from "./schema";
import { ICallGroupProps } from "../../../../../pages/Advanced/Configs/CallGroup/ListCallGroups/types";

export interface IModalLinkedDriversProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  callGroupSelected: ICallGroupProps | null;
  getCallGroups: () => void;
}

export type SchemaLinkedDrivers = yup.InferType<typeof schemaLinkedDrivers>;
