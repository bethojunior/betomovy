import apiMain from '../../api/apiMain';

export const serviceTrasference = {
  getInfo: async (id: string) => {
    const response = await apiMain.post(`BankAccount/GetByUser`, {
      userId: id,
    });
    return response.data;
  },
  getLastTransactions: async (idCustomer: string) => {
    const response = await apiMain.post(`PartnerBalance/LastTransactions`, {
      customerId: idCustomer,
    });
    return response.data;
  },
  postWithdraw: async (idCustomer: number, amount: number) => {
    const response = await apiMain.post(`PartnerBalance/Withdraw`, {
      customerId: Number(idCustomer),
      value: amount,
    });
    return response.data;
  },
  editAccount: async (account: any, userId: string, idBankAccount: string) => {
    const stdObject = [
      {
        agency: account.agency,
        agencyDigit: account.agencyDigit,
        bankId: account.bankId,
        document: account.document,
        driverId: null,
        holderName: account.holderName,
        idBankAccount: idBankAccount,
        numberAccount: account.numberAccount,
        numberAccountDigit: account.numberAccountDigit,
        op: account.op,
        pix: account.pix,
        typeAccount: account.typeAccount,
        userId: userId,
      },
    ];
    const response = await apiMain.post(`BankAccount/Edit`, {
      stdObject,
    });
    return response.data;
  },
  createAccount: async (account: any, userId: string, date: string) => {
    const stdObject = [
      {
        agency: account.agency,
        agencyDigit: account.agencyDigit,
        bankId: account.bankId,
        document: account.document,
        holderName: account.holderName,
        numberAccount: account.numberAccount,
        numberAccountDigit: account.numberAccountDigit,
        op: account.op,
        pix: account.pix,
        typeAccount: account.typeAccount,
        userId: userId,
      },
    ];
    const response = await apiMain.post(`BankAccount/Insert`, {
      stdObject,
    });
    return response.data;
  },
  getBanksList: async () => {
    const response = await apiMain.get(`Bank/GetAll`);
    return response.data;
  },
};
