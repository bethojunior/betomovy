import { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../client/locales';
import { AutoReadToggleProps } from './types';
import { Row, IconWrapper, TextColumn, Title, Description } from './styles';

// Conteúdo do card "Leitura automática" (ícone + título + descrição), compartilhado
// entre client e driver — cada lado só injeta seu próprio componente de Switch.
export const AutoReadToggle: FC<AutoReadToggleProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Row>
      <IconWrapper>
        <Ionicons name="volume-high" size={20} color={theme.colors.primary} />
      </IconWrapper>
      <TextColumn>
        <Title>{translate('trip.chat.auto_read_title')}</Title>
        <Description>{translate('trip.chat.auto_read_description')}</Description>
      </TextColumn>
      {children}
    </Row>
  );
};
