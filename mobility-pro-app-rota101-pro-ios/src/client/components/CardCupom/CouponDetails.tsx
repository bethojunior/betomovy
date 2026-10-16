import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import {DetailList, DetailRow, DetailText} from './styles';
import {CouponDetailsProps} from './types';

/** Lista de regras do cupom — só renderiza os itens já prontos, não decide o que mostrar. */
export function CouponDetails({items}: CouponDetailsProps) {
  return (
    <DetailList>
      {items.map(item => (
        <DetailRow key={item.key}>
          <MaterialIcons name={item.icon as any} size={RFValue(11)} color={theme.colors.text_gray} />
          <DetailText>{item.text}</DetailText>
        </DetailRow>
      ))}
    </DetailList>
  );
}
