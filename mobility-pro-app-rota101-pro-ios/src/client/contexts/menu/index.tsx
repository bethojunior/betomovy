import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ChildrenType } from '../../../driver/@types';
import { customToast } from '../../../utils/FlashMessage';

import { MenuService } from './service';
import { ExternalLinkProps, IManuContext, OptionsProps } from './types';

const MenuContext = createContext({} as IManuContext);

export const MenuProvider = ({ children }: ChildrenType) => {
  const service = MenuService();
  const [optionsMenu, setOptionsMenu] = useState<OptionsProps[]>([]);
  const [externalLink, setExternalLink] = useState<ExternalLinkProps>();

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

  const getExternalLink = async () => {
    try {
      const response = await service.getLinkMenu();

      return setExternalLink(response);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMenuOptions();
    getExternalLink();
  }, []);

  const value = useMemo(() => {
    return {
      getMenuOptions,
      optionsMenu,
      setOptionsMenu,
      externalLink
    };
  }, [getMenuOptions, optionsMenu, setOptionsMenu]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  return context;
};
