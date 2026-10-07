import { ListClient } from "../../../components/Client/PhysicalPerson/Modal/Edition/type";

export interface GeneralInterface {
  data: Record<string, unknown>;
  errors: string;
  message: string;
  status: boolean;
}

export interface DependentsInterface {
  document: string;
  email: string;
  idUser: number;
  name: string;
  phone: string;
  relationShip: string;
}

export type DependentsClientData = DependentsInterface[];

export interface StatusDocumentData {
  id: number;
  name: string;
}

export type StatusDocument = StatusDocumentData[];

export interface StatusToSearchData {
  idCustomerRegisterStatus: number;
  name: string;
}

export type StatusToSearchInterface = StatusToSearchData[];

export type ListClientFormProps = ListClient;

export type ClientPhysicalSearchBy = "name" | "email" | "document" | "phone" | "documents";

export interface UseClientPhysicalSearchReturn {
  infosListClient: ListClient[] | undefined;
  loading: boolean;
  hasPagination: boolean;
  filters: {
    search: string;
    radio: ClientPhysicalSearchBy;
    status: import("antd/lib/select").SelectValue;
    forceSelected: string;
    patentSelected: string;
  };
  setSearch: (value: string) => void;
  setRadio: (value: ClientPhysicalSearchBy) => void;
  setStatus: (value: import("antd/lib/select").SelectValue) => void;
  setForceSelected: (value: string) => void;
  setPatentSelected: (value: string) => void;
  onSearch: (page?: number) => void;
  fetchMore: () => void;
  setInfosListClient: React.Dispatch<React.SetStateAction<ListClient[] | undefined>>;
}
