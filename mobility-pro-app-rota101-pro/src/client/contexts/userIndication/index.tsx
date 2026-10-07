// @ts-nocheck

import {createContext, useCallback, useContext, useMemo} from 'react';
import {customToast} from '../../../utils/FlashMessage';
import {translate} from '../../locales';
import {userIndicationService} from './services';

interface IndicationContext {
  getIndication: any;
}

const UserIndicationContext = createContext<IndicationContext>(
  {} as IndicationContext,
);

export const UserIndicationProvider = ({children}: any) => {
  const getIndication = useCallback(async (page: number) => {
    try {
      const {data} = await userIndicationService.get(page);

      if (!data.status) {
        return customToast(translate('contexts.error_indication'), 'danger');
      }

      return data;
    } catch (error) {
      return customToast(translate('contexts.error_indication'), 'danger');
    }
  }, []);

  const value = useMemo(() => ({getIndication}), [getIndication]);

  return (
    <UserIndicationContext.Provider value={value}>
      {children}
    </UserIndicationContext.Provider>
  );
};
export const UseUserIndication = () => {
  const context = useContext(UserIndicationContext);
  return context;
};
