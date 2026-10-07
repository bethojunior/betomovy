import {useCallback} from 'react';
import apiMain from '../../api/apiMain';
import {OptionsProps} from './types';

export const MenuService = () => {
  const getMenuOptions = useCallback(async () => {
    const {data} = await apiMain.get('configmenuapp/search');

    if (!data.status) {
      return data.message;
    }

    const dataFiltered = data.data.filter(
      (item: OptionsProps) => item.configTypeId === '2',
    );

    return dataFiltered;
  }, [apiMain]);

  const getLinkMenu = async () => {
    const {data} = await apiMain.get('menuApp/findByType?type=2');

    if (!data.status || data?.data?.length === 0) {
      return {};
    }

    return data.message;
  };

  return {
    getMenuOptions,
    getLinkMenu
  };
};
