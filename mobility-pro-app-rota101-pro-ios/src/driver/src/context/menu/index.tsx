import {createContext, useContext, useMemo, useState} from 'react';
import {customToast} from '../../../../utils/FlashMessage';
import {ChildrenType} from '../../../@types';
import {MenuService} from './service';
import {IManuContext, OptionsProps} from './types';

const MenuContext = createContext({} as IManuContext);

export const MenuProvider = ({children}: ChildrenType) => {
  const service = MenuService();
  const [optionsMenu, setOptionsMenu] = useState<OptionsProps[]>([]);

  const getMenuOptions = async () => {
    try {
      const response = await service.getMenuOptions();

      if (typeof response === 'string') {
        customToast(response, 'danger');

        return false;
      }
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
