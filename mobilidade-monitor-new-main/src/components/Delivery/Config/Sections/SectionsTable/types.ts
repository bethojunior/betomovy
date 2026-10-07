import {
  AlertType,
  SectionsTableType,
} from "../../../../../pages/Delivery/Config/Sections/types";

export interface SectionsTableProps {
  getAll: () => void;
  listSections: SectionsTableType[];
  tableLoading: boolean;
  setTableLoading: (val: boolean) => void;
  loadingText: string;
  sendAlert: (message: string, type: AlertType) => void;
  setEditValues: (val: SectionsTableType) => void;
  setOpen: (val: boolean) => void;
  setIsEdit: (val: boolean) => void;
}
