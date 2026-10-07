export type BankAccountType = "corrente" | "poupanca" | "outra";

export type PixKeyType = "cpf_cnpj" | "phone" | "email" | "random";

// Conta usada no saque do motorista (tabela bankAccount)
export interface DriverBankAccount {
  holderName: string | null;
  document: string | null;
  bankId: number | null;
  bankName: string | null;
  bankNumber: string | null;
  typeAccount: BankAccountType | null;
  agency: string | null;
  agencyDigit: string | null;
  numberAccount: string | null;
  numberAccountDigit: string | null;
  op: string | null;
  pix: string | null;
  pixType: PixKeyType | null;
}

export interface Bank {
  idBank: number;
  bankNumber: string;
  bankName: string;
}

export type DriverBankAccountPayload = Omit<DriverBankAccount, "bankName" | "bankNumber">;
