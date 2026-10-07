import {
  AlertType,
  EstablishmentsList,
} from "../../../../../pages/Delivery/Config/Establishments/types";

export interface SectionsTableProps {
  getAll: () => void;
  listEstablishments: EstablishmentsList[];
  tableLoading: boolean;
  setTableLoading: (val: boolean) => void;
  loadingText: string;
  sendAlert: (message: string, type: AlertType) => void;
  setEditValues: (val: any) => void;
  setOpen: (val: boolean) => void;
  setIsEdit: (val: boolean) => void;
  getSection: (id: number) => void;
}
