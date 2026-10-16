import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { IconBadge } from '../FormFieldRow/styles';
import { CollapsibleSectionProps } from './types';
import { Card, Content, HeaderRow, Title, TitleRow } from './styles';

/** Card colapsável — usado pros blocos opcionais (dados da conta, endereço); estado controlado pelo pai pra virar sanfona. */
export function CollapsibleSection({ title, icon, expanded, onToggle, children }: CollapsibleSectionProps) {
  const theme = useTheme();

  return (
    <Card>
      <HeaderRow activeOpacity={0.7} onPress={onToggle}>
        <TitleRow>
          <IconBadge>{icon}</IconBadge>
          <Title>{title}</Title>
        </TitleRow>
        <FontAwesome5
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={RFValue(12)}
          color={theme.colors.grayLight}
        />
      </HeaderRow>

      {expanded && <Content>{children}</Content>}
    </Card>
  );
}
