import { Data } from "../../../../../pages/Client/Legal/type";

export interface StateData {
  countryId: number;
  id: number;
  name: string;
  sigla: string;
  statusId: number;
}

export interface CityData {
  estado: number;
  id: number;
  nome: string;
  shortName: string | null;
}

export interface ModalProps {
  visibility: boolean;
  closeModal: () => void;
  legalId: number;
  data: Data | null;
  setData: (data: Data | null) => void;
  registerOrEdit: boolean;
  handleSearchProps: () => void;
  stateList: StateData[] | undefined;
  cityList: CityData[] | undefined;
  setCityList: (res: CityData[]) => void;
  stateSelected: number | null;
  setStateSelected: (res: number) => void;
  citySelected: number | null;
  setCitySelected: (res: number | null) => void;
}

export interface LocalArrayData {
  user: {
    userId: number | undefined;
    name: string;
    email: string;
  };
}

export interface WorkerksProps {
  userId: number | undefined;
  name: string;
  email: string;
}

export interface WorkersData {
  companyId: number;
  created_at: string;
  id: number;
  isBlocked: number;
  isManager: number;
  statusId: number;
  updated_at: string;
  user: {
    document: string;
    email: string;
    idUser: number;
    name: string;
    phone: string;
  };
  userId: number;
}
export interface ObjectPerfilLegalPersonProps {
  address: string;
  billingDay: number | string | null;
  cityId: string;
  document: string;
  email: string;
  facebook: string;
  fantasyName: string;
  id: number | null;
  instagram: string;
  name: string;
  observation: string;
  phone: string;
  registration: string;
  site: string | undefined;
  voucherLimit: number | string | null;
  workers: any;
}
