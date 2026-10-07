import * as yup from "yup";
import { schemaFormCallGroup } from "./schema";
import { ICallGroupProps } from "../../../../../pages/Advanced/Configs/CallGroup/ListCallGroups/types";

export interface IModalAddAndEditCallGroupProps {
    visible: boolean;
    setVisible: (data: boolean) => void;
    callGroupSelected: ICallGroupProps | null;
    setCallGroupSelected: (data: ICallGroupProps | null) => void;
    getCallGroups: () => void;
}

export type SchemaFormCallGroup = yup.InferType<typeof schemaFormCallGroup>;