import {
  DeliveryListProps,
  FieldType,
} from "../../../../../pages/Delivery/Config/DeliveryAccessories/types";

export interface AccessoriesModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onFinish: (values: FieldType) => void;
  editValues: DeliveryListProps | undefined;
}
