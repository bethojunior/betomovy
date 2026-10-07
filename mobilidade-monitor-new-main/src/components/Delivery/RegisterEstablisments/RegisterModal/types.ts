import {
  EstablishmentsProps,
  PerfilProps,
  SelectProps,
} from "../../../../pages/Delivery/RegisterEstablishments/types";

export interface RegisterModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onSave: (val: any) => void;
  listPerfil: PerfilProps[];
  listFantasyName: SelectProps[];
  onSearch: (val: string) => void;
  loadingText: string;
  editValues: EstablishmentsProps | undefined;
  onEdit: (values: any) => void;
}
