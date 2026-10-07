import { EditDriverData } from "../../../../pages/Driver/List/types";

export type { EditDriverData };

export interface TypeOfDriver {
  description: string;
  iconMapDriverId: number;
  idUserType: number;
  isActive: number;
  isDeliveryMan: number;
  isDriver: number;
  name: string;
  picture: string;
}

export interface TypeOfDriverArray extends Array<TypeOfDriver> {}

export interface City {
  id: string;
  name: string;
}

export interface ModalProps {
  visibility: boolean | undefined;
  handleCloseModal: () => void;
  driverSelected: EditDriverData;
  typeOfDriver: TypeOfDriverArray | undefined;
  onSearch: () => void;
  handlePrepareEditModal: (idDriver: number) => void;
  baseImageLink: string;
  enableZafiraValidationMonitor?: boolean;
}
