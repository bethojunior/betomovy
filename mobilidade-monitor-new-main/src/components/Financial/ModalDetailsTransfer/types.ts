import { FinancialProps } from "../../../pages/Financial/TransferRequests/types";

export interface ModalDetailsTransferProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  datasTransfer: FinancialProps | undefined;
}

export type WithdrawStatus = "pending" | "approved" | "rejected";
