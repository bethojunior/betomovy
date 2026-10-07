import { Listlocals } from "../../../../pages/Delivery/RegisterEstablishments/types";

export interface LocalsModalProps {
  listLocals: Listlocals[];
  visibility: boolean;
  onCancel: () => void;
  updatePrimaryLocal: (id: number, companyId: number) => void;
  deleteLocal: (id: number, companyId: number) => void;
  loadingText: string;
  setLoadingText: (val: string) => void;
  setPlaceSelected: (val: string) => void;
  addLocal: () => void;
  setIsDefault: (val: boolean) => void;
}

export interface LocalsContainerProps {
  isDefault: number;
}
