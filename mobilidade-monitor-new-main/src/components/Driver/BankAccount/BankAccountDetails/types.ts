import { ReactNode } from "react";

import { DriverBankAccount } from "../types";

export interface BankAccountDetailsProps {
  account: DriverBankAccount;
  canEdit: boolean;
  onEdit: () => void;
}

export interface InfoFieldProps {
  icon: ReactNode;
  label: string;
  value?: string | null;
  // Quantas colunas do grid o campo ocupa
  span?: number;
  action?: ReactNode;
}

export interface SpanProps {
  $span?: number;
}

export interface ColumnsProps {
  $columns: number;
}
