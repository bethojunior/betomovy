import { EstablishmentsProps } from "../../../../pages/Delivery/RegisterEstablishments/types";

export interface RegisterTableProps {
  tableLoading: boolean;
  loadingText: string;
  listEstablishments: EstablishmentsProps[];
  openLocals: (companyId: number) => void;
  changeStatus: (values: EstablishmentsProps, isMenu: boolean) => void;
  openModalEdit: (values: EstablishmentsProps) => void;
}
