import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {customToast} from '../../../../utils/FlashMessage';
import {ChildrenType} from '../../../@types';
import {useUserDriver} from '../userDriver';
import {BankService} from './service';
import {AccountInfo, IBankContext} from './types';

const BankContext = createContext({} as IBankContext);

export const BankProvider = ({children}: ChildrenType) => {
  const {userDriverFind} = useUserDriver();
  const service = BankService();
  const [account, setAccount] = useState({} as AccountInfo);

  const getLatestTransactions = async () => {
    try {
      const driverId = userDriverFind.idDriver;

      const response = await service.getLatestTransactions(driverId);

      if (typeof response === 'string') {
        customToast(response, 'danger');

        return false;
      }

      return response;
    } catch (err) {
      return false;
    }
  };

  const getCoinType = useCallback(async () => {
    try {
      const response = await service.getCoinType();

      if (typeof response === 'string') {
        customToast(response, 'danger');

        return false;
      }

      return response;
    } catch (err) {
      return false;
    }
  }, [service, userDriverFind]);

  const getAccount = useCallback(async () => {
    try {
      const driverId = userDriverFind.idDriver;

      const response = await service.getAccount(driverId);

      if (typeof response === 'string') {
        customToast(response, 'warning');

        return false;
      }

      setAccount(response);

      return response;
    } catch (err) {
      return false;
    }
  }, [service, userDriverFind]);

  const withdraw = useCallback(
    async (amount: string) => {
      try {
        const driverId = userDriverFind.idDriver;

        await service.withdraw(driverId, amount);
      } catch (err) {
        console.log(err);
      }
    },
    [service, userDriverFind],
  );

  const getBanksList = useCallback(async () => {
    try {
      const response = await service.getBankList();

      if (typeof response === 'string') {
        customToast(response, 'danger');

        return false;
      }

      return response;
    } catch (err) {
      return false;
    }
  }, []);

  const editAccount = useCallback(
    async (accountUser: AccountInfo, idBank: string) => {
      try {
        const driverId = userDriverFind.idDriver;

        const response = await service.editAccount(
          accountUser,
          driverId,
          userDriverFind.userId,
          idBank,
        );

        if (!response.status) {
          customToast(response.message, 'danger');

          return response.status;
        }

        customToast(response.message, 'success');

        return response.status;
      } catch (err) {
        return false;
      }
    },
    [service, userDriverFind],
  );

  const createAccount = useCallback(
    async (accountUser: AccountInfo) => {
      try {
        const driverId = userDriverFind.idDriver;

        const response = await service.createAccount(
          accountUser,
          driverId,
          userDriverFind.userId,
        );

        if (!response.status) {
          customToast(response.message, 'danger');

          return response.status;
        }

        customToast(response.message, 'success');

        return response.status;
      } catch (err) {
        return false;
      }
    },
    [service, userDriverFind],
  );

  const requestWithdraw = useCallback(
    async (amount: number) => {
      try {
        const driverId = Number(userDriverFind.idDriver);

        const response = await service.requestWithdraw(driverId, amount);

        if (!response.status) {
          Alert.alert(
            `Valor Minimo: ${response.data.minimunValue}`,
            response.errors.message,
          );

          return response.status;
        }

        customToast(response.message, 'success');

        return response.status;
      } catch (err) {
        return false;
      }
    },
    [service, userDriverFind],
  );

  const getTransactions = useCallback(
    async (page: number, flow: string, dateStart: string, dateEnd: string) => {
      try {
        const driverId = userDriverFind.idDriver;

        const response = await service.getTransactions(
          driverId,
          dateStart,
          dateEnd,
          page,
          flow,
        );

        if (typeof response === 'string') {
          customToast(response, 'danger');

          return false;
        }

        return response;
      } catch (err) {
        return false;
      }
    },
    [service, userDriverFind],
  );

  const value = useMemo(() => {
    return {
      getLatestTransactions,
      getCoinType,
      getAccount,
      account,
      setAccount,
      withdraw,
      getBanksList,
      editAccount,
      createAccount,
      requestWithdraw,
      getTransactions,
    };
  }, [
    getLatestTransactions,
    getCoinType,
    getAccount,
    account,
    setAccount,
    withdraw,
    getBanksList,
    editAccount,
    createAccount,
    requestWithdraw,
    getTransactions,
  ]);
  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
};
export const useBank = () => {
  const context = useContext(BankContext);
  return context;
};
