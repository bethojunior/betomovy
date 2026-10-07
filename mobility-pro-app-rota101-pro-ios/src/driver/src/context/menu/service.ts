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
      (item: OptionsProps) => item.configTypeId === '1',
    );

    return dataFiltered;
  }, [apiMain]);

  return {
    getMenuOptions,
  };
};
