import {useIsFocused} from '@react-navigation/native';
import {useModals} from '../../../../context/Modals';
import Menu from '../../pages/Menu';
import {If} from '../If';
import {useEffect} from 'react';

const MenuComponent = () => {
  const {visibleMenu, setVisibleMenu} = useModals();

  const isFocused = useIsFocused();

  useEffect(() => {
    return () => {
      setVisibleMenu(false);
    };
  }, [isFocused]);

  return (
    <If condition={visibleMenu}>
      <Menu />
    </If>
  );
};

export default MenuComponent;
