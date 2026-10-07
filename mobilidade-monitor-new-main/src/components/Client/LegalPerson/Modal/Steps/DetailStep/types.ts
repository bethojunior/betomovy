import * as yup from "yup";

import { SchemaFormDetailsStep } from "./schemas";
import { ObjectPerfilLegalPersonProps } from "../../Edition/types";

export type SchemaFormDetailsStepProps = yup.InferType<
  typeof SchemaFormDetailsStep
>;

export interface SecondStep {
  setCurrent: (data: number) => void;
  current: number;
  objectPerfilLegalPerson: ObjectPerfilLegalPersonProps | null;
  setObjectPerfilLegalPerson: (data: ObjectPerfilLegalPersonProps) => void;
}
