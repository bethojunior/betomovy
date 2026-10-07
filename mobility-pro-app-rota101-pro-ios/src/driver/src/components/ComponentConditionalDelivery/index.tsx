import {useDeliveryOrder} from '../../../../context/DeliveryOrder';

interface Props {
  NoTripActiveComponent: any;
  TripActiveComponent: any;
}

export const ComponentConditionalDelivery = ({
  NoTripActiveComponent,
  TripActiveComponent,
}: Props) => {
  const {ordersActive} = useDeliveryOrder();
  if (ordersActive && ordersActive?.length > 0) {
    return TripActiveComponent;
  }
  return NoTripActiveComponent;
};
