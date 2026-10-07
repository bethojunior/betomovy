import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useLocalProvider} from '../local';
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
  const {location: position} = useLocalProvider();

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
          {
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
          },
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
