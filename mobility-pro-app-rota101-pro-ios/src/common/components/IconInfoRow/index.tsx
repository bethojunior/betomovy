import { RFValue } from 'react-native-responsive-fontsize';
import { IconBadge } from '../IconBadge';
import { Row, TextGroup, Label, Value } from './styles';
import { IconInfoRowProps } from './types';

/** Linha somente-leitura: ícone + label + valor. Diferente do EditableItemProfile (que sempre tem ação de editar). */
export function IconInfoRow({ icon, label, value, variant = 'primary', valueVariant, color, showDivider = true }: IconInfoRowProps) {
  return (
    <Row showDivider={showDivider}>
      <IconBadge icon={icon} variant={variant} color={color} size={RFValue(36)} shape="square" />
      <TextGroup>
        <Label>{label}</Label>
        <Value variant={valueVariant}>{value}</Value>
      </TextGroup>
    </Row>
  );
}
