import { DeliveryListProps } from "../../../../../pages/Delivery/Config/DeliveryAccessories/types";

export interface AccessoriesTableProps {
  getAll: () => void;
  setTableLoading: (val: boolean) => void;
  tableLoading: boolean;
  sendAlert: (message: string, type: AlertType) => void;
  loadingText: string;
  accessoriesList: DeliveryListProps[];
  edit: (val: DeliveryListProps) => void;
}
