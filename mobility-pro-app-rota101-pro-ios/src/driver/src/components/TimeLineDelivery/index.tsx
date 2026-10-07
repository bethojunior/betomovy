import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Collapse, {
  CollapseDynamic,
} from '../../../../client/components/Collapse';
import {InfoRow, InfoText, StatusIndicator} from './styles';
import {
  MaterialIcons,
  Entypo,
  Octicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {TimeLineComponent} from '../TimeLineComponent';
import {OrderStatus} from '../CardOrder/Constants';

export const TimeLineDelivery = ({order, open, cityConfig}) => {
  const blinkAnim = useSharedValue(1);
  blinkAnim.value = withRepeat(withTiming(0, {duration: 1000}), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({opacity: blinkAnim.value}));

  const steps = ['Coleta', 'Entrega'];

  const orderIndex = [
    OrderStatus.ORDER_ACCEPTED_DELIVERY_MAN,
    OrderStatus.ORDER_WITHDRAWING,
  ].includes(order.deliveryOrderStatusId);

  const activeIndex = orderIndex
    ? 0
    : order.deliveryOrderStatusId >= OrderStatus.ORDER_ARRIVED
    ? 2
    : 1;

  return (
    <CollapseDynamic open={open}>
      <TimeLineComponent
        order={order}
        steps={steps}
        activeIndex={activeIndex}
      />
      <InfoRow>
        <MaterialIcons name="payment" size={24} color="black" />
        <InfoText>
          Valor: {cityConfig?.typeMoney || 'R$'} {order?.value} -{' '}
          {order?.delivery_payment_form?.name || 'Não informado'}
        </InfoText>
      </InfoRow>
      {activeIndex >= 1 && (
        <>
          <InfoRow>
            <Octicons name="number" size={24} color="black" />
            <InfoText>
              Nº do local - {order?.delivery_order_place?.place?.number || ''}
            </InfoText>
          </InfoRow>
          <InfoRow>
            <MaterialCommunityIcons
              name="source-commit-end-local"
              size={24}
              color="black"
            />
            <InfoText>
              Complemento -{' '}
              {order?.delivery_order_place?.place?.complement || ''}
            </InfoText>
          </InfoRow>
          <InfoRow>
            <Entypo name="address" size={24} color="black" />
            <InfoText>
              Ponto de referência -{' '}
              {order?.delivery_order_place?.place?.referencePoint || ''}
            </InfoText>
          </InfoRow>
        </>
      )}

      <StatusIndicator style={animatedStyle} status={5} />
    </CollapseDynamic>
  );
};
