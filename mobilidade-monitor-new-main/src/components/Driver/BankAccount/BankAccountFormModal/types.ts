import { DriverBankAccount } from "../types";

export interface BankAccountFormModalProps {
  visible: boolean;
  driverId: number;
  account: DriverBankAccount | null;
  onClose: () => void;
  onSaved: () => void;
}

export interface BankAccountFormValues {
  holderName: string;
  document: string;
  bankId?: number;
  typeAccount?: DriverBankAccount["typeAccount"];
  agency?: string;
  agencyDigit?: string;
  numberAccount?: string;
  numberAccountDigit?: string;
  op?: string;
  pixType?: DriverBankAccount["pixType"];
  pix?: string;
}
