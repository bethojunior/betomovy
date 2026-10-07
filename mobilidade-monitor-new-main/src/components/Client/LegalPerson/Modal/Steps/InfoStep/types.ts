import * as yup from "yup";
import { SchemaFormInfoStep } from "./schemas";

import { ObjectPerfilLegalPersonProps } from "../../Edition/types";

export type SchemaFormInfoStepProps = yup.InferType<typeof SchemaFormInfoStep>;

interface CityData {
  estado: number;
  id: number;
  nome: string;
  shortName: string | null;
}

interface StateData {
  countryId: number;
  id: number;
  name: string;
  sigla: string;
  statusId: number;
}

export interface FirstStep {
  setCityList: (res: CityData[]) => void;
  cityList: CityData[] | undefined;
  setCitySelected: (res: number | null) => void;
  setLoadingProps: (res: boolean) => void;
  stateList: StateData[] | undefined;
  current: number;
  setCurrent: (data: number) => void;
  stateSelected: number | null;
  objectPerfilLegalPerson: ObjectPerfilLegalPersonProps | null;
  setObjectPerfilLegalPerson: (data: ObjectPerfilLegalPersonProps) => void;
  isEdit: boolean;
}
