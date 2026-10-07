import {format} from 'date-fns';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useAuth} from '../../../context/auth';
import {customToast} from '../../../utils/FlashMessage';
import {now} from '../../utils/FormatDate';

import {serviceTrasference} from './service';

interface PropsContext {
  detailAccountBallance: any;
  getLastTransactions: any;
  makeWithdraw: any;
  editAccount: any;
  createAccount: any;
  getBanksList: any;
}

const TransferenceContext = createContext({} as PropsContext);
export const TransferenceProvider = ({children}: any) => {
  const {user} = useAuth();
  const detailAccountBallance = useCallback(async () => {
    try {
      const response = await serviceTrasference.getInfo(user.idUser);
      return response;
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  const getLastTransactions = useCallback(async () => {
    try {
      const response = await serviceTrasference.getLastTransactions(
        user.idCustomer,
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  const makeWithdraw = useCallback(
    async (amount: number) => {
      try {
        const response = await serviceTrasference.postWithdraw(
          user.idCustomer,
          amount,
        );
        return response;
      } catch (err: any) {
        customToast(err.data.message, 'error');
      }
    },
    [user],
  );

  const editAccount = useCallback(
    async (account: any, idBank: string) => {
      try {
        const response = await serviceTrasference.editAccount(
          account,
          user.idUser,
          idBank,
        );
        return response;
      } catch (err) {
        console.log(err);
      }
    },
    [user],
  );

  const getBanksList = useCallback(async () => {
    try {
      const response = await serviceTrasference.getBanksList();
      return response;
    } catch (err) {
      console.log(err);
    }
  }, []);

  function now() {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }

  const createAccount = useCallback(
    (account: any) => {
      try {
        const response = serviceTrasference.createAccount(
          account,
          user.idUser,
          now(),
        );
        return response;
      } catch (err) {
        console.log(err);
      }
    },
    [user],
  );

  const value = useMemo(() => {
    return {
      detailAccountBallance,
      getLastTransactions,
      makeWithdraw,
      editAccount,
      createAccount,
      getBanksList,
    };
  }, [
    detailAccountBallance,
    getLastTransactions,
    makeWithdraw,
    editAccount,
    createAccount,
    getBanksList,
  ]);

  return (
    <TransferenceContext.Provider value={value}>
      {children}
    </TransferenceContext.Provider>
  );
};
export const useTransference = () => {
  const context = useContext(TransferenceContext);
  return context;
};
