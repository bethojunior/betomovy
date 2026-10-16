import {useCallback} from 'react';
import {customToast} from '../../../../utils/FlashMessage';
import apiMain from '../../api/apiMain';
import {AccountInfo} from './types';
import Helper from '../../../../client/utils/Helper';

export const BankService = () => {
  const getLatestTransactions = useCallback(
    async (driverId: string) => {
      const {data} = await apiMain.post('Balance/LastDriverTransactions', {
        stdObject: [
          {
            driverId,
          },
        ],
      });

      if (!data.status) {
        return data.message;
      }

      return data.data;
    },
    [apiMain],
  );

  const verifyCurrentAdquirer = async () => {
    const {data} = await apiMain.get('Adquirer/CurrentAdquirer');

    if (!data?.status) {
      return data?.message;
    }

    return data?.data;
  };

  const verifyPaymentPixCode = async idPix => {
    const {data} = await apiMain.post('DriverCredit/ShowCreditPix', {
      transactionId: idPix,
    });

    return data;
  };

  const generatePixCode = async value => {
    const {data} = await apiMain.post('DriverCredit/AddViaPix', {
      amount: value,
    });

    return data;
  };

  const getCoinType = useCallback(async () => {
    const {data} = await apiMain.get('Balance/GetTypes');

    if (!data.status) {
      return data.message;
    }

    return data.data;
  }, [apiMain]);

  const getAccount = useCallback(
    async (driverId: Number) => {
      const {data} = await apiMain.post('Driver/FindWithAccountInfo', {
        stdObject: [
          {
            driverId,
          },
        ],
      });

      if (!data.status) {
        return data.message;
      }

      return data.data;
    },
    [apiMain],
  );

  const withdraw = useCallback(
    async (driverId: string, value: string) => {
      const {data} = await apiMain.post('Withdraw/New', {
        stdObject: [
          {
            driverId,
            value,
          },
        ],
      });

      if (!data.status) {
        customToast(data.message, 'danger');

        return;
      }

      customToast(data.message, 'success');
    },
    [apiMain],
  );

  const getTransactions = useCallback(
    async (
      driverId: string,
      dateStart: string,
      dateEnd: string,
      page: number,
      flow: string,
    ) => {
      const std = {
        driverId,
        date_interval: {
          date_start: dateStart,
          date_end: dateEnd,
        },
        page,
      };

      const {data} = await apiMain.post('Balance/DriverTransactions', {
        stdObject: [flow !== '' ? {...std, flow} : std],
      });

      if (!data.status) {
        return data.message;
      }

      return data.data;
    },
    [apiMain],
  );

  const getBankList = useCallback(async () => {
    const {data} = await apiMain.get('Bank/GetAll');

    if (!data.status) {
      return data.message;
    }

    return data.data;
  }, [apiMain]);

  const editAccount = useCallback(
    async (
      account: AccountInfo,
      driverId: string,
      userId: string,
      idBankAccount: string,
    ) => {
      const {data} = await apiMain.post('BankAccount/Edit', {
        stdObject: [
          {
            idBankAccount: Number(idBankAccount),
            userId: Number(userId),
            driverId: Number(driverId),
            agency: account.agency,
            agencyDigit: account.agencyDigit,
            bankId: account?.bankId ? Number(account.bankId) : undefined,
            document: account.document,
            holderName: account.holderName,
            numberAccount: account.numberAccount,
            numberAccountDigit: account.numberAccountDigit,
            op: account.op,
            pix: account.pix,
            typeAccount: account.typeAccount,
            ...account,
            neighborhood: account?.neighborhood || 'Bairro',
            dateOfBirth: account.dateOfBirth?.includes('-')
              ? account?.dateOfBirth
              : Helper.formatDateApiDefault(account?.dateOfBirth),
          },
        ],
      });

      return data;
    },
    [apiMain],
  );

  const createAccount = useCallback(
    async (account: AccountInfo, driverId: string, userId: string) => {
      const {data} = await apiMain.post('BankAccount/Insert', {
        stdObject: [
          {
            agency: account.agency,
            agencyDigit: account.agencyDigit,
            bankId: account?.bankId ? Number(account.bankId) : undefined,
            driverId: Number(driverId),
            document: account.document,
            holderName: account.holderName,
            numberAccount: account.numberAccount,
            numberAccountDigit: account.numberAccountDigit,
            op: account.op,
            pix: account.pix,
            typeAccount: account.typeAccount,
            userId: Number(userId),
            ...account,
            neighborhood: account?.neighborhood || 'Bairro',
            dateOfBirth: Helper.formatDateApiDefault(account?.dateOfBirth),
          },
        ],
      });
      return data;
    },
    [apiMain],
  );

  const requestWithdraw = useCallback(
    async (driverId: number, value: number) => {
      const {data} = await apiMain.post('Withdraw/new', {
        stdObject: [
          {
            driverId,
            value,
          },
        ],
      });

      return data;
    },
    [apiMain],
  );

  return {
    getLatestTransactions,
    getCoinType,
    getAccount,
    withdraw,
    getTransactions,
    getBankList,
    editAccount,
    createAccount,
    requestWithdraw,
    verifyCurrentAdquirer,
    verifyPaymentPixCode,
    generatePixCode,
  };
};
