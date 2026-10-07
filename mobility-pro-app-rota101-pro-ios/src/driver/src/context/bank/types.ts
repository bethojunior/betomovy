export interface IBankContext {
  getLatestTransactions: () => Promise<LatestTransactions>;
  getCoinType: () => Promise<CoinTypes[]>;
  getAccount: () => Promise<AccountInfo>;
  account: AccountInfo;
  setAccount: (account: AccountInfo) => void;
  getBanksList: () => Promise<BankProps[]>;
  editAccount: (
    account: AccountInfo,
    idBank: string,
  ) => Promise<boolean | void>;
  createAccount: (account: AccountInfo) => Promise<boolean | void>;
  requestWithdraw: (value: number) => Promise<boolean | void>;
  getTransactions: (
    page: number,
    flow: string,
    dateStart: string,
    dateEnd: string,
  ) => Promise<TransactionsProps>;
}

export interface LatestTransactions {
  balance: Balance;
  transactions: LastTransactionProps[];
}

export interface Balance {
  balance: string;
  blockedBalance: string;
  idBalance: string;
  pendingBalanceWithdraw: string;
}

export interface LastTransactionProps {
  balanceFlowTypeId: string;
  color: string;
  date: string;
  flow: string;
  price: string;
  summary: string;
  tripReference: string;
  value: string;
}

export interface CoinTypes {
  id: string;
  flow: string;
  color: string;
  short_description: string;
}

export interface AccountInfo {
  agency: string;
  agencyDigit: string;
  balance: string;
  bankName: string;
  document: string;
  holderName: string;
  idBankAccount: string;
  idDriver: string;
  idUser: string;
  name: string;
  numberAccount: string;
  numberAccountDigit: string;
  op: string;
  pix: string;
  typeAccount?: string;
  bankId?: string;
}

export interface DriverInfoProps {
  balance: string;
  blockedBalance: string;
  blockedBalanceToPay: string;
  document: string;
  holderName: string;
  name: string;
  pendingBalanceWithdraw: string;
  period: string;
  total_credit: string;
  total_debit: string;
}

export interface Pagination {
  currentPage: number | string;
  endRange: number;
  lastPage: number;
  nextPage: number;
  previousPage: number;
  showEndButton: boolean;
  showStartButton: boolean;
  startRange: number;
  startRow: number;
  totalRows: string;
}

export interface BankProps {
  bankName: string;
  bankNumber: string;
  idBank: string;
}

export interface TransactionsProps {
  driverInfo: DriverInfoProps;
  transactions: LastTransactionProps[];
  paginate: Pagination;
}
