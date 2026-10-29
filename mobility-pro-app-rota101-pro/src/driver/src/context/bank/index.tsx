import { useState } from 'react';
import { Alert } from 'react-native';
import { translate } from '../../../../client/locales';
import { storage } from '../../../../common/services/mmkv/storage';
import { customToast } from '../../../../utils/FlashMessage';
import { BankService } from './service';
import { AccountInfo } from './types';

export const useBank = () => {
  const service = BankService();
  const { getItem } = storage;

  const getUserDriverFind = () => {
    try {
      const data = getItem('userDriverFindLocal', 'json');
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      return data || {};
    } catch {
      return {};
    }
  };

  const getLatestTransactions = async () => {
    try {
      const userDriverFind = getUserDriverFind();
      const driverId = userDriverFind?.idDriver;
      if (!driverId) return false;

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

  const getCoinType = async () => {
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
  };

  const getAccount = async () => {
    try {
      const userDriverFind = getUserDriverFind();
      const driverId = userDriverFind?.idDriver;
      if (!driverId) return false;

      const response = await service.getAccount(parseInt(driverId));

      if (typeof response === 'string') {
        return false;
      }

      return response;
    } catch (err) {
      return false;
    }
  };

  const withdraw = async (amount: string) => {
    try {
      const userDriverFind = getUserDriverFind();
      const driverId = userDriverFind?.idDriver;
      if (!driverId) return;

      await service.withdraw(driverId, amount);
    } catch (err) {
      console.log(err);
    }
  };

  const getBanksList = async () => {
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
  };

  const editAccount = async (accountUser: AccountInfo, idBank: string) => {
    try {
      const userDriverFind = getUserDriverFind();
      const driverId = userDriverFind?.idDriver;

      const response = await service.editAccount(
        accountUser,
        driverId,
        userDriverFind?.userId,
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
  };

  const createAccount = async (accountUser: AccountInfo) => {
    try {
      const userDriverFind = getUserDriverFind();
      const driverId = userDriverFind?.idDriver;

      const response = await service.createAccount(
        accountUser,
        driverId,
        userDriverFind?.userId,
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
  };

  const requestWithdraw = async (amount: number) => {
    try {
      const userDriverFind = getUserDriverFind();
      const driverId = Number(userDriverFind?.idDriver);

      const response = await service.requestWithdraw(driverId, amount);

      if (!response.status) {
        Alert.alert(
          response?.data?.minimunValue
            ? `Valor Minimo: ${response.data.minimunValue}`
            : 'Atenção',
          response.errors.message,
        );

        return response.status;
      }

      customToast(response.message, 'success');

      return response.status;
    } catch (err) {
      return false;
    }
  };

  const getTransactions = async (
    page: number,
    flow: string,
    dateStart: string,
    dateEnd: string,
  ) => {
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
  };

  return {
    getLatestTransactions,
    getCoinType,
    getAccount,
    withdraw,
    getBanksList,
    editAccount,
    createAccount,
    requestWithdraw,
    getTransactions,
  };
};
