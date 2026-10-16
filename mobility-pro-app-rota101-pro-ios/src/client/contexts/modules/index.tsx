import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { customToast } from '../../../utils/FlashMessage';
import { translate } from '../../locales';
import { modulesService } from './services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from '../../../context/ConfigGlobal';

interface ModuleArray extends Array<ModuleItem> { }
export interface ModuleItem {
  id: number;
  isActive: boolean;
  logo: string;
  moduleName: string;
  statusId: number;
}

interface iModules {
  modulesActives: ModuleArray;
  getModules: () => void;
  init: string;
  verifyDelivery: boolean;
  loading: boolean;
}

const ModulesContext = createContext<iModules>({} as iModules);

export const ModulesProvider = ({ children }: any) => {
  const [modulesActives, setModulesActives] = useState<any>([]);
  const [init, setInit] = useState('');
  const { itsNetwork } = useNetwork();
  const [loading, setLoading] = useState(true);
  const [verifyDelivery, setVerifyDelivery] = useState<boolean>(false);

  const verifyModule = (moduleName: string, data: any) => {
    return modulesActives.some((item: any) => item.moduleName === moduleName);
  };

  useEffect(() => {
    getModules();
  }, [itsNetwork]);

  const setModules = async (data: any) => {
    await AsyncStorage.setItem('modulesCache', JSON.stringify(data));
  };

  const getModulesStorage = async () => {
    const data = await AsyncStorage.getItem('modulesCache');
    if (!data) {
      return false;
    }
    return JSON.parse(data);
  };

  const getModules = async () => {
    try {
      const { data } = await modulesService.get();
      if (!data.status) {
        return customToast(translate('contexts.error_module'), 'danger');
      }
      setModules(data.data);

      if (
        data.data.some(
          (item: ModuleItem) => item.moduleName === 'SpeedMob' && item.isActive,
        )
      ) {
        setInit('SpeedMob');
        return setModulesActives(
          data.data.filter(
            (item: ModuleItem) => item.moduleName === 'SpeedMob',
          ),
        );
      }

      const activeModules = data.data.filter((item: ModuleItem) => item.isActive);

      if (data.data.length === 1) {
        setInit(data.data[0].moduleName);
        return setModulesActives(activeModules);
      }
      verifyModule('Delivery', data);

      if (activeModules.some((item) => item.moduleName === 'Mobilidade')) {
        setInit('Mobilidade');
      } else if (activeModules.some((item) => item.moduleName === 'Delivery')) {
        setInit('Delivery');
      } else {
        const firstActive = activeModules[0];
        setInit(firstActive?.moduleName || 'Delivery');
      }
      return setModulesActives(activeModules);
    } catch (error) {
      const response: any = await getModulesStorage();
      if (response) {
        const activeModules = response.filter((item: ModuleItem) => item.isActive);
        setModulesActives(activeModules);
        const firstActiveModule = activeModules[0];
        setInit(firstActiveModule?.moduleName || 'Delivery');
        return;
      }

      return setInit('Delivery');
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      modulesActives,
      getModules,
      init,
      loading,
      verifyDelivery,
    }),
    [modulesActives, getModules, init, verifyDelivery, loading],
  );

  return (
    <ModulesContext.Provider value={value}>{children}</ModulesContext.Provider>
  );
};
export const useModules = () => {
  const context = useContext(ModulesContext);
  return context;
};
