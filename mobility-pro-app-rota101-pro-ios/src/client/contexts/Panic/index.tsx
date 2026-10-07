import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useLocal} from '../local';
import {PanicService} from './services';

interface PropsContext {
  getListProblems: () => Promise<any>;
  alertPanicOnMonitor: any;
}

interface PropsPosition {
  latitude?: number;
  longitude?: number;
}

const PanicContext = createContext({} as PropsContext);
export const PanicProvider = ({children}: any) => {
  const {position} = useLocal();
  const getListProblems = useCallback(async () => {
    try {
      const response = await PanicService.list();
      return response;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const alertPanicOnMonitor = useCallback(
    async (emergencyId: string) => {
      try {
        const response = await PanicService.postAlertPanicOnMonitor(
          position as PropsPosition | any,
          emergencyId,
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    [position],
  );

  const value = useMemo(() => {
    return {
      getListProblems,
      alertPanicOnMonitor,
    };
  }, [getListProblems, alertPanicOnMonitor]);
  return (
    <PanicContext.Provider value={value}>{children}</PanicContext.Provider>
  );
};
export const usePanic = () => {
  const context = useContext(PanicContext);
  return context;
};
