import { MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { SheetHeaderProps } from './types';
import { CloseButton, Header, HeaderTitle } from './styles';

// Cabeçalho padrão de bottom sheet (título + botão fechar) — usado por FilterFooter, ModalTransference e os sheets de data do Extrato
export function SheetHeader({ title, onClose }: SheetHeaderProps) {
  const theme = useTheme();

  return (
    <Header>
      <HeaderTitle>{title}</HeaderTitle>
      <CloseButton activeOpacity={0.7} onPress={onClose}>
        <MaterialIcons name="close" size={RFValue(18)} color={theme.colors.secondary} />
      </CloseButton>
    </Header>
  );
}
