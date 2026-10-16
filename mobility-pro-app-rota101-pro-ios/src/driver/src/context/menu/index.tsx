import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {customToast} from '../../../../utils/FlashMessage';
import {ChildrenType} from '../../../@types';
import {MenuService} from './service';
import {IManuContext, OptionsProps} from './types';
import {storage} from '../../../../common/services/mmkv/storage';

const CACHE_KEY_MENU_OPTIONS = '@Driver:menuOptions';

function loadCachedOptions(): OptionsProps[] {
  return (storage.getItem(CACHE_KEY_MENU_OPTIONS, 'json') as OptionsProps[]) ?? [];
}

function saveCachedOptions(options: OptionsProps[]): void {
  storage.setItem(CACHE_KEY_MENU_OPTIONS, options, 'json');
}

const MenuContext = createContext({} as IManuContext);

export const MenuProvider = ({children}: ChildrenType) => {
  const service = MenuService();
  const [optionsMenu, setOptionsMenu] = useState<OptionsProps[]>([]);

  useEffect(() => {
    setOptionsMenu(loadCachedOptions());
  }, []);

  const getMenuOptions = async () => {
    try {
      const response = await service.getMenuOptions();

      if (typeof response === 'string') {
        customToast(response, 'danger');
        return false;
      }

      saveCachedOptions(response);
      setOptionsMenu(response);
      return response;
    } catch (err) {
      return false;
    }
  };

  const value = useMemo(() => {
    return {
      getMenuOptions,
      optionsMenu,
      setOptionsMenu,
    };
  }, [getMenuOptions, optionsMenu, setOptionsMenu]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
export const useMenu = () => {
  const context = useContext(MenuContext);
  return context;
};
