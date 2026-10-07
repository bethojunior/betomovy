import { EstablishmentsList } from "../../../../../pages/Delivery/Config/Establishments/types";

export type FieldType = {
  name: string;
  description: string;
};

export interface RegisterAndEditModalProps {
  title: string;
  open: boolean;
  registerOrEdit: (e: FieldType) => void;
  onCancel: () => void;
  editValues: EstablishmentsList | undefined;
}
