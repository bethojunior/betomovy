import { BankAccountType, DriverBankAccount, PixKeyType } from "./types";

export const ACCOUNT_TYPE_LABEL: Record<BankAccountType, string> = {
  corrente: "Conta corrente",
  poupanca: "Poupança",
  outra: "Outra",
};

export const PIX_TYPE_LABEL: Record<PixKeyType, string> = {
  cpf_cnpj: "CPF/CNPJ",
  phone: "Telefone",
  email: "E-mail",
  random: "Chave aleatória",
};

// 11 dígitos → CPF, 14 → CNPJ; outros tamanhos ficam como vieram
export const formatDocument = (value?: string | null) => {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (digits.length === 14) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return value ?? "";
};

// "1234" + "5" → "1234-5"
export const withDigit = (value?: string | null, digit?: string | null) => {
  if (!value) return "";
  return digit ? `${value}-${digit}` : value;
};

export const hasBankAccount = (account: DriverBankAccount) => !!(account.bankId && account.numberAccount);

export const hasPix = (account: DriverBankAccount) => !!account.pix;

// Máscara progressiva: só adiciona o separador quando já há dígito depois dele
export const maskDocument = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length <= 11) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};
